package manager

import (
	"bufio"
	client2 "github.com/amlwwalker/gaspump-api/pkg/client"
	"github.com/amlwwalker/gaspump-api/pkg/object"
	"github.com/amlwwalker/gaspump-api/pkg/wallet"
	"github.com/nspcc-dev/neofs-sdk-go/client"
	cid "github.com/nspcc-dev/neofs-sdk-go/container/id"
	obj "github.com/nspcc-dev/neofs-sdk-go/object"
	"io"
	"os"
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

func (m *Manager) UploadObject(containerID, filepath string, attributes map[string]string) (string, error) {
	f, err := os.Open(filepath)
	defer f.Close()
	if err != nil {
		return "", err
	}

	reader := bufio.NewReader(f)
	var ioReader io.Reader
	ioReader = reader

	var attr []*obj.Attribute
	for k, v := range attributes {
		tmp := obj.Attribute{}
		tmp.SetKey(k)
		tmp.SetValue(v)
		attr = append(attr, &tmp)
	}

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
	id, err := object.UploadObject(m.ctx, m.fsCli, cntId, ownerID, attr, sessionToken, &ioReader)
	return id.String(), err
}

func (m *Manager) GetObjectMetaData(objectID, containerID string) (*client.ObjectHeadRes, error){
	sessionToken, err := client2.CreateSession(client2.DEFAULT_EXPIRATION, m.ctx, m.fsCli, m.key)
	if err != nil {
		return &client.ObjectHeadRes{}, err
	}
	objAddress := getObjectAddress(objectID, containerID)
	head, err := object.GetObjectMetaData(m.ctx, m.fsCli, objAddress, sessionToken)
	return head, err
}
func (m *Manager) GetObject(objectID, containerID string, writer *io.Writer) ([]byte, error){
	sessionToken, err := client2.CreateSession(client2.DEFAULT_EXPIRATION, m.ctx, m.fsCli, m.key)
	if err != nil {
		return []byte{}, err
	}
	objAddress := getObjectAddress(objectID, containerID)
	o, err := object.GetObject(m.ctx, m.fsCli, objAddress, sessionToken, writer)
	return o, err
}

func (m *Manager) ListContainerObjects(containerID string) ([]string, error) {
	var stringList []string
	sessionToken, err := client2.CreateSession(client2.DEFAULT_EXPIRATION, m.ctx, m.fsCli, m.key)
	if err != nil {
		return stringList, err
	}
	cntID := new(cid.ID)
	cntID.Parse(containerID)
	list, err := object.ListObjects(m.ctx, m.fsCli, cntID, sessionToken)
	for _, v := range list {
		stringList = append(stringList, v.String())
	}
	return stringList, err
}

func (m *Manager) DeleteObject(objectID, containerID string) error {
	sessionToken, err := client2.CreateSession(client2.DEFAULT_EXPIRATION, m.ctx, m.fsCli, m.key)
	if err != nil {
		return err
	}
	objAddress := getObjectAddress(objectID, containerID)
	return object.DeleteObject(m.ctx, m.fsCli, objAddress, sessionToken)
}
