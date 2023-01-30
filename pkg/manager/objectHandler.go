package manager

import (
	"bytes"
	"encoding/base64"
	"encoding/json"
	"errors"
	"fmt"
	"github.com/amlwwalker/greenfinch.react/pkg/cache"
	gspool "github.com/amlwwalker/greenfinch.react/pkg/pool"
	"github.com/amlwwalker/greenfinch.react/pkg/tokens"
	"github.com/nspcc-dev/neo-go/pkg/crypto/keys"
	apistatus "github.com/nspcc-dev/neofs-sdk-go/client/status"
	cid "github.com/nspcc-dev/neofs-sdk-go/container/id"
	"github.com/nspcc-dev/neofs-sdk-go/eacl"
	"github.com/nspcc-dev/neofs-sdk-go/object"
	oid "github.com/nspcc-dev/neofs-sdk-go/object/id"
	"github.com/nspcc-dev/neofs-sdk-go/pool"
	"github.com/nspcc-dev/neofs-sdk-go/user"
	"io"
	"io/ioutil"
	"log"
	"path/filepath"
	"sort"
	"strconv"
	"sync"
	"time"
)

func isErrAccessDenied(err error) (string, bool) {
	unwrappedErr := errors.Unwrap(err)
	for unwrappedErr != nil {
		err = unwrappedErr
		unwrappedErr = errors.Unwrap(err)
	}
	switch err := err.(type) {
	default:
		return "", false
	case apistatus.ObjectAccessDenied:
		return err.Reason(), true
	case *apistatus.ObjectAccessDenied:
		return err.Reason(), true
	}
}

func (m *Manager) UploadObject(containerID, fp string, fileSize int, filtered map[string]string, ioReader *io.Reader) ([]Element, error) {

	tmpWallet, err := m.retrieveWallet()
	if err != nil {
		return nil, err
	}
	tmpKey := tmpWallet.Accounts[0].PrivateKey().PrivateKey

	//pKey := &keys.PrivateKey{PrivateKey: tmpKey}
	userID := user.ID{}
	user.IDFromKey(&userID, tmpKey.PublicKey)
	cnrID := cid.ID{}

	if err := cnrID.DecodeString(containerID); err != nil {
		log.Fatal("couldn't decode containerID")
	}

	attributes := make([]object.Attribute, 0, len(filtered))
	// prepares attributes from filtered headers
	for key, val := range filtered {
		attribute := object.NewAttribute()
		attribute.SetKey(key)
		attribute.SetValue(val)
		attributes = append(attributes, *attribute)
	}
	//if _, ok := filtered[object.AttributeFileName]; !ok {
	//	filename := object.NewAttribute()
	//	filename.SetKey(object.AttributeFileName)
	//	filename.SetValue(fn)
	//	attributes = append(attributes, *filename)
	//}
	if _, ok := filtered[object.AttributeTimestamp]; !ok {
		timestamp := object.NewAttribute()
		timestamp.SetKey(object.AttributeTimestamp)
		timestamp.SetValue(strconv.FormatInt(time.Now().Unix(), 10))
		attributes = append(attributes, *timestamp)
	}

	////set special attributes last so they don't get overwritten
	//timeStampAttr := new(obj.Attribute)
	//timeStampAttr.SetKey(obj.AttributeTimestamp)
	//timeStampAttr.SetValue(strconv.FormatInt(time.Now().Unix(), 10))
	//
	//fileNameAttr := new(obj.Attribute)
	//fileNameAttr.SetKey(obj.AttributeFileName)
	//_, filename := filepath.Split(fp)
	//fileNameAttr.SetValue(filename)
	//attr = append(attr, []*obj.Attribute{timeStampAttr, fileNameAttr}...)
	//now we check if we can create a thumbnail
	thumbnailData, err := thumbnail(ioReader)
	if err == nil {
		sEnc := base64.StdEncoding.EncodeToString(thumbnailData)
		thumbNailAttr := object.NewAttribute()
		thumbNailAttr.SetKey("Thumbnail")
		thumbNailAttr.SetValue(sEnc)
		attributes = append(attributes, *thumbNailAttr)
	}

	pKey := &keys.PrivateKey{PrivateKey: tmpKey}
	obj := object.New()
	obj.SetContainerID(cnrID)
	obj.SetOwnerID(&userID)
	obj.SetAttributes(attributes...)
	data := []byte("this is some data stored as a byte slice in Go Lang!")
	// convert byte slice to io.Reader
	reader := bytes.NewReader(data)

	obj.SetPayloadSize(uint64(len(data)))

	target := eacl.Target{}
	target.SetRole(eacl.RoleUser)
	target.SetBinaryKeys([][]byte{pKey.Bytes()})
	table, err := tokens.AllowKeyPutRead(cnrID, target)
	if err != nil {
		fmt.Errorf("error retrieving table %w\r\n", err)
		return nil, err
	}

	pl, err := m.Pool()
	if err != nil {
		return []Element{}, err
	}

	iAt, exp, err := gspool.TokenExpiryValue(m.ctx, pl, 100)
	bt, err := tokens.BuildBearerToken(pKey, &table, iAt, iAt, exp, pKey.PublicKey())
	if err != nil {
		log.Fatal("error creating bearer token to upload object")
	}

	var prm pool.PrmObjectPut
	prm.SetHeader(*obj)
	prm.SetPayload(reader)
	if bt != nil {
		fmt.Println("using bearer token")
		prm.UseBearer(*bt)
	} else {
		prm.UseKey(&tmpKey)
	}
	idObj, err := pl.PutObject(m.ctx, prm)
	if err != nil {
		reason, ok := isErrAccessDenied(err)
		if ok {
			fmt.Printf("%w: %s\r\n", err, reason)
			return nil, err
		}
		fmt.Println("save object via connection pool: %s", err)
		return nil, err
	}
	fmt.Println("created object ", idObj, " in container ", cnrID)

	//now get the object metadata to create an entry
	//objMetaData, err := m.GetObjectMetaData(idObj.String(), containerID)
	if err != nil {
		return []Element{}, err
	}
	el := Element{
		ID:         idObj.String(),
		Type:       "object",
		Size:       obj.PayloadSize(),
		ParentID:   containerID,
		Attributes: make(map[string]string),
	}
	for _, a := range obj.Attributes() {
		el.Attributes[a.Key()] = a.Value()
	}

	if data, err := json.Marshal(el); err != nil {
		return []Element{}, err
	} else {
		if err := cache.StoreObject(tmpWallet.Accounts[0].Address, idObj.String(), data); err != nil {
			return []Element{}, err
		}
	}
	t := UXMessage{
		Title:       "Object Created",
		Type:        "success",
		Description: "Object successfully created",
	}
	m.MakeToast(NewToastMessage(&t))
	return m.ListContainerObjects(containerID, false)
}

