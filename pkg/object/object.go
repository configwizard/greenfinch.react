package object

import (
	"context"
	"crypto/ecdsa"
	"errors"
	"fmt"
	"github.com/amlwwalker/greenfinch.react/pkg/config"
	"github.com/amlwwalker/greenfinch.react/pkg/database"
	"github.com/amlwwalker/greenfinch.react/pkg/emitter"
	"github.com/amlwwalker/greenfinch.react/pkg/notification"
	"github.com/amlwwalker/greenfinch.react/pkg/payload"
	"github.com/amlwwalker/greenfinch.react/pkg/tokens"
	"github.com/nspcc-dev/neo-go/pkg/wallet"
	"github.com/nspcc-dev/neofs-sdk-go/bearer"
	"github.com/nspcc-dev/neofs-sdk-go/client"
	apistatus "github.com/nspcc-dev/neofs-sdk-go/client/status"
	cid "github.com/nspcc-dev/neofs-sdk-go/container/id"
	"github.com/nspcc-dev/neofs-sdk-go/eacl"
	"github.com/nspcc-dev/neofs-sdk-go/object"
	oid "github.com/nspcc-dev/neofs-sdk-go/object/id"
	"github.com/nspcc-dev/neofs-sdk-go/object/slicer"
	"github.com/nspcc-dev/neofs-sdk-go/pool"
	"github.com/nspcc-dev/neofs-sdk-go/user"
	"io"
	"log"
	"sync"
	"time"
)

// isErrAccessDenied is a helpher function for errors from NeoFS
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

type ObjectParameter struct {
	ContainerId string
	Id          string
	PublicKey   ecdsa.PublicKey
	gateAccount *wallet.Account
	io.ReadWriter
	pl  *pool.Pool
	ctx context.Context

	//objectEmitter is used for sending an update of the state of the object's action, e.g send a message that an object has been downloaded.
	//the emitter will be responsible for keeping the UI update on changes. It is not responsible for uniqueness etc
	objectEmitter   emitter.Emitter
	Attrs           []object.Attribute
	ActionOperation eacl.Operation
	ExpiryEpoch     uint64
}

func (o ObjectParameter) Operation() eacl.Operation {
	return o.ActionOperation
}
func (o ObjectParameter) Epoch() uint64 {
	return o.ExpiryEpoch
}
func (o ObjectParameter) ParentID() string {
	return o.ContainerId
}

func (o ObjectParameter) ID() string {
	return o.Id
}

func (o ObjectParameter) Pool() *pool.Pool {
	return o.pl
}

func (o ObjectParameter) Attributes() []object.Attribute {
	return o.Attrs
}

func (o ObjectParameter) GateAccount() (*wallet.Account, error) {
	return nil, errors.New("no gate wallet for object")
}

type Object struct {
	notification.Notifier
	database.Store
	//PublicKey     ecdsa.PublicKey
	//PayloadWriter *slicer.PayloadWriter
	// the data payload
	//the location its to be read from/saved to if necessary
}

