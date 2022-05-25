package manager

import (
	"encoding/base64"
	"encoding/json"
	"errors"
	"fmt"
	"github.com/amlwwalker/greenfinch.react/pkg/cache"
	client2 "github.com/configwizard/gaspump-api/pkg/client"
	"github.com/configwizard/gaspump-api/pkg/filesystem"
	"github.com/configwizard/gaspump-api/pkg/object"
	"github.com/configwizard/gaspump-api/pkg/wallet"
	cid "github.com/nspcc-dev/neofs-sdk-go/container/id"
	obj "github.com/nspcc-dev/neofs-sdk-go/object"
	oid "github.com/nspcc-dev/neofs-sdk-go/object/id"
	"io"
	"path/filepath"
	"sort"
	"strconv"
	"sync"
	"time"
)

func setMimeType(filename string, attr []*obj.Attribute) *obj.Attribute{
	foundMime := false
	for _, v := range attr {
		if v.Key() == "Content-Type" {
			foundMime = true
			break
		}
	}
	var m []Mimes
	json.Unmarshal([]byte(mimes), &m)
	if !foundMime {
		//set the mime type to the expected filename type, or nothing...
		tmp := &obj.Attribute{}
		tmp.SetKey("Content-Type")
		ext := filepath.Ext(filename)
		for _, v := range m {
			if v.Extension == ext {
				tmp.SetValue(v.MimeType)
				return tmp
			}
		}
	}
	return nil
}

