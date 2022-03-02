package manager

import (
	"encoding/json"
	"errors"
	"fmt"
	client2 "github.com/configwizard/gaspump-api/pkg/client"
	"github.com/configwizard/gaspump-api/pkg/filesystem"
	"github.com/configwizard/gaspump-api/pkg/object"
	"github.com/configwizard/gaspump-api/pkg/wallet"
	"github.com/nspcc-dev/neofs-sdk-go/client"
	cid "github.com/nspcc-dev/neofs-sdk-go/container/id"
	obj "github.com/nspcc-dev/neofs-sdk-go/object"
	"io"
	"path"
	"strconv"
	"time"
)

const (
	TIMESTAMP_FORMAT string = "2006.01.02 15:04:05"
)

func getObjectAddress(objectID, containerID string) *obj.Address {
	contID := cid.New()
	contID.Parse(containerID)
	objID := obj.NewID()
	objID.Parse(objectID)
	objAddress := obj.NewAddress()
	objAddress.SetObjectID(objID)
	objAddress.SetContainerID(contID)
	return objAddress
}

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

func (m *Manager) GetObjectMetaData(objectID, containerID string) (*client.ObjectHeadRes, error){
	sessionToken, err := client2.CreateSession(client2.DEFAULT_EXPIRATION, m.ctx, m.fsCli, m.key)
	if err != nil {
		return &client.ObjectHeadRes{}, err
	}
	objAddress := getObjectAddress(objectID, containerID)
	head, err := object.GetObjectMetaData(m.ctx, m.fsCli, objAddress, nil, sessionToken)
	if m.DEBUG {
		DebugSaveJson("GetObjectMetaData.json", head)
	}
	return head, err
}
func (m *Manager) Get(objectID, containerID string, writer *io.Writer) ([]byte, error){
	sessionToken, err := client2.CreateSession(client2.DEFAULT_EXPIRATION, m.ctx, m.fsCli, m.key)
	if err != nil {
		return []byte{}, err
	}
	objAddress := getObjectAddress(objectID, containerID)
	o, err := object.GetObject(m.ctx, m.fsCli, objAddress, nil, sessionToken, writer)
	if m.DEBUG {
		DebugSaveJson("GetObject.json", o)
	}
	return o, err
}

func (m *Manager) ListContainerObjectIDs(containerID string) ([]string, error) {
	var stringIds []string
	sessionToken, err := client2.CreateSession(client2.DEFAULT_EXPIRATION, m.ctx, m.fsCli, m.key)
	if err != nil {
		return stringIds, err
	}
	cntID := new(cid.ID)
	cntID.Parse(containerID)
	list, err := object.ListObjects(m.ctx, m.fsCli, cntID, nil, sessionToken)
	filesystem.GenerateObjectStruct(m.ctx, m.fsCli, nil, sessionToken, list, cntID)
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
	cntID := new(cid.ID)
	cntID.Parse(containerID)
	list, err := object.ListObjects(m.ctx, m.fsCli, cntID, nil, sessionToken)
	_, objects := filesystem.GenerateObjectStruct(m.ctx, m.fsCli, nil, sessionToken, list, cntID)
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
	cntID := new(cid.ID)
	cntID.Parse(containerID)
	list, err := object.ListObjects(m.ctx, m.fsCli, cntID, nil, sessionToken)
	_, objects := filesystem.GenerateObjectStruct(m.ctx, m.fsCli, nil, sessionToken, list, cntID)
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
		return err
	}
	objAddress := getObjectAddress(objectID, containerID)
	return object.DeleteObject(m.ctx, m.fsCli, objAddress, nil, sessionToken)
}