// todo - this will need to handle synchronous requests to the database and then asynchronous requests to the network
// basically load what we have but update it.
// these will need to fire notifications and events on completion.
// think about what to return here. We are trying to avoid anything being slow which means if we have something in the database
// we should return that with an 'synchronising' message. then the routine can update the UI for this request using an emitter
// and a message type with any new information?
// however maybe that isn;t the jjob of this and its the hob of the controller, who interfces with the UI. so this needs a chanenl to send messages on actually
func (o *Object) Head(wg *sync.WaitGroup, p payload.Parameters, actionChan chan notification.NewNotification, token tokens.Token) error {
	var objID oid.ID
	if err := objID.DecodeString(p.ID()); err != nil {
		fmt.Println("wrong object Id", err)
		return err
	}
	var cnrID cid.ID
	if err := cnrID.DecodeString(p.ParentID()); err != nil {
		fmt.Println("wrong container Id", err)
		return err
	}
	gA, err := p.GateAccount()
	if err != nil {
		return err
	}
	var prmHead client.PrmObjectHead
	if tok, ok := token.(*tokens.BearerToken); ok {
		//todo - this could be nil and cause an issue:
		prmHead.WithBearerToken(*tok.BearerToken) //now we know its a bearer token we can extract it
	} else {
		return errors.New("no bearer token provided")
	}
	params, ok := p.(*ObjectParameter)
	if !ok {
		return errors.New("no object parameters")
	}
	//todo this should be on a routine and send updates to the actionChan. Synchronised currently. (slow)
	gateSigner := user.NewAutoIDSignerRFC6979(gA.PrivateKey().PrivateKey)
	hdr, err := p.Pool().ObjectHead(params.ctx, cnrID, objID, gateSigner, prmHead)
	if err != nil {
		if reason, ok := isErrAccessDenied(err); ok {
			fmt.Printf("error here: %s: %s\r\n", err, reason)
			return err
		}
		fmt.Printf("read object header via connection pool: %s", err)
		return err
	}
	//sends this wherever it needs to go. If this is needed somewhere else in the app, then a closure can allow this to be accessed elsewhere in a routine.
	return params.objectEmitter.Emit(params.ctx, emitter.ObjectAddUpdate, hdr)
}
func (o *Object) Delete(wg *sync.WaitGroup, p payload.Parameters, actionChan chan notification.NewNotification, token tokens.Token) error {
	var objID oid.ID
	if err := objID.DecodeString(p.ID()); err != nil {
		fmt.Println("wrong object Id", err)
		return err
	}
	var cnrID cid.ID
	if err := cnrID.DecodeString(p.ParentID()); err != nil {
		fmt.Println("wrong container Id", err)
		return err
	}
	gA, err := p.GateAccount()
	if err != nil {
		return err
	}
	params, ok := p.(*ObjectParameter)
	if !ok {
		return errors.New("no object parameters")
	}
	var prmDelete client.PrmObjectDelete
	if tok, ok := token.(*tokens.BearerToken); ok {
		//todo - this could be nil and cause an issue:
		prmDelete.WithBearerToken(*tok.BearerToken) //now we know its a bearer token we can extract it
	} else {
		return errors.New("no bearer token provided")
	}
	gateSigner := user.NewAutoIDSignerRFC6979(gA.PrivateKey().PrivateKey)
	if id, err := p.Pool().ObjectDelete(params.ctx, cnrID, objID, gateSigner, prmDelete); err != nil {
		return err
	} else {
		return params.objectEmitter.Emit(params.ctx, emitter.ObjectRemoveUpdate, id)
	}
}
func (o *Object) List(wg *sync.WaitGroup, p payload.Parameters, actionChan chan notification.NewNotification, token tokens.Token) error {
	var cnrID cid.ID
	if err := cnrID.DecodeString(p.ParentID()); err != nil {
		fmt.Println("wrong container Id", err)
		return err
	}
	gA, err := p.GateAccount()
	if err != nil {
		return err
	}
	params, ok := p.(*ObjectParameter)
	if !ok {
		return errors.New("no object parameters")
	}
	prmList := client.PrmObjectSearch{}
	if tok, ok := token.(*tokens.BearerToken); ok {
		//todo - this could be nil and cause an issue:
		prmList.WithBearerToken(*tok.BearerToken) //now we know its a bearer token we can extract it
	} else {
		return errors.New("no bearer token provided")
	}
	filter := object.SearchFilters{}
	filter.AddRootFilter()
	prmList.SetFilters(filter)
	gateSigner := user.NewAutoIDSignerRFC6979(gA.PrivateKey().PrivateKey)
	init, err := p.Pool().ObjectSearchInit(params.ctx, cnrID, gateSigner, prmList)
	if err != nil {
		return err
	}
	var iterationError error
	if err = init.Iterate(func(id oid.ID) bool {
		if metaError := o.Head(wg, p, actionChan, token); metaError != nil {
			iterationError = metaError
			return true
		}
		//head will emit on list's behalf with the data
		return false
	}); err != nil {
		return err
	}
	return iterationError
}

// ObjectReadSignSession produces a token for reading objects. Slightly more complex than a standard token so part of this package.
func ObjectReadSignSession(p ObjectParameter, nodes []config.Peer) (*bearer.Token, error) {
	nodeSelection := config.NewNetworkSelector(nodes)
	var prmDial client.PrmDial
	prmDial.SetTimeout(30 * time.Second)
	prmDial.SetStreamTimeout(30 * time.Second)
	prmDial.SetContext(context.Background()) //do we need fine contorl over this with a timeout?
	sdkCli, err := p.Pool().RawClient()
	if err != nil {
		return nil, err
	}
	for {
		node, err := nodeSelection.GetNext()
		if err != nil {
			return nil, err
		}
		prmDial.SetServerURI(node.Address)
		//fixme: this may well be very slow and we might want to do it earlier somewhere - ask Roman
		if err := sdkCli.Dial(prmDial); err != nil {
			fmt.Printf("Error connecting to node %s: %s\n", node.Address, err)
			continue
		} else {
			break
		}
	}
	//_, exp, err := gspool.TokenExpiryValue(p.ctx, p.Pool(), 100)
	//if err != nil {
	//	fmt.Println("error getting expiry ", err)
	//	return nil, err
	//}
	//gateSigner := user.NewAutoIDSigner(p.gateAccount.PrivateKey().PrivateKey) //fix me is this correct signer?
	//prmSession := client.PrmSessionCreate{}
	//prmSession.SetExp(exp)
	//resSession, err := sdkCli.SessionCreate(p.ctx, gateSigner, prmSession)
	//if err != nil {
	//	return nil, err
	//}
	//fixme: change for bearer token
	//fixme: need to find out how to attach the resSession to a bearer token (how were we doing it for gate tokens? I think its the same)
	//bt, err := tokens.BuildUnsignedBearerToken(iAt, iAt, exp, session.VerbObjectGet, cnrID, resSession)
	//token, err := ObjectBearerToken(p) //we need to use the session
	//if err != nil {
	//	return nil, err
	//}
	//return &token, err
	return nil, nil
}