func (m *Manager) UploadObject(containerID, fp string, fileSize int, attributes map[string]string, ioReader *io.Reader) ([]filesystem.Element, error) {
	cntID := cid.ID{}
	cntID.Parse(containerID)
	var attr []*obj.Attribute
	for k, v := range attributes {
		tmp := obj.Attribute{}
		tmp.SetKey(k)
		if v == "" {
			return []filesystem.Element{}, errors.New("cannot have empty attribute values")
		}
		tmp.SetValue(v)
		attr = append(attr, &tmp)
	}

	//set special attributes last so they don't get overwritten
	timeStampAttr := new(obj.Attribute)
	timeStampAttr.SetKey(obj.AttributeTimestamp)
	timeStampAttr.SetValue(strconv.FormatInt(time.Now().Unix(), 10))

	fileNameAttr := new(obj.Attribute)
	fileNameAttr.SetKey(obj.AttributeFileName)
	_, filename := filepath.Split(fp)
	fileNameAttr.SetValue(filename)
	attr = append(attr, []*obj.Attribute{timeStampAttr, fileNameAttr}...)

	//auto set the content type
	if mimeTime := setMimeType(filename, attr); mimeTime != nil {
		attr = append(attr, mimeTime)
	}
	//now we check if we can create a thumbnail
	thumbnailData, err := thumbnail(ioReader)
	if err == nil {
		sEnc := base64.StdEncoding.EncodeToString(thumbnailData)
		thumbNailAttr := new(obj.Attribute)
		thumbNailAttr.SetKey("Thumbnail")
		thumbNailAttr.SetValue(sEnc)
		attr = append(attr, thumbNailAttr)
	}
	fmt.Println("attributes: ", attr)
	tmpWallet, err := m.retrieveWallet()
	if err != nil {
		return []filesystem.Element{}, err
	}
	tmpKey := tmpWallet.Accounts[0].PrivateKey().PrivateKey
	c, err := m.Client()
	if err != nil {
		return []filesystem.Element{}, err
	}
	sessionToken, err := client2.CreateSessionWithObjectPutContext(m.ctx, c, nil, &cntID, client2.DEFAULT_EXPIRATION, &tmpKey)
	if err != nil {
		return []filesystem.Element{}, err
	}
	ownerID, err := wallet.OwnerIDFromPrivateKey(&tmpKey)
	if err != nil {
		return []filesystem.Element{}, err
	}

	id, err := object.UploadObject(m.ctx, c, fileSize, cntID, ownerID, attr, nil, sessionToken, ioReader)
	if err != nil {
		fmt.Println("error attempting to upload", err)
		return []filesystem.Element{}, err
	}
	//now get the object metadata to create an entry
	objMetaData, err := m.GetObjectMetaData(id.String(), containerID)
	if err != nil {
		return []filesystem.Element{}, err
	}
	el := filesystem.Element{
		ID:             id.String(),
		Type:           "object",
		Size:           objMetaData.PayloadSize(),
		ParentID:       containerID,
		Attributes: make(map[string]string),
	}
	for _, a := range objMetaData.Attributes() {
		el.Attributes[a.Key()] = a.Value()
	}
	data, err := json.Marshal(el)
	if err != nil {
		return []filesystem.Element{}, err
	}

	if err := cache.StoreObject(tmpWallet.Accounts[0].Address, id.String(), data); err != nil {
		return []filesystem.Element{}, err
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
func (m *Manager) GetObjectMetaData(objectID, containerID string) (*obj.Object, error) {
	objID := oid.ID{}
	objID.Parse(objectID)
	cntID := cid.ID{}
	cntID.Parse(containerID)
	tmpWallet, err := m.retrieveWallet()
	if err != nil {
		return nil, err
	}
	tmpKey := tmpWallet.Accounts[0].PrivateKey().PrivateKey
	c, err := m.Client()
	if err != nil {
		return nil, err
	}
	sessionToken, err := client2.CreateSessionWithObjectGetContext(m.ctx, c, nil, &cntID, client2.DEFAULT_EXPIRATION, &tmpKey)
	if err != nil {
		return nil, err
	}
	head, err := object.GetObjectMetaData(m.ctx, c, objID, cntID, nil, sessionToken)
	if m.DEBUG {
		DebugSaveJson("GetObjectMetaData.json", head)
	}
	return head, err
}

func (m *Manager) Get(objectID, containerID string, payloadSize int, writer *io.Writer) ([]byte, error){
	objID := oid.ID{}
	objID.Parse(objectID)
	cntID := cid.ID{}
	cntID.Parse(containerID)
	tmpWallet, err := m.retrieveWallet()
	if err != nil {
		return []byte{}, err
	}
	tmpKey := tmpWallet.Accounts[0].PrivateKey().PrivateKey
	c, err := m.Client()
	if err != nil {
		return nil, err
	}
	sessionToken, err := client2.CreateSessionWithObjectGetContext(m.ctx, c, nil, &cntID, client2.DEFAULT_EXPIRATION, &tmpKey)
	if err != nil {
		return []byte{}, err
	}

	o, err := object.GetObject(m.ctx, c, payloadSize, objID, cntID, nil, sessionToken, writer)
	if m.DEBUG {
		DebugSaveJson("GetObject.json", o)
	}
	return o.Payload(), err
}

type TmpObjectMeta struct {
	Size uint64
	Objects []filesystem.Element
}

//listObjectsAsync update object in database with metadata
func (m *Manager) listObjectsAsync(containerID string) ([]filesystem.Element, error) {
	cntID := cid.ID{}
	cntID.Parse(containerID)
	tmpWallet, err := m.retrieveWallet()
	if err != nil {
		return []filesystem.Element{}, err
	}
	tmpKey := tmpWallet.Accounts[0].PrivateKey().PrivateKey
	c, err := m.Client()
	if err != nil {
		return []filesystem.Element{}, err
	}
	sessionToken, err := client2.CreateSessionWithObjectGetContext(m.ctx, c, nil, &cntID, client2.DEFAULT_EXPIRATION, &tmpKey)
	if err != nil {
		return []filesystem.Element{}, err
	}

	var filters = obj.SearchFilters{}
	filters.AddRootFilter()
	ids, err := object.QueryObjects(m.ctx, c, cntID, filters, nil, sessionToken)
	fmt.Println("ids for container,", containerID, " ids ", len(ids))
	wg := sync.WaitGroup{}
	for _, v := range ids {
		fmt.Println("looping", v.String())
		wg.Add(1)
		go func(vID oid.ID) {
			defer wg.Done()
			fmt.Println("processing object with id", vID.String())
			tmp := filesystem.Element{
				Type: "object",
				ID:         vID.String(),
				Attributes: make(map[string]string),
				ParentID: containerID,
			}
			head, err := object.GetObjectMetaData(m.ctx, c, vID, cntID, nil, sessionToken)
			if err != nil {
				tmp.Errors = append(tmp.Errors, err)
			}
			for _, a := range head.Attributes() {
				tmp.Attributes[a.Key()] = a.Value()
			}
			if filename, ok := tmp.Attributes[obj.AttributeFileName]; ok {
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
	fmt.Println("length of ids", len(ids))
	if len(ids) > 0 {
		wg.Wait()
	}
	objectList, err := m.ListContainerObjects(containerID, true)
	fmt.Println("async returning", objectList)
	return objectList, err
}

//ListContainerObjects ets from cache
func (m *Manager) ListContainerObjects(containerID string, synchronised bool) ([]filesystem.Element, error) {
	tmpWallet, err := m.retrieveWallet()
	if err != nil {
		return []filesystem.Element{}, err
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
	var unsortedObjects []filesystem.Element //make(map[string]filesystem.Element)
	fmt.Println("processinb ojects for", containerID)
	for k, v := range tmpObjects {
		tmp := filesystem.Element{}
		err := json.Unmarshal(v, &tmp)
		if err != nil {
			fmt.Println("warning - could not unmarshal container", k)
			continue
		}
		//fmt.Println("object ", tmp.ID, tmp.PendingDeleted, tmp.ParentID)
		if filename, ok := tmp.Attributes[obj.AttributeFileName]; ok {
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
		if name, ok := v.Attributes[obj.AttributeFileName]; ok && name != "" {
			keys = append(keys, v.Attributes[obj.AttributeFileName])
		} else {
			keys = append(keys, v.ID)
		}
	}
	sort.Strings(keys)
	//sorting harder than i thought when no name is possilbe on an object
	//append to array in alphabetical order by key
	//var objects []filesystem.Element
	//var unnamed []filesystem.Element
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
func (m *Manager) DeleteObject(objectID, containerID string) ([]filesystem.Element, error) {
	objID := oid.ID{}
	objID.Parse(objectID)
	cntID := cid.ID{}
	cntID.Parse(containerID)
	tmpWallet, err := m.retrieveWallet()
	if err != nil {
		return []filesystem.Element{}, err
	}
	tmpKey := tmpWallet.Accounts[0].PrivateKey().PrivateKey
	c, err := m.Client()
	if err != nil {
		return []filesystem.Element{}, err
	}
	sessionToken, err := client2.CreateSessionWithObjectDeleteContext(m.ctx, c, nil, objID, cntID, client2.DEFAULT_EXPIRATION, &tmpKey)
	if err != nil {
		fmt.Println("error getting session key", err)
		return []filesystem.Element{}, err
	}

	_, err = object.DeleteObject(m.ctx, c, objID, cntID, nil, sessionToken)
	if err != nil {
		tmp := UXMessage{
			Title:       "Object Error",
			Type:        "error",
			Description: "Object could not be deleted " + err.Error(),
		}
		m.MakeToast(NewToastMessage(&tmp))
		fmt.Println("error deleting object ", err)
	} else {
		//now mark deleted
		cacheObject, err := cache.RetrieveObject(tmpWallet.Accounts[0].Address, objectID)
		if err != nil {
			fmt.Println("error retrieving container??", err)
			return []filesystem.Element{}, err
		}
		if cacheObject == nil {
			//there is no container
			return []filesystem.Element{}, err
		}
		tmp := filesystem.Element{}
		if err := json.Unmarshal(cacheObject, &tmp); err != nil {
			return []filesystem.Element{}, err
		}
		tmp.PendingDeleted = true
		del, err := json.Marshal(tmp)
		if err := json.Unmarshal(cacheObject, &tmp); err != nil {
			return []filesystem.Element{}, err
		}
		if err := cache.PendObjectDeleted(tmpWallet.Accounts[0].Address, objectID, del); err != nil {
			return []filesystem.Element{}, err
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
