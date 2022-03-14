package manager

import (
	"encoding/json"
	"errors"
	"fmt"
	client2 "github.com/configwizard/gaspump-api/pkg/client"
	"github.com/configwizard/gaspump-api/pkg/filesystem"
	"github.com/configwizard/gaspump-api/pkg/object"
	"github.com/configwizard/gaspump-api/pkg/wallet"
	cid "github.com/nspcc-dev/neofs-sdk-go/container/id"
	obj "github.com/nspcc-dev/neofs-sdk-go/object"
	oid "github.com/nspcc-dev/neofs-sdk-go/object/id"
	"io"
	"path"
	"strconv"
	"time"
)

const (
	TIMESTAMP_FORMAT string = "2006.01.02 15:04:05"
)
//
//func getObjectAddress(objectID, containerID string) *obj.Address {
//	contID := cid.New()
//	contID.Parse(containerID)
//	objID := obj.NewID()
//	objID.Parse(objectID)
//	objAddress := obj.NewAddress()
//	objAddress.SetObjectID(objID)
//	objAddress.SetContainerID(contID)
//	return objAddress
//}

func (m *Manager) UploadObject(containerID, filepath string, attributes map[string]string, ioReader *io.Reader) (string, error) {

	var attr []*obj.Attribute
	for k, v := range attributes {
		tmp := obj.Attribute{}
		tmp.SetKey(k)
		if v == "" {
			return "", errors.New("cannot have empty attribute values")
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

	sessionToken, err := client2.CreateSession(client2.DEFAULT_EXPIRATION, m.ctx, m.fsCli, m.key)
	if err != nil {
		return "", err
	}
	ownerID, err := wallet.OwnerIDFromPrivateKey(m.key)
	if err != nil {
		return "", err
	}
	cntId := new(cid.ID)
	cntId.Parse(containerID)
	id, err := object.UploadObject(m.ctx, m.fsCli, cntId, ownerID, attr, nil, sessionToken, ioReader)
	if err != nil {
		fmt.Println("error attempting to upload", err)
	}
	return id.String(), err
}

func (m *Manager) GetObjectMetaData(objectID, containerID string) (obj.Object, error){
	sessionToken, err := client2.CreateSession(client2.DEFAULT_EXPIRATION, m.ctx, m.fsCli, m.key)
	if err != nil {
		return obj.Object{}, err
	}
	objID := oid.NewID()
	objID.Parse(objectID)
	cntID := cid.New()
	cntID.Parse(containerID)
	headObj, err := object.GetObjectMetaData(m.ctx, m.fsCli, *objID, *cntID, nil, sessionToken)
	if m.DEBUG {
		DebugSaveJson("GetObjectMetaData.json", headObj)
	}
	return *headObj, err
}
func (m *Manager) Get(objectID, containerID string, writer *io.Writer) ([]byte, error){
	sessionToken, err := client2.CreateSession(client2.DEFAULT_EXPIRATION, m.ctx, m.fsCli, m.key)
	if err != nil {
		return []byte{}, err
	}

	objId := oid.ID{}
	objId.Parse(objectID)
	o, err := object.GetObject(m.ctx, m.fsCli, objId, nil, sessionToken, writer)
	if m.DEBUG {
		DebugSaveJson("GetObject.json", o)
	}
	return o.Payload(), err
}

func (m *Manager) ListContainerObjectIDs(containerID string) ([]string, error) {
	var stringIds []string
	sessionToken, err := client2.CreateSession(client2.DEFAULT_EXPIRATION, m.ctx, m.fsCli, m.key)
	if err != nil {
		return stringIds, err
	}
	cntID := cid.ID{}
	cntID.Parse(containerID)
	var filters = obj.SearchFilters{}
	filters.AddRootFilter()
	list, err := object.QueryObjects(m.ctx, m.fsCli, cntID, filters, nil, sessionToken)
	filesystem.GenerateObjectStruct(m.ctx, m.fsCli, list, cntID, nil, sessionToken)
	for _, v := range list {
		stringIds = append(stringIds, v.String())
	}
	if m.DEBUG {
		DebugSaveJson("ListContainerObjectIDs.json", stringIds)
	}
	return stringIds, err
}
type TmpObjectMeta struct {
	Size uint64
	Objects []filesystem.Element
}
func (m *Manager) ListObjectsAsync(containerID string) error {
	sessionToken, err := client2.CreateSession(client2.DEFAULT_EXPIRATION, m.ctx, m.fsCli, m.key)
	if err != nil {
		return  err
	}
	cntID := cid.ID{}
	cntID.Parse(containerID)
	var filters = obj.SearchFilters{}
	filters.AddRootFilter()
	list, err := object.QueryObjects(m.ctx, m.fsCli, cntID, filters, nil, sessionToken)
	_, objects := filesystem.GenerateObjectStruct(m.ctx, m.fsCli, list, cntID, nil, sessionToken)
	str, err := json.MarshalIndent(objects, "", "  ")
	if err != nil {
		fmt.Println(err)
	}
	fmt.Println(string(str))
	if m.DEBUG {
		DebugSaveJson("ListContainerPopulatedObjects.json", objects)
	}
	return nil
}
func (m *Manager) ListContainerPopulatedObjects(containerID string) ([]filesystem.Element, error) {
	sessionToken, err := client2.CreateSession(client2.DEFAULT_EXPIRATION, m.ctx, m.fsCli, m.key)
	if err != nil {
		return []filesystem.Element{}, err
	}
	cntID := cid.ID{}
	cntID.Parse(containerID)
	var filters = obj.SearchFilters{}
	filters.AddRootFilter()
	list, err := object.QueryObjects(m.ctx, m.fsCli, cntID, filters, nil, sessionToken)
	_, objects := filesystem.GenerateObjectStruct(m.ctx, m.fsCli, list, cntID, nil, sessionToken)
	str, err := json.MarshalIndent(objects, "", "  ")
	if err != nil {
		fmt.Println(err)
	}
	fmt.Println(string(str))
	if m.DEBUG {
		DebugSaveJson("ListContainerPopulatedObjects.json", objects)
	}
	return objects, nil
}
func (m *Manager) Delete(objectID, containerID string) error {
	sessionToken, err := client2.CreateSession(client2.DEFAULT_EXPIRATION, m.ctx, m.fsCli, m.key)
	if err != nil {
		fmt.Println("error getting session key", err)
		return err
	}
	cntID := cid.ID{}
	cntID.Parse(containerID)
	objID := oid.ID{}
	objID.Parse(objectID)
	//objAddress := getObjectAddress(objectID, containerID)
	_, err = object.DeleteObject(m.ctx, m.fsCli, objID, cntID, nil, sessionToken)
	if err != nil {
		fmt.Println("error deleting object ", err)
	}
	return nil
}