// GetObjectMetaData is live not cached
func (m *Manager) GetObjectMetaData(objectID, containerID string) (object.Object, error) {
	objID := oid.ID{}
	if err := objID.DecodeString(objectID); err != nil {
		fmt.Println("wrong object id", err)
		return object.Object{}, err
	}
	cnrID := cid.ID{}

	if err := cnrID.DecodeString(containerID); err != nil {
		fmt.Println("wrong object id", err)
		return object.Object{}, err
	}

	var addr oid.Address
	addr.SetContainer(cnrID)
	addr.SetObject(objID)

	var prmHead pool.PrmObjectHead
	prmHead.SetAddress(addr)

	tmpWallet, err := m.retrieveWallet()
	if err != nil {
		return object.Object{}, err
	}
	tmpKey := tmpWallet.Accounts[0].PrivateKey().PrivateKey

	pKey := &keys.PrivateKey{PrivateKey: tmpKey}

	pl, err := m.Pool()

	target := eacl.Target{}
	target.SetRole(eacl.RoleUser)
	target.SetBinaryKeys([][]byte{pKey.Bytes()})
	table, err := tokens.AllowKeyPutRead(cnrID, target)
	if err != nil {
		log.Fatal("error retrieving table ", err)
	}
	iAt, exp, err := gspool.TokenExpiryValue(m.ctx, pl, 100)
	bt, err := tokens.BuildBearerToken(pKey, &table, iAt, iAt, exp, pKey.PublicKey())
	if err != nil {
		log.Fatal("error creating bearer token to upload object")
	}
	if bt != nil {
		fmt.Println("using bearer token")
		prmHead.UseBearer(*bt)
	} else {
		prmHead.UseKey(&tmpKey)
	}
	hdr, err := pl.HeadObject(m.ctx, prmHead)
	if err != nil {
		if reason, ok := isErrAccessDenied(err); ok {
			fmt.Printf("%w: %s\r\n", err, reason)
			return object.Object{}, err
		}
		fmt.Errorf("read object header via connection pool: %w", err)
		return object.Object{}, err
	}

	for _, attr := range hdr.Attributes() {
		key := attr.Key()
		val := attr.Value()
		fmt.Println(key, val)
		switch key {
		case object.AttributeFileName:
		case object.AttributeTimestamp:
		case object.AttributeContentType:
		}
	}
	return hdr, nil
}

