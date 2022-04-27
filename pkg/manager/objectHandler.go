package manager

import (
	"bytes"
	"encoding/base64"
	"encoding/json"
	"errors"
	"fmt"
	client2 "github.com/configwizard/gaspump-api/pkg/client"
	"github.com/configwizard/gaspump-api/pkg/filesystem"
	"github.com/configwizard/gaspump-api/pkg/object"
	"github.com/configwizard/gaspump-api/pkg/wallet"
	"github.com/disintegration/imaging"
	cid "github.com/nspcc-dev/neofs-sdk-go/container/id"
	obj "github.com/nspcc-dev/neofs-sdk-go/object"
	oid "github.com/nspcc-dev/neofs-sdk-go/object/id"
	"image"
	"image/jpeg"
	"image/png"
	"io"
	"io/ioutil"
	"path"
	"strconv"
	"time"
)

const (
	TIMESTAMP_FORMAT string = "2006.01.02 15:04:05"
)

func thumbnail(ioReader *io.Reader) ([]byte, error) {

	var img image.Image
	//Read the content - need to check if this errors what happens to the reader
	rawBody, err := ioutil.ReadAll(*ioReader)
	if err != nil {
		return []byte{}, err
	}
	// Restore the io.ReadCloser to it's original state
	*ioReader = (io.Reader)(ioutil.NopCloser(bytes.NewBuffer(rawBody)))
	srcImage, format, err := image.Decode(bytes.NewReader(rawBody))
	if err != nil {
		return []byte{}, err
	}
	fmt.Println("format detected", format)
	bounds := srcImage.Bounds()
	point := bounds.Size()
	width := float64(point.Y)
	height := float64(point.X)
	var ratio float64
	fixedSize := 80.
	if width > height {
		fmt.Println("width > height")
		ratio = fixedSize/width
		fmt.Println("ratio", ratio)
		width = height * ratio
		height = fixedSize
		fmt.Println("new height", height)
	} else {
		fmt.Println("height > width", height, width)
		ratio = fixedSize/height
		fmt.Println("ratio", ratio)
		height = width * ratio
		width = fixedSize
		fmt.Println("new width", width)
	}
	img = imaging.Thumbnail(srcImage, int(width), int(height), imaging.CatmullRom)
	//now convert to bytes based on type of image
	buf := new(bytes.Buffer)
	if format == "jpeg" {
		err := jpeg.Encode(buf, img, nil)
		if err != nil {
			return []byte{}, err
		}
	} else if format == "png" {
		err = png.Encode(buf, img)
		if err != nil {
			return []byte{}, err
		}
	} else {
		return []byte{}, errors.New("unknown format")
	}
	return buf.Bytes(), nil
}


func (m *Manager) UploadObject(containerID, filepath string, fileSize int, attributes map[string]string, ioReader *io.Reader) (string, error) {
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
		return "", err
	}
	tmpKey := tmpWallet.Accounts[0].PrivateKey().PrivateKey
	c, err := m.Client()
	if err != nil {
		return "", err
	}
	sessionToken, err := client2.CreateSession( m.ctx, c, client2.DEFAULT_EXPIRATION, &tmpKey)
	if err != nil {
		return "", err
	}
	ownerID, err := wallet.OwnerIDFromPrivateKey(&tmpKey)
	if err != nil {
		return "", err
	}
	cntId := cid.ID{}
	cntId.Parse(containerID)
	id, err := object.UploadObject(m.ctx, c, fileSize, cntId, ownerID, attr, nil, sessionToken, ioReader)
	if err != nil {
		fmt.Println("error attempting to upload", err)
	}
	return id.String(), err
}

func (m *Manager) GetObjectMetaData(objectID, containerID string) (*obj.Object, error){
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

func (m *Manager) ListContainerObjectIDs(containerID string) ([]string, error) {
	tmpWallet, err := m.retrieveWallet()
	if err != nil {
		return []string{}, err
	}
	tmpKey := tmpWallet.Accounts[0].PrivateKey().PrivateKey
	c, err := m.Client()
	if err != nil {
		return nil, err
	}
	var stringIds []string
	sessionToken, err := client2.CreateSession(m.ctx, c, client2.DEFAULT_EXPIRATION, &tmpKey)
	if err != nil {
		return stringIds, err
	}
	cntID := cid.ID{}
	cntID.Parse(containerID)
	var filters = obj.SearchFilters{}
	filters.AddRootFilter()
	list, err := object.QueryObjects(m.ctx, c, cntID, filters, nil, sessionToken)
	if err != nil {
		return stringIds, err
	}
	filesystem.GenerateObjectStruct(m.ctx, c, list, cntID, nil, sessionToken)
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
	list, err := object.QueryObjects(m.ctx, m.fsCli, cntID, filters, nil, sessionToken)
	_, objects := filesystem.GenerateObjectStruct(m.ctx, c, list, cntID, nil, sessionToken)
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
	tmpWallet, err := m.retrieveWallet()
	if err != nil {
		return []filesystem.Element{}, err
	}
	tmpKey := tmpWallet.Accounts[0].PrivateKey().PrivateKey
	c, err := m.Client()
	if err != nil {
		return nil, err
	}
	sessionToken, err := client2.CreateSession( m.ctx, c, client2.DEFAULT_EXPIRATION,&tmpKey)
	if err != nil {
		return []filesystem.Element{}, err
	}
	cntID := cid.ID{}
	cntID.Parse(containerID)
	var filters = obj.SearchFilters{}
	filters.AddRootFilter()
	list, err := object.QueryObjects(m.ctx, c, cntID, filters, nil, sessionToken)
	if err != nil {
		return []filesystem.Element{}, err
	}
	_, objects := filesystem.GenerateObjectStruct(m.ctx, c, list, cntID, nil, sessionToken)
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
		fmt.Println("error getting session key", err)
		return err
	}
	objID := oid.ID{}
	objID.Parse(objectID)
	cntID := cid.ID{}
	cntID.Parse(containerID)
	_, err = object.DeleteObject(m.ctx, c, objID, cntID, nil, sessionToken)
	if err != nil {
		fmt.Println("error deleting object ", err)
	}
	return nil
}
