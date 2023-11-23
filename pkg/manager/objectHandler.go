package manager

import (
	"context"
	"encoding/base64"
	"encoding/json"
	"errors"
	"fmt"
	"github.com/amlwwalker/greenfinch.react/pkg/cache"
	"github.com/google/uuid"
	"github.com/nspcc-dev/neofs-sdk-go/object/slicer"
	"github.com/nspcc-dev/neofs-sdk-go/user"
	"image"
	"os"
	"strconv"

	//"github.com/amlwwalker/greenfinch.react/pkg/config"
	gspool "github.com/amlwwalker/greenfinch.react/pkg/pool"
	"github.com/amlwwalker/greenfinch.react/pkg/tokens"
	"github.com/machinebox/progress"
	//"github.com/nspcc-dev/neo-go/pkg/crypto/keys"
	"github.com/nspcc-dev/neofs-sdk-go/client"
	apistatus "github.com/nspcc-dev/neofs-sdk-go/client/status"
	cid "github.com/nspcc-dev/neofs-sdk-go/container/id"
	"github.com/nspcc-dev/neofs-sdk-go/object"
	oid "github.com/nspcc-dev/neofs-sdk-go/object/id"
	"github.com/nspcc-dev/neofs-sdk-go/session"

	"golang.org/x/exp/maps"
	"io"
	"log"
	"path"
	"path/filepath"
	"sort"
	"strings"
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
func setMimeType(filename string, filtered *map[string]string) {
	if _, ok := (*filtered)["Content-Type"]; ok {
		return
	}
	ext := filepath.Ext(filename)
	var m []Mimes
	json.Unmarshal([]byte(mimes), &m)
	for _, v := range m {
		if v.Extension == ext {
			(*filtered)["Content-Type"] = v.MimeType
			return
		}
	}
}

func (m *Manager) CancelObjectContext() {
	fmt.Println("user cancelled context")
	if m.cancelUploadCtx != nil {
		ctxWithMsg, cancel := context.WithCancel(m.cancelUploadCtx)
		// Store the error message in the context
		ctxWithMsg = context.WithValue(ctxWithMsg, "error", errors.New("user cancelled upload"))
		cancel()
	}
	if m.uploadCancelFunc != nil {
		// Cancel the context using the cancel function
		m.uploadCancelFunc()
		// Create a new context with a cancel function
		ctxWithMsg, cancel := context.WithCancel(m.cancelUploadCtx)
		defer cancel()
		// Store the error message in the context
		ctxWithMsg = context.WithValue(ctxWithMsg, "error", errors.New("user cancelled download"))
	}
	if m.downloadCancelFunc != nil {
		// Cancel the context using the cancel function
		m.downloadCancelFunc()
		// Create a new context with a cancel function
		ctxWithMsg, cancel := context.WithCancel(m.cancelDownloadCtx)
		defer cancel()
		// Store the error message in the context
		ctxWithMsg = context.WithValue(ctxWithMsg, "error", errors.New("user cancelled download"))
	}
}

func (m *Manager) InitialiseUploadProcedure(containerID, fp string, customAttributeMap map[string]string) (oid.ID, error) {
	cancelCtx, cnclF := context.WithCancel(context.Background())
	m.cancelUploadCtx = cancelCtx
	m.uploadCancelFunc = cnclF

	nodes := maps.Values(m.selectedNetwork.StorageNodes)
	nodeSelection := NewNetworkSelector(nodes)

	cnrID := cid.ID{}
	if err := cnrID.DecodeString(containerID); err != nil {
		return oid.ID{}, err
	}

	gateSigner := user.NewAutoIDSignerRFC6979(m.gateAccount.PrivateKey().PrivateKey)
	var prmDial client.PrmDial

	prmDial.SetTimeout(60 * time.Second)
	prmDial.SetStreamTimeout(60 * time.Second)
	prmDial.SetContext(cancelCtx)

	prmCli := client.PrmInit{}
	cli, err := client.New(prmCli)
	if err != nil {
		return oid.ID{}, err
	}
	for {
		node, err := nodeSelection.getNext()
		if err != nil {
			fmt.Println("selecting node threw an error ", err)
			continue
		}
		prmDial.SetServerURI(node.Address)
		if err := cli.Dial(prmDial); err != nil {
			m.MakeToast(UXMessage{Type: "warning", Title: "issues conneting", Description: "please wait, attempting to fix"})
			m.MakeNotification(NotificationMessage{Type: "warning", Title: "warning", Description: "failed to connect to " + node.Address + " attempting another"})
			continue
		} else {
			break
		}
	}

	f, err := os.Open(fp)
	defer f.Close()
	if err != nil {
		return oid.ID{}, err
	}
	fileStats, err := f.Stat()
	if err != nil {
		return oid.ID{}, err
	}
	//thumbnail
	{
		f, err := os.Open(fp)
		if err != nil {
			return oid.ID{}, err
		}
		thumbnailData, err := thumbnail(f)
		fmt.Println("thumbnail err is ", err, err == invalidImageError)
		if err != nil {
			if err != image.ErrFormat {
				fmt.Println("1. error retrieved from thumbnail was ", err)
				return oid.ID{}, err
			}
			//todo - get any file thumbnail
			fmt.Println("2. error retrieved from thumbnail was ", err)
		} else {
			customAttributeMap["Thumbnail"] = base64.StdEncoding.EncodeToString(thumbnailData)
		}
		f.Close() //can only read the file once
	}
	id, err := m.putObject(context.Background(), cli, cnrID, gateSigner, f, fileStats, customAttributeMap)
	if err != nil {
		return oid.ID{}, err
	}
	obj, err := m.GetObjectMetaData(id.String(), cnrID.String())
	if err != nil {
		return oid.ID{}, err
	}
	el := Element{
		ID:         id.String(),
		Type:       "object",
		Size:       obj.PayloadSize(),
		ParentID:   containerID,
		Attributes: make(map[string]string),
	}
	for _, a := range obj.Attributes() {
		el.Attributes[a.Key()] = a.Value()
	}
	checksum, _ := obj.PayloadChecksum()
	el.Attributes[payloadChecksumHeader] = checksum.String()
	if data, err := json.Marshal(el); err != nil {
		return oid.ID{}, err
	} else {
		userWalletAddress, _ := m.TemporaryRetrieveUserWalletAddress()
		if err := cache.StoreObject(userWalletAddress, m.selectedNetwork.ID, id.String(), data); err != nil {
			m.MakeNotification(NotificationMessage{
				Title:       "Upload failed",
				Type:        "error",
				Description: fmt.Sprintf("Failed to store object due to: %s", err.Error()),
				MarkRead:    false,
			})
			return oid.ID{}, err
		}
	}
	t := UXMessage{
		Title:       "Object Created",
		Type:        "success",
		Description: "Object successfully created",
	}
	m.MakeToast(NewToastMessage(&t))
	return id, err
}
func (m *Manager) putObject(ctx context.Context, cli *client.Client, cnr cid.ID, gateSigner user.Signer, payload io.Reader, fileStats os.FileInfo, customAttributeMap map[string]string) (oid.ID, error) {
	// partially copy-pasted from https://pkg.go.dev/github.com/nspcc-dev/neofs-sdk-go@v1.0.0-rc.9/client#NewDataSlicer
	fmt.Println("cli ", cli)
	netInfo, err := cli.NetworkInfo(ctx, client.PrmNetworkInfo{})
	if err != nil {
		return oid.ID{}, fmt.Errorf("read current network info: %w", err)
	}

	var opts slicer.Options
	opts.SetObjectPayloadLimit(netInfo.MaxObjectSize())
	opts.SetCurrentNeoFSEpoch(netInfo.CurrentEpoch())
	if !netInfo.HomomorphicHashingDisabled() {
		opts.CalculateHomomorphicChecksum()
	}

	var sessionToken session.Object
	sessionToken.SetAuthKey(gateSigner.Public()) //gateSigner.Public()
	sessionToken.SetID(uuid.New())
	sessionToken.SetIat(netInfo.CurrentEpoch())
	sessionToken.SetNbf(netInfo.CurrentEpoch())
	sessionToken.SetExp(netInfo.CurrentEpoch() + 100) // or particular exp value
	sessionToken.BindContainer(cnr)
	sessionToken.ForVerb(session.VerbObjectPut)

	fmt.Println("waiting on signature")
	m.SignWithWC(&sessionToken) //we need to have a better mechanism of interacting with the wallet etc in terms of sending messages to the front end
	//note on failure we need to stop this - check signature valid etc
	fmt.Println("received signed payload ", sessionToken.VerifySignature())
	userId, err := m.TemporaryRetrieveUserID()
	if err != nil {
		return oid.ID{}, err
	}
	setMimeType(fileStats.Name(), &customAttributeMap)
	var attrs []object.Attribute
	for k, v := range customAttributeMap {
		var attribute object.Attribute
		attribute.SetKey(k)
		attribute.SetValue(v)
		attrs = append(attrs, attribute)
	}

	_slicer, err := slicer.New(ctx, cli, gateSigner, cnr, userId, &sessionToken)

	var fileNameAttr object.Attribute
	fileNameAttr.SetKey(object.AttributeFileName)
	fileNameAttr.SetValue(fileStats.Name())
	attrs = append(attrs, fileNameAttr)

	var timestampAttr object.Attribute
	timestampAttr.SetKey(object.AttributeTimestamp)
	timestampAttr.SetValue(strconv.FormatInt(time.Now().Unix(), 10))
	attrs = append(attrs, timestampAttr)

	plWriter, err := _slicer.InitPut(ctx, attrs)

	wg := sync.WaitGroup{}

	//var cancelUpload chan error
	reader := progress.NewReader(payload)
	cancelCtx, cnclF := context.WithCancel(context.Background())
	m.cancelUploadCtx = cancelCtx
	m.uploadCancelFunc = cnclF
	wg.Add(1)
	go func(ctx context.Context) {
		defer wg.Done()
		progressChan := progress.NewTicker(m.ctx, reader, fileStats.Size(), 250*time.Millisecond)
		for p := range progressChan {
			select {
			case <-ctx.Done():
				errMsg, ok := ctx.Value("error").(string)
				if !ok {
					errMsg = "user action"
				}
				fmt.Println("upload was cancelled ", errMsg)
				tmp := NewProgressMessage(&ProgressMessage{
					Title: "Uploading object",
					Show:  false,
				})
				m.SetProgressPercentage(tmp)
				m.MakeNotification(NotificationMessage{
					Title:       "Upload cancelled",
					Type:        "error",
					Description: "Upload " + fileStats.Name() + " cancelled due to - " + errMsg,
					MarkRead:    false,
				})
				m.SendSignal("freshUpload", nil)
				return
			default:
				fmt.Printf("\r%v remaining...", p.Remaining().Round(250*time.Millisecond))
				tmp := NewProgressMessage(&ProgressMessage{
					Title:    "Uploading object",
					Progress: int(p.Percent()),
					Show:     true,
				})
				m.SetProgressPercentage(tmp)
			}
		}
		end := NewProgressMessage(&ProgressMessage{
			Title: "Uploading object",
			Show:  false,
		})
		//auto close the progress bar
		m.SetProgressPercentage(end)
		tmp := NewToastMessage(&UXMessage{
			Title:       "Uploading complete",
			Type:        "success",
			Description: "Uploading " + fileStats.Name() + " complete",
		})
		var o interface{}
		m.SendSignal("freshUpload", o)
		m.MakeToast(tmp)
		fmt.Println("\rupload is completed")
	}(m.cancelUploadCtx)
	var endOfFile bool
	buf := make([]byte, 1024) // 1 MiB
	for {
		select {
		case <-m.cancelUploadCtx.Done():
			return oid.ID{}, errors.New("cancelled by user")
		default:
			// update progress bar
			n, err := reader.Read(buf)
			if errors.Is(err, io.EOF) {
				fmt.Println("error is ", err)
				endOfFile = true
				break
			}
			if _, err := plWriter.Write(buf[:n]); err != nil {
				ctxWithMsg, cancel := context.WithCancel(m.cancelUploadCtx)
				defer cancel()
				// Store the error message in the context
				ctxWithMsg = context.WithValue(ctxWithMsg, "error", "no payload data")
				cancel()
				m.uploadCancelFunc()
				endOfFile = true
				break
			}
		}
		if endOfFile {
			break
		}
	}
	wg.Wait()
	fmt.Println("id prior to close", plWriter.ID())
	if err := plWriter.Close(); err != nil {
		fmt.Println("error closing object writer ", err)
		//ctxWithMsg, cancel := context.WithCancel(m.cancelUploadCtx)
		//defer cancel()
		//ctxWithMsg = context.WithValue(ctxWithMsg, "error", errors.New("user cancelled download"))
		//cancel()
		//m.downloadCancelFunc()
		return oid.ID{}, err
	}
	id := plWriter.ID()
	fmt.Println("id after close", id)
	return id, err
}

func (m *Manager) Get(objectID, containerID, fp string, writer io.Writer) ([]byte, error) {
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

	pl, err := m.Pool(false)
	if err != nil {
		return nil, err
	}
	iAt, exp, err := gspool.TokenExpiryValue(m.ctx, pl, 100)
	if err != nil {
		fmt.Println("error getting expiry ", err)
		return nil, err
	}

	cancelCtx, cnclF := context.WithCancel(context.Background())
	m.cancelDownloadCtx = cancelCtx
	m.downloadCancelFunc = cnclF
	nodes := maps.Values(m.selectedNetwork.StorageNodes)
	nodeSelection := NewNetworkSelector(nodes)

	var prmDial client.PrmDial

	prmDial.SetTimeout(30 * time.Second)
	prmDial.SetStreamTimeout(30 * time.Second)
	prmDial.SetContext(cancelCtx)
	sdkCli, err := pl.RawClient()
	if err != nil {
		panic("error here " + err.Error())
	}
	for {
		node, err := nodeSelection.getNext()
		if err != nil {
			return nil, err
		}
		prmDial.SetServerURI(node.Address)
		if err := sdkCli.Dial(prmDial); err != nil {
			fmt.Printf("Error connecting to node %s: %s\n", node.Address, err)
			m.MakeToast(UXMessage{Type: "warning", Title: "issues conneting", Description: "please wait, attempting to fix"})
			m.MakeNotification(NotificationMessage{Type: "warning", Title: "warning", Description: "failed to connect to " + node.Address + " attempting another"})
			continue
		} else {
			break
		}
	}

	gateSigner := user.NewAutoIDSigner(m.gateAccount.PrivateKey().PrivateKey) //fix me is this correct signer?
	prmSession := client.PrmSessionCreate{}
	prmSession.SetExp(exp)
	resSession, err := sdkCli.SessionCreate(m.ctx, gateSigner, prmSession)
	if err != nil {
		return nil, err
	}
	sc, err := tokens.BuildUnsignedObjectSessionToken(iAt, iAt, exp, session.VerbObjectGet, cnrID, resSession)
	if err != nil {
		log.Println("error creating session token to create a object", err)
		return nil, err
	}
	m.SignWithWC(sc)

	getInit := client.PrmObjectGet{}
	getInit.WithinSession(*sc)
	dstObject := object.Object{}
	dstObject, objReader, err := pl.ObjectGetInit(m.ctx, cnrID, objID, gateSigner, getInit)
	if err != nil {
		log.Println("error creating object reader ", err)
		return nil, err
	}

	c := progress.NewWriter(writer)
	wg := sync.WaitGroup{}
	wg.Add(1)
	log.Println("starting progress bar for payload (size) ", dstObject.PayloadSize())

	go func(ctx context.Context) {
		defer wg.Done()
		progressChan := progress.NewTicker(m.ctx, c, int64(dstObject.PayloadSize()), 50*time.Millisecond)
		for p := range progressChan {
			select {
			case <-ctx.Done():
				errMsg, ok := ctx.Value("error").(string)
				if !ok {
					errMsg = "user action"
				}
				fmt.Println("download was cancelled ", errMsg)
				tmp := NewProgressMessage(&ProgressMessage{
					Title: "Downloading object",
					Show:  false,
				})
				m.SetProgressPercentage(tmp)
				m.MakeNotification(NotificationMessage{
					Title:       "Download cancelled",
					Type:        "error",
					Description: "Download cancelled " + errMsg,
					MarkRead:    false,
				})
				return
			default:
				fmt.Printf("\r%v remaining...", p.Remaining().Round(250*time.Millisecond))
				tmp := NewProgressMessage(&ProgressMessage{
					Title:    "Downloading object",
					Progress: int(p.Percent()),
					Show:     true,
				})
				m.SetProgressPercentage(tmp)
			}
		}
		tmp := NewToastMessage(&UXMessage{
			Title:       "Download complete",
			Type:        "success",
			Description: "Downloading " + path.Base(fp) + " complete",
		})
		m.MakeToast(tmp)
		//auto close the progress bar
		end := NewProgressMessage(&ProgressMessage{
			Title: "Downloading object",
			Show:  false,
		})
		m.SetProgressPercentage(end)
		fmt.Println("\rdownload is completed")
	}(m.cancelDownloadCtx)
	buf := make([]byte, 1024)
	failCount := 0 //if the download seems to not be downloading we count the number of times, and throw an error/cancel the download
	var endOfFile bool
	for {
		select {
		case <-m.cancelDownloadCtx.Done():
			fmt.Println("ending download")
			return nil, errors.New("cancelled by user")
		default:
			n, err := objReader.Read(buf)
			// get total size from object header and update progress bar based on n bytes received
			if _, err := c.Write(buf[:n]); err != nil {
				fmt.Println("error writing to buffer ", err)
				ctxWithMsg, cancel := context.WithCancel(m.cancelDownloadCtx)
				// Store the error message in the context
				ctxWithMsg = context.WithValue(ctxWithMsg, "error", err.Error())
				cancel()
				m.downloadCancelFunc()
				tmp := NewToastMessage(&UXMessage{
					Title:       "Download error",
					Type:        "error",
					Description: "Downloading error - see notification",
				})
				m.MakeToast(tmp)
				endOfFile = true
				break
			}
			if errors.Is(err, io.EOF) {
				fmt.Println("end of file")
				endOfFile = true
				break
			}
			if n == 0 { //todo - check if % complete is not moving
				failCount++
				if failCount >= 100 {
					fmt.Println("failed to read ", n, " bytes 100 times")
					tmp := NewToastMessage(&UXMessage{
						Title:       "Download error",
						Type:        "error",
						Description: "Download failed to start. Cancelling automatically.",
					})
					m.MakeToast(tmp)
					ctxWithMsg, cancel := context.WithCancel(m.cancelDownloadCtx)
					// Store the error message in the context
					ctxWithMsg = context.WithValue(ctxWithMsg, "error", err.Error())
					cancel()
					m.downloadCancelFunc()
					endOfFile = true
					break
				}
			}
		}
		if endOfFile {
			break
		}
	}
	end := NewProgressMessage(&ProgressMessage{
		Title: "Downloading object",
		Show:  false,
	})
	m.SetProgressPercentage(end)

	if err := objReader.Close(); err != nil {
		// If an error occurs, cancel the context with a message
		ctxWithMsg, cancel := context.WithCancel(m.cancelDownloadCtx)
		ctxWithMsg = context.WithValue(ctxWithMsg, "error", err.Error())
		cancel()
		m.downloadCancelFunc()
		return nil, err
	}
	wg.Wait()
	return []byte{}, nil
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

	var prmHead client.PrmObjectHead

	pl, err := m.Pool(false)
	if err != nil {
		return object.Object{}, err
	}
	//target := eacl.Target{}
	//target.SetRole(eacl.RoleUser)
	//target.SetBinaryKeys([][]byte{m.gateAccount.PublicKey().Bytes()}) //todo - is this correct??
	gateSigner := user.NewAutoIDSignerRFC6979(m.gateAccount.PrivateKey().PrivateKey)

	cliSdk, err := pl.RawClient()
	if err != nil {
		return object.Object{}, err
	}
	netInfo, err := cliSdk.NetworkInfo(context.Background(), client.PrmNetworkInfo{})
	if err != nil {
		return object.Object{}, fmt.Errorf("read current network info: %w", err)
	}
	var sessionToken session.Object
	sessionToken.SetAuthKey(gateSigner.Public()) //gateSigner.Public()
	sessionToken.SetID(uuid.New())
	sessionToken.SetIat(netInfo.CurrentEpoch())
	sessionToken.SetNbf(netInfo.CurrentEpoch())
	sessionToken.SetExp(netInfo.CurrentEpoch() + 100) // or particular exp value
	sessionToken.BindContainer(cnrID)
	sessionToken.ForVerb(session.VerbObjectHead)

	fmt.Println("attempting to get object metadata ") //fails as chan
	m.SignWithWC(&sessionToken)

	prmHead.WithinSession(sessionToken)
	hdr, err := pl.ObjectHead(m.ctx, cnrID, objID, gateSigner, prmHead)
	if err != nil {
		if reason, ok := isErrAccessDenied(err); ok {
			fmt.Printf("error here: %s: %s\r\n", err, reason)
			return object.Object{}, err
		}
		fmt.Errorf("read object header via connection pool: %w", err)
		return object.Object{}, err
	}

	return *hdr, nil
}

type TmpObjectMeta struct {
	Size    uint64
	Objects []Element
}

// listObjectsAsync update object in database with metadata
func (m *Manager) listObjectsAsync(containerID string) ([]Element, error) {

	walletAddress, err := m.retrieveWallet()
	if err != nil {
		return nil, err
	}

	cnrID := cid.ID{}

	if err := cnrID.DecodeString(containerID); err != nil {
		fmt.Println("wrong object id", err)
		return nil, err
	}

	pl, err := m.Pool(false)
	if err != nil {
		return []Element{}, err
	}

	cliSdk, err := pl.RawClient()
	if err != nil {
		return nil, err
	}
	gateSigner := user.NewAutoIDSignerRFC6979(m.gateAccount.PrivateKey().PrivateKey)
	netInfo, err := cliSdk.NetworkInfo(context.Background(), client.PrmNetworkInfo{})
	if err != nil {
		return nil, fmt.Errorf("read current network info: %w", err)
	}
	var sessionToken session.Object
	sessionToken.SetAuthKey(gateSigner.Public()) //gateSigner.Public()
	sessionToken.SetID(uuid.New())
	sessionToken.SetIat(netInfo.CurrentEpoch())
	sessionToken.SetNbf(netInfo.CurrentEpoch())
	sessionToken.SetExp(netInfo.CurrentEpoch() + 100) // or particular exp value
	sessionToken.BindContainer(cnrID)
	sessionToken.ForVerb(session.VerbObjectSearch)

	if err := m.TemporarySignObjectTokenWithPrivateKey(&sessionToken); err != nil {
		return nil, err
	}
	fmt.Println("sending token to Frontend for list allow")
	//m.SignWithWC(&sessionToken)
	prms := client.PrmObjectSearch{}
	prms.WithinSession(sessionToken)

	filter := object.SearchFilters{}
	filter.AddRootFilter()
	prms.SetFilters(filter)
	init, err := pl.ObjectSearchInit(m.ctx, cnrID, gateSigner, prms)
	if err != nil {
		return nil, err
	}
	var list []oid.ID
	if err = init.Iterate(func(id oid.ID) bool {
		fmt.Println("searching resulted in id ", id.String())
		list = append(list, id)
		return false
	}); err != nil {
		log.Printf("error listing objects %s\r\n", err)
		return nil, err
	}
	if len(list) == 0 { //there are none so stop here
		return []Element{}, nil
	}
	fmt.Printf("list objects %+v\r\n", list)
	wg := sync.WaitGroup{}
	var listObjects []Element
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
				tmp.Attributes["X_EXT"] = strings.TrimPrefix(filepath.Ext(filename), ".")
			} else {
				tmp.Attributes["X_EXT"] = ""
			}
			checksum, _ := head.PayloadChecksum()
			tmp.Attributes[payloadChecksumHeader] = checksum.String()
			tmp.Size = head.PayloadSize()
			if err != nil {
				fmt.Println(err)
			}
			if !m.enableCaching {
				listObjects = append(listObjects, tmp)
			}
			str, err := json.MarshalIndent(tmp, "", "  ")

			//store in database
			if err = cache.StoreObject(walletAddress, m.selectedNetwork.ID, vID.String(), str); err != nil {
				fmt.Println("MASSIVE ERROR could not store container in database", err)
			}
		}(v)
	}
	fmt.Println("length of ids", len(list))
	if len(list) > 0 {
		wg.Wait()
	}
	if !m.enableCaching {
		return listObjects, nil
	}
	objectList, err := m.ListContainerObjects(containerID, true, false)
	//fmt.Println("async returning", objectList)
	return objectList, err
}