func (m *Manager) Get(objectID, containerID string, payloadSize int, writer *io.Writer) ([]byte, error) {
	objID := oid.ID{}
	if err := objID.DecodeString(objectID); err != nil {
		fmt.Println("wrong object id", err)
		return nil, err
	}
	cnrID := cid.ID{}

	if err := cnrID.DecodeString(containerID); err != nil {
		fmt.Println("wrong object id", err)
		return nil, err
	}

	tmpWallet, err := m.retrieveWallet()
	if err != nil {
		return nil, err
	}
	tmpKey := tmpWallet.Accounts[0].PrivateKey().PrivateKey

	pKey := &keys.PrivateKey{PrivateKey: tmpKey}

	var addr oid.Address
	addr.SetContainer(cnrID)
	addr.SetObject(objID)

	var prmGet pool.PrmObjectGet
	prmGet.SetAddress(addr)

	bt, err := tokens.BuildBearerToken(pKey, &eacl.Table{}, 500, 500, 500, pKey.PublicKey())
	if err != nil {
		log.Println("error creating bearer token to download a object")
		return nil, err
	}
	//todo: how do you attach a new session to a session Container?
	//sc, err := tokens.BuildObjectSessionToken(pKey, 500, 500, 500, cnrID, session.VerbObjectDelete, *pKey.PublicKey())
	//if err != nil {
	//	log.Println("error creating session token to download a object")
	//	return nil, err
	//}

	if bt != nil {
		prmGet.UseBearer(*bt)
	} else {
		prmGet.UseKey(&tmpKey)
	}

	pl, err := m.Pool()
	if err != nil {
		return nil, err
	}
	rObj, err := pl.GetObject(m.ctx, prmGet)
	if err != nil {
		reason, ok := isErrAccessDenied(err)
		if ok {
			fmt.Printf("%w: %s\r\n", err, reason)
			return nil, err
		}
		fmt.Errorf("init full payload range reading via connection pool: %w", err)
		return nil, err
	}
	for _, attr := range rObj.Header.Attributes() {
		key := attr.Key()
		val := attr.Value()
		fmt.Println(key, val)
		switch key {
		case object.AttributeFileName:
		case object.AttributeTimestamp:
		case object.AttributeContentType:
		}
	}
	body, err := ioutil.ReadAll(rObj.Payload)
	if err != nil {
		fmt.Println("could not read content of object", err)
		return nil, err
	}
	return body, nil
}

type TmpObjectMeta struct {
	Size    uint64
	Objects []Element
}