// ObjectRead
func ObjectRead() {
	//create bearer token
	//get token signed
	//call initReader
	//attach reader to the object
	//call the read operation
	//close the reader
}

// tmpPreRequisite should be run before trying to retrieve an object. It provides the size of the object and the reader that will do the retrieval.
func InitReader(params ObjectParameter, token tokens.Token) (object.Object, io.ReadCloser, error) {
	var objID oid.ID
	if err := objID.DecodeString(params.ID()); err != nil {
		fmt.Println("wrong object Id", err)
		return object.Object{}, nil, err
	}
	var cnrID cid.ID
	if err := cnrID.DecodeString(params.ParentID()); err != nil {
		fmt.Println("wrong container Id", err)
		return object.Object{}, nil, err
	}
	gA, err := params.GateAccount()
	if err != nil {
		return object.Object{}, nil, err
	}
	gateSigner := user.NewAutoIDSigner(gA.PrivateKey().PrivateKey) //fix me is this correct signer?
	getInit := client.PrmObjectGet{}
	if tok, ok := token.(*tokens.BearerToken); ok {
		//todo - this could be nil and cause an issue:
		getInit.WithBearerToken(*tok.BearerToken) //now we know its a bearer token we can extract it
	} else {
		return object.Object{}, nil, errors.New("no bearer token provided")
	}

	dstObject, objReader, err := params.Pool().ObjectGetInit(params.ctx, cnrID, objID, gateSigner, getInit)
	if err != nil {
		log.Println("error creating object reader ", err)
		return object.Object{}, nil, err
	}
	//the object reader will need closing.
	//might need a before(), during(), after() type interface to do this potentially, but not nice. Potentially attach the
	//dstObject to the parameters so that can be closed in the during() phase.
	//todo: readers and writers should be attached to the object that owns the method
	return dstObject, objReader, nil
}

func (o Object) Read(wg *sync.WaitGroup, p payload.Parameters, actionChan chan notification.NewNotification, token tokens.Token) error {
	buf := make([]byte, 1024)
	for {
		n, err := p.Read(buf)
		if n > 0 {
			if _, err := p.Write(buf[:n]); err != nil {
				actionChan <- o.Notification(
					"failed to write to buffer",
					err.Error(),
					notification.Error,
					notification.ActionNotification)
				return err
			}
		}
		if err != nil {
			if err == io.EOF {
				fmt.Println("reached end of file")
				actionChan <- o.Notification(
					"download complete!",
					"object "+p.ID()+" completed",
					notification.Success,
					notification.ActionNotification)
				break
			}
			fmt.Println("actual error ", err)
			actionChan <- o.Notification(
				"error",
				err.Error(),
				notification.Error,
				notification.ActionNotification)
			return err
		}
	}
	//no need to emit anything - the progress bar will update the UI for us.
	return nil
}
func CloseReader(objReader io.ReadCloser) error {
	//fixme - this needs to occur for the object to finish.
	return objReader.Close()
}
func ObjectWrite() {
	//create a bearer token
	//sign the bearer token
	//call initWriter
	//attach the payloadWriter to the object
	//call Write
	//close the writer
	//retrieve the ID
	//call Head() to get the object metadata
}