// ListContainerObjects ets from cache
func (m *Manager) ListContainerObjects(containerID string, synchronised, deleted bool) ([]Element, error) {
	walletAddress, err := m.retrieveWallet()
	if err != nil {
		return []Element{}, err
	}
	if !m.enableCaching { //just always get the sync objects
		//what do we do here then for retrieving the objects from the network?
		return m.listObjectsAsync(containerID)
	}
	tmpObjects, err := cache.RetrieveObjects(walletAddress, m.selectedNetwork.ID)
	if err != nil {
		return nil, err
	}
	if len(tmpObjects) == 0 && !synchronised { //only sync if forced to or you have no objects
		//we need to check there aren't any on the network
		//todo notify frontend of database sync
		return m.listObjectsAsync(containerID)
	}
	fmt.Println("len unsorted", len(tmpObjects))
	//filter for this container
	var unsortedObjects []Element //make(map[string]Element)
	//fmt.Println("processinb ojects for", containerID)
	for k, v := range tmpObjects {
		tmp := Element{}
		err := json.Unmarshal(v, &tmp)
		if err != nil {
			fmt.Println("warning - could not unmarshal container", k)
			continue
		}
		//fmt.Println("object ", tmp.ID, tmp.PendingDeleted, tmp.ParentID)
		if filename, ok := tmp.Attributes[object.AttributeFileName]; ok {
			tmp.Attributes["X_EXT"] = strings.TrimPrefix(filepath.Ext(filename), ".") //[1:]
		} else {
			tmp.Attributes["X_EXT"] = ""
		}
		if deleted && tmp.ParentID == containerID {
			unsortedObjects = append(unsortedObjects, tmp)
			//ok this needs to be an array to add the correct ones, not a map other wise we lose duplicates quickly
		} else if !tmp.PendingDeleted && tmp.ParentID == containerID { //don't return deleted containers
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
	walletAddress, err := m.retrieveWallet()
	if err != nil {
		return nil, err
	}

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

	pl, err := m.Pool(false)
	if err != nil {
		log.Println("error retrieving pool ", err)
		return nil, err
	}
	cliSdk, err := pl.RawClient()
	if err != nil {
		log.Println("delete could not get client")
		return nil, err
	}
	gateSigner := user.NewAutoIDSignerRFC6979(m.gateAccount.PrivateKey().PrivateKey)
	netInfo, err := cliSdk.NetworkInfo(context.Background(), client.PrmNetworkInfo{})
	if err != nil {
		return nil, fmt.Errorf("read current network info: %w", err)
	}

	var sessionToken session.Object
	sessionToken.SetAuthKey(gateSigner.Public()) //gateSigner.Public()
	sessionToken.SetID(uuid.New())
	sessionToken.SetIat(netInfo.CurrentEpoch())
	sessionToken.SetNbf(netInfo.CurrentEpoch())
	sessionToken.SetExp(netInfo.CurrentEpoch() + 100) // or particular exp value
	sessionToken.BindContainer(cnrID)
	sessionToken.ForVerb(session.VerbObjectDelete)

	m.SignWithWC(&sessionToken)
	var prmDelete client.PrmObjectDelete
	prmDelete.WithinSession(sessionToken)

	cacheObject, err := cache.RetrieveObject(walletAddress, m.selectedNetwork.ID, objectID)
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
	if err := cache.PendObjectDeleted(walletAddress, m.selectedNetwork.ID, objectID, del); err != nil {
		return []Element{}, err
	}
	//gateSigner := user.NewAutoIDSigner(m.gateAccount.PrivateKey().PrivateKey) //fix me is this correct signer?
	go func() {
		//do we need to 'dial' the pool
		if _, err := pl.ObjectDelete(m.ctx, cnrID, objID, gateSigner, prmDelete); err != nil {
			//reason, ok := isErrAccessDenied(err)
			m.MakeToast(NewToastMessage(&UXMessage{
				Title:       "Object Error",
				Type:        "error",
				Description: "Object could not be deleted",
			}))
			m.MakeNotification(NotificationMessage{
				Title:       "Pending object deletion",
				Type:        "error",
				Description: "Object " + tmp.ID + " could not be deleted: " + err.Error(),
			})
			cacheObject, err := cache.RetrieveObject(walletAddress, m.selectedNetwork.ID, objectID)
			if err != nil {
				fmt.Println("error retrieving container??", err)
				return
			}
			if cacheObject == nil {
				//there is no container
				return
			}
			tmp := Element{}
			if err := json.Unmarshal(cacheObject, &tmp); err != nil {
				return
			}
			tmp.PendingDeleted = false
			del, err := json.Marshal(tmp)
			if err := json.Unmarshal(cacheObject, &tmp); err != nil {
				return
			}
			if err := cache.PendObjectDeleted(walletAddress, m.selectedNetwork.ID, objectID, del); err != nil {
				return
			}
		} else {
			if err := cache.DeleteObject(walletAddress, m.selectedNetwork.ID, objectID); err != nil {
				m.MakeNotification(NotificationMessage{
					Title:       "Object cache deletion",
					Type:        "error",
					Description: "failed to delete container " + objectID + " from the cache " + err.Error(),
				})
				m.MakeToast(NewToastMessage(&UXMessage{
					Title:       "Object cache deletion",
					Type:        "error",
					Description: "failed to delete object from the cache",
				}))
				return
			}
			m.MakeNotification(NotificationMessage{
				Title:       "Object Deleted",
				Type:        "success",
				Description: "Object " + tmp.ID + " was deleted successfully",
			})
			m.MakeToast(NewToastMessage(&UXMessage{
				Title:       "Object Deleted",
				Type:        "success",
				Description: "Object successfully deleted",
			}))
			m.ContainersChanged() // should force a general update. Good for now.
		}
	}()
	return m.ListContainerObjects(containerID, false, true)

}