//listObjectsAsync update object in database with metadata
func (m *Manager) listObjectsAsync(containerID string) ([]Element, error) {
	cnrID := cid.ID{}

	if err := cnrID.DecodeString(containerID); err != nil {
		fmt.Println("wrong object id", err)
		return nil, err
	}

	tmpWallet, err := m.retrieveWallet()
	if err != nil {
		return nil, err
	}
	tmpKey := tmpWallet.Accounts[0].PrivateKey().PrivateKey

	pl, err := m.Pool()
	if err != nil {
		return []Element{}, err
	}

	pKey := &keys.PrivateKey{PrivateKey: tmpKey}
	target := eacl.Target{}
	target.SetRole(eacl.RoleUser)
	target.SetBinaryKeys([][]byte{pKey.Bytes()})
	table, err := tokens.AllowKeyPutRead(cnrID, target)
	if err != nil {
		log.Fatal("error retrieving table ", err)
	}
	iAt, exp, err := gspool.TokenExpiryValue(m.ctx, pl, 100)
	bt, err := tokens.BuildBearerToken(pKey, &table, iAt, iAt, exp, pKey.PublicKey())
	if err != nil {
		log.Fatal("error creating bearer token to upload object")
	}

	prms := pool.PrmObjectSearch{}
	if bt != nil {
		prms.UseBearer(*bt)
	} else {
		prms.UseKey(&tmpKey)
	}

	prms.SetContainerID(cnrID)

	filter := object.SearchFilters{}
	filter.AddRootFilter()
	prms.SetFilters(filter)
	objects, err := pl.SearchObjects(m.ctx, prms)
	if err != nil {
		return nil, err
	}
	var list []oid.ID
	if err = objects.Iterate(func(id oid.ID) bool {
		list = append(list, id)
		return false
	}); err != nil {
		log.Fatalf("error listing objects %s\r\n", err)
	}
	fmt.Printf("list objects %+v\r\n", list)
	wg := sync.WaitGroup{}

	//todo: ludicrously inefficient. Its recreating sessions etc to get the metadata. Refactor.
	for _, v := range list {
		fmt.Println("looping", v.String())
		wg.Add(1)
		go func(vID oid.ID) {
			defer wg.Done()
			fmt.Println("processing object with id", vID.String())
			tmp := Element{
				Type:       "object",
				ID:         vID.String(),
				Attributes: make(map[string]string),
				ParentID:   containerID,
			}

			head, err := m.GetObjectMetaData(vID.String(), containerID)
			if err != nil {
				return
			}
			for _, a := range head.Attributes() {
				tmp.Attributes[a.Key()] = a.Value()
			}
			if filename, ok := tmp.Attributes[object.AttributeFileName]; ok {
				tmp.Attributes["X_EXT"] = filepath.Ext(filename)[1:]
			} else {
				tmp.Attributes["X_EXT"] = ""
			}
			tmp.Size = head.PayloadSize()
			str, err := json.MarshalIndent(tmp, "", "  ")
			if err != nil {
				fmt.Println(err)
			}
			//store in database
			if err = cache.StoreObject(tmpWallet.Accounts[0].Address, vID.String(), str); err != nil {
				fmt.Println("MASSIVE ERROR could not store container in database", err)
			}
		}(v)
	}
	fmt.Println("length of ids", len(list))
	if len(list) > 0 {
		wg.Wait()
	}
	objectList, err := m.ListContainerObjects(containerID, true)
	fmt.Println("async returning", objectList)
	return objectList, err
}