func ObjectBearerToken(p payload.Parameters) (bearer.Token, error) {
	var cnrID cid.ID
	if err := cnrID.DecodeString(p.ParentID()); err != nil {
		return bearer.Token{}, err
	}
	gA, err := p.GateAccount()
	if err != nil {
		return bearer.Token{}, err
	}
	params, ok := p.(*ObjectParameter)
	if !ok {
		return bearer.Token{}, errors.New("no object parameters")
	}
	var gateSigner user.Signer = user.NewAutoIDSignerRFC6979(gA.PrivateKey().PrivateKey)
	var prmInit client.PrmInit

	c, err := client.New(prmInit)
	netInfo, err := c.NetworkInfo(params.ctx, client.PrmNetworkInfo{})

	var bearerToken bearer.Token
	bearerToken.ForUser(gateSigner.UserID())
	bearerToken.SetIat(netInfo.CurrentEpoch())
	bearerToken.SetNbf(netInfo.CurrentEpoch())
	bearerToken.SetExp(netInfo.CurrentEpoch() + 100) // or particular exp value
	bearerToken.EACLTable()
	r := eacl.Record{}
	equal := eacl.MatchStringEqual
	equal.DecodeString(cnrID.String())
	r.AddObjectContainerIDFilter(equal, cnrID)
	if p.Operation() == eacl.OperationUnknown {
		return bearer.Token{}, errors.New("need bearer token operation")
	}
	r.SetOperation(p.Operation())
	r.SetAction(eacl.ActionAllow)
	tab := eacl.Table{}
	tab.AddRecord(&r)
	bearerToken.SetEACLTable(tab)

	return bearerToken, nil
}
func InitWriter(p ObjectParameter, token tokens.Token) (io.WriteCloser, error) {
	var cnrID cid.ID
	if err := cnrID.DecodeString(p.ParentID()); err != nil {
		fmt.Println("wrong container Id", err)
		return nil, err
	}
	gA, err := p.GateAccount()
	if err != nil {
		return nil, err
	}

	var prmInit client.PrmInit
	c, err := client.New(prmInit)
	if err != nil {
		return nil, err
	}
	userID := user.ResolveFromECDSAPublicKey(p.PublicKey)
	var gateSigner user.Signer = user.NewAutoIDSignerRFC6979(gA.PrivateKey().PrivateKey)

	ni, err := c.NetworkInfo(p.ctx, client.PrmNetworkInfo{})
	if err != nil {
		return nil, fmt.Errorf("network info: %w", err)
	}
	var opts slicer.Options
	opts.SetObjectPayloadLimit(ni.MaxObjectSize())
	opts.SetCurrentNeoFSEpoch(ni.CurrentEpoch())
	if tok, ok := token.(*tokens.BearerToken); ok {
		//todo - this could be nil and cause an issue:
		opts.SetBearerToken(*tok.BearerToken) //now we know its a bearer token we can extract it
	} else {
		return nil, errors.New("no bearer token provided")
	}
	if !ni.HomomorphicHashingDisabled() {
		opts.CalculateHomomorphicChecksum()
	}
	var hdr object.Object
	hdr.SetContainerID(cnrID)
	hdr.SetType(object.TypeRegular)
	hdr.SetOwnerID(&userID)
	hdr.SetCreationEpoch(ni.CurrentEpoch())
	//todo: readers and writers should be attached to the object that owns the method
	plWriter, err := slicer.InitPut(p.ctx, c, hdr, gateSigner, opts)
	return plWriter, err
}

func (o Object) Write(wg *sync.WaitGroup, p payload.Parameters, actionChan chan notification.NewNotification, token tokens.Token) error {
	buf := make([]byte, 1024)
	for {
		n, err := p.Read(buf)
		if n > 0 {
			if _, err := p.Write(buf[:n]); err != nil {
				actionChan <- o.Notification(
					"failed to write to buffer",
					err.Error(),
					notification.Error,
					notification.ActionNotification)
				return err
			}
		}
		if err != nil {
			if err == io.EOF {
				fmt.Println("reached end of file")
				break
			}
			fmt.Println("actual error ", err)
			actionChan <- o.Notification(
				"error",
				err.Error(),
				notification.Error,
				notification.ActionNotification)
			return err
		}
	}
	return nil
}

//
//// this might need to become an interface function unless we have an object manager that the controller calls.
//func (o Object) CloseWriter(wg *sync.WaitGroup, p ObjectParameter, actionChan chan notification.NewNotification, token tokens.Token) (oid.ID, error) {
//	if err := o.PayloadWriter.Close(); err != nil {
//		return oid.ID{}, err
//	}
//	//todo: add this object to the database, once retrieved information
//	//Id := o.PayloadWriter.ID()
//	//p.Id = Id.String() //decoded other end. Perhaps inefficient but need to set it now so that we can retrieve its metadata
//	//return o.Head(wg, p, actionChan, token)
//	return o.PayloadWriter.ID(), nil
//}
