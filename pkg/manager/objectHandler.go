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
	"path"
	"path/filepath"
	"sort"
	"strconv"
	"time"
)



func (m *Manager) UploadObject(containerID, filepath string, fileSize int, attributes map[string]string, ioReader *io.Reader) ([]filesystem.Element, error) {
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
	fileNameAttr.SetValue(path.Base(filepath))
	attr = append(attr, []*obj.Attribute{timeStampAttr, fileNameAttr}...)
	//now we check if we can create a thumbnail
	thumbnailData, err := thumbnail(ioReader)
	if err == nil {
		sEnc := base64.StdEncoding.EncodeToString(thumbnailData)
		thumbNailAttr := new(obj.Attribute)
		thumbNailAttr.SetKey("Thumbnail")
		thumbNailAttr.SetValue(sEnc)
		attr = append(attr, thumbNailAttr)
	}

	tmpWallet, err := m.retrieveWallet()
	if err != nil {
		return []filesystem.Element{}, err
	}
	tmpKey := tmpWallet.Accounts[0].PrivateKey().PrivateKey
	c, err := m.Client()
	if err != nil {
		return []filesystem.Element{}, err
	}
	sessionToken, err := client2.CreateSession( m.ctx, c, client2.DEFAULT_EXPIRATION, &tmpKey)
	if err != nil {
		return []filesystem.Element{}, err
	}
	ownerID, err := wallet.OwnerIDFromPrivateKey(&tmpKey)
	if err != nil {
		return []filesystem.Element{}, err
	}
	cntId := cid.ID{}
	cntId.Parse(containerID)
	id, err := object.UploadObject(m.ctx, c, fileSize, cntId, ownerID, attr, nil, sessionToken, ioReader)
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
	}
	for _, a := range objMetaData.Attributes() {
		el.Attributes[a.Key()] = a.Value()
	}
	data, err := json.Marshal(el)
	if err != nil {
		return []filesystem.Element{}, err
	}

	if err := cache.StoreObject(id.String(), data); err != nil {
		return []filesystem.Element{}, err
	}
	t := UXMessage{
		Title:       "Object Created",
		Type:        "success",
		Description: "Object successfully deleted",
	}
	m.MakeToast(NewToastMessage(&t))
	return m.ListContainerObjects(containerID)
}

// GetObjectMetaData is live not cached
func (m *Manager) GetObjectMetaData(objectID, containerID string) (*obj.Object, error) {
	tmpWallet, err := m.retrieveWallet()
	if err != nil {
		return nil, err
	}
	tmpKey := tmpWallet.Accounts[0].PrivateKey().PrivateKey
	c, err := m.Client()
	if err != nil {
		return nil, err
	}
	sessionToken, err := client2.CreateSession(m.ctx, c, client2.DEFAULT_EXPIRATION, &tmpKey)
	if err != nil {
		return nil, err
	}
	objID := oid.ID{}
	objID.Parse(objectID)
	cntID := cid.ID{}
	cntID.Parse(containerID)
	head, err := object.GetObjectMetaData(m.ctx, c, objID, cntID, nil, sessionToken)
	if m.DEBUG {
		DebugSaveJson("GetObjectMetaData.json", head)
	}
	return head, err
}

func (m *Manager) Get(objectID, containerID string, payloadSize int, writer *io.Writer) ([]byte, error){
	tmpWallet, err := m.retrieveWallet()
	if err != nil {
		return []byte{}, err
	}
	tmpKey := tmpWallet.Accounts[0].PrivateKey().PrivateKey
	c, err := m.Client()
	if err != nil {
		return nil, err
	}
	sessionToken, err := client2.CreateSession(m.ctx, c, client2.DEFAULT_EXPIRATION, &tmpKey)
	if err != nil {
		return []byte{}, err
	}
	objID := oid.ID{}
	objID.Parse(objectID)
	cntID := cid.ID{}
	cntID.Parse(containerID)
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

//ListObjectsAsync update object in database with metadata
func (m *Manager) ListObjectsAsync(containerID string) error {
	tmpWallet, err := m.retrieveWallet()
	if err != nil {
		return err
	}
	tmpKey := tmpWallet.Accounts[0].PrivateKey().PrivateKey
	c, err := m.Client()
	if err != nil {
		return err
	}
	sessionToken, err := client2.CreateSession(m.ctx, c, client2.DEFAULT_EXPIRATION, &tmpKey)
	if err != nil {
		return  err
	}
	cntID := cid.ID{}
	cntID.Parse(containerID)
	var filters = obj.SearchFilters{}
	filters.AddRootFilter()
	ids, err := object.QueryObjects(m.ctx, m.fsCli, cntID, filters, nil, sessionToken)
	for _, v := range ids {
		go func(vID oid.ID) {
			tmp := filesystem.Element{
				Type: "object",
				ID:         v.String(),
				Attributes: make(map[string]string),
				ParentID: containerID,
			}
			head, err := object.GetObjectMetaData(m.ctx, m.fsCli, v, cntID, nil, sessionToken)
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
			if err = cache.StoreObject(v.String(), str); err != nil {
				fmt.Println("MASSIVE ERROR could not store container in database", err)
			}
		}(v)
	}
	return nil
}

//ListContainerObjects ets from cache
func (m *Manager) ListContainerObjects(containerID string) ([]filesystem.Element, error) {
	tmpObjects, err := cache.RetrieveObjects()
	if err != nil {
		return nil, err
	}
	unsortedObjects := make(map[string]filesystem.Element)
	for k, v := range tmpObjects {
		tmp := filesystem.Element{}
		err := json.Unmarshal(v, &tmp)
		if err != nil {
			fmt.Println("warning - could not unmarshal container", k)
			continue
		}
		if !tmp.PendingDeleted && tmp.ParentID == containerID { //don't return deleted containers
			unsortedObjects[tmp.Attributes[obj.AttributeFileName]] = tmp
		}
	}
	//sort keys
	keys := make([]string, 0, len(unsortedObjects))
	for k := range unsortedObjects {
		keys = append(keys, k)
	}
	sort.Strings(keys)
	//append to array in alphabetical order by key
	var objects []filesystem.Element
	for _, k := range keys {
		objects = append(objects, unsortedObjects[k])
	}
	return objects, nil
}
func (m *Manager) DeleteObject(objectID, containerID string) ([]filesystem.Element, error) {
	tmpWallet, err := m.retrieveWallet()
	if err != nil {
		return []filesystem.Element{}, err
	}
	tmpKey := tmpWallet.Accounts[0].PrivateKey().PrivateKey
	c, err := m.Client()
	if err != nil {
		return []filesystem.Element{}, err
	}
	sessionToken, err := client2.CreateSession(m.ctx, c, client2.DEFAULT_EXPIRATION, &tmpKey)
	if err != nil {
		fmt.Println("error getting session key", err)
		return []filesystem.Element{}, err
	}
	objID := oid.ID{}
	objID.Parse(objectID)
	cntID := cid.ID{}
	cntID.Parse(containerID)
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
		cacheObject, err := cache.RetrieveObject(objectID)
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
		if err := cache.PendObjectDeleted(objectID, del); err != nil {
			return []filesystem.Element{}, err
		}
		t := UXMessage{
			Title:       "Object Deleted",
			Type:        "success",
			Description: "Object successfully deleted",
		}
		m.MakeToast(NewToastMessage(&t))
	}
	return m.ListContainerObjects(containerID)
}