//ListContainerObjects ets from cache
func (m *Manager) ListContainerObjects(containerID string, synchronised bool) ([]Element, error) {
	tmpWallet, err := m.retrieveWallet()
	if err != nil {
		return []Element{}, err
	}
	tmpObjects, err := cache.RetrieveObjects(tmpWallet.Accounts[0].Address)
	if err != nil {
		return nil, err
	}
	if len(tmpObjects) == 0 && !synchronised {
		//we need to check there aren't any on the network
		//todo notify frontend of database sync
		return m.listObjectsAsync(containerID)
	}
	fmt.Println("len unsorted", len(tmpObjects))
	//filter for this container
	var unsortedObjects []Element //make(map[string]Element)
	fmt.Println("processinb ojects for", containerID)
	for k, v := range tmpObjects {
		tmp := Element{}
		err := json.Unmarshal(v, &tmp)
		if err != nil {
			fmt.Println("warning - could not unmarshal container", k)
			continue
		}
		//fmt.Println("object ", tmp.ID, tmp.PendingDeleted, tmp.ParentID)
		if filename, ok := tmp.Attributes[object.AttributeFileName]; ok {
			tmp.Attributes["X_EXT"] = filepath.Ext(filename)[1:]
		} else {
			tmp.Attributes["X_EXT"] = ""
		}
		//ok this needs to be an array to add the correct ones, not a map other wise we lose duplicates quickly
		if !tmp.PendingDeleted && tmp.ParentID == containerID { //don't return deleted containers
			unsortedObjects = append(unsortedObjects, tmp)
			//if name, ok := tmp.Attributes[obj.AttributeFileName]; ok && name != "" {
			//	unsortedObjects[tmp.Attributes[obj.AttributeFileName]] = tmp
			//} else {
			//	unsortedObjects[tmp.ID] = tmp
			//}
		}
	}
	//filter for the objects specifically for this container
	if len(unsortedObjects) == 0 && !synchronised {
		//we need to check there aren't any on the network
		//todo notify frontend of database sync
		return m.listObjectsAsync(containerID)
	}
	fmt.Println("len unsorted", len(unsortedObjects))
	//sort keys
	//the way to do this is seperate the objects without names
	//then only sort the ones with names
	//then attach the others on the end as miscs...
	keys := make([]string, 0, len(unsortedObjects))
	for _, v := range unsortedObjects {
		if name, ok := v.Attributes[object.AttributeFileName]; ok && name != "" {
			keys = append(keys, v.Attributes[object.AttributeFileName])
		} else {
			keys = append(keys, v.ID)
		}
	}
	sort.Strings(keys)
	//sorting harder than i thought when no name is possilbe on an object
	//append to array in alphabetical order by key
	//var objects []Element
	//var unnamed []Element
	//for _, k := range keys {
	//	for _, v := range unsortedObjects {
	//		if name, ok := v.Attributes[obj.AttributeFileName]; ok && name != "" && name == k {
	//			objects = append(objects, v)
	//			break
	//		}
	//		if name, ok := v.Attributes[obj.AttributeFileName]; ok || name != "" {
	//			unnamed = append(unnamed, v)
	//		}
	//
	//	}
	//}
	return unsortedObjects, nil
}
func (m *Manager) DeleteObject(objectID, containerID string) ([]Element, error) {
	objID := oid.ID{}
	if err := objID.DecodeString(objectID); err != nil {
		fmt.Println("wrong object id", err)
		return nil, err
	}
	cnrID := cid.ID{}

	if err := cnrID.DecodeString(containerID); err != nil {
		fmt.Println("wrong object id", err)
		return nil, err
	}

	tmpWallet, err := m.retrieveWallet()
	if err != nil {
		return []Element{}, err
	}
	tmpKey := tmpWallet.Accounts[0].PrivateKey().PrivateKey

	//this doesn't feel correct??
	pKey := &keys.PrivateKey{PrivateKey: tmpKey}

	target := eacl.Target{}
	target.SetRole(eacl.RoleUser)
	target.SetBinaryKeys([][]byte{pKey.Bytes()})
	table, err := tokens.AllowDelete(cnrID, target)
	if err != nil {
		log.Println("error retrieving table ", err)
		return nil, err
	}

	var addr oid.Address
	addr.SetContainer(cnrID)
	addr.SetObject(objID)

	var prmDelete pool.PrmObjectDelete
	prmDelete.SetAddress(addr)

	pl, err := m.Pool()
	if err != nil {
		log.Println("error retrieving pool ", err)
		return nil, err
	}

	iAt, exp, err := gspool.TokenExpiryValue(m.ctx, pl, 100)
	bt, err := tokens.BuildBearerToken(pKey, &table, iAt, iAt, exp, pKey.PublicKey())
	if err != nil {
		log.Fatal("error creating bearer token to upload object")
	}

	if bt != nil {
		prmDelete.UseBearer(*bt)
	} else {
		prmDelete.UseKey(&tmpKey)
	}
	//do we need to 'dial' the pool
	if err := pl.DeleteObject(m.ctx, prmDelete); err != nil {
		reason, ok := isErrAccessDenied(err)
		if ok {
			fmt.Printf("%w: %s\r\n", err, reason)
			return nil, err
		}
		fmt.Errorf("init full payload range reading via connection pool: %w", err)
	} else {
		//now mark deleted
		cacheObject, err := cache.RetrieveObject(tmpWallet.Accounts[0].Address, objectID)
		if err != nil {
			fmt.Println("error retrieving container??", err)
			return []Element{}, err
		}
		if cacheObject == nil {
			//there is no container
			return []Element{}, err
		}
		tmp := Element{}
		if err := json.Unmarshal(cacheObject, &tmp); err != nil {
			return []Element{}, err
		}
		tmp.PendingDeleted = true
		del, err := json.Marshal(tmp)
		if err := json.Unmarshal(cacheObject, &tmp); err != nil {
			return []Element{}, err
		}
		if err := cache.PendObjectDeleted(tmpWallet.Accounts[0].Address, objectID, del); err != nil {
			return []Element{}, err
		}
		t := UXMessage{
			Title:       "Object Deleted",
			Type:        "success",
			Description: "Object successfully deleted",
		}
		m.MakeToast(NewToastMessage(&t))
	}
	return m.ListContainerObjects(containerID, false)

}
