package object

import (
	"context"
	"errors"
	"fmt"
	"github.com/amlwwalker/greenfinch.react/pkg/emitter"
	"github.com/amlwwalker/greenfinch.react/pkg/notification"
	"github.com/amlwwalker/greenfinch.react/pkg/payload"
	"github.com/amlwwalker/greenfinch.react/pkg/tokens"
	"github.com/nspcc-dev/neo-go/pkg/wallet"
	"github.com/nspcc-dev/neofs-sdk-go/client"
	apistatus "github.com/nspcc-dev/neofs-sdk-go/client/status"
	cid "github.com/nspcc-dev/neofs-sdk-go/container/id"
	"github.com/nspcc-dev/neofs-sdk-go/eacl"
	"github.com/nspcc-dev/neofs-sdk-go/object"
	oid "github.com/nspcc-dev/neofs-sdk-go/object/id"
	"github.com/nspcc-dev/neofs-sdk-go/pool"
	"github.com/nspcc-dev/neofs-sdk-go/user"
	"io"
	"sync"
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
	containerID string
	id          string
	gateAccount *wallet.Account
	io.ReadWriter
	pl              *pool.Pool
	ctx             context.Context
	objectEmitter   emitter.Emitter //used for sending an update of the state of the object's action, e.g send a message that an object has been downloaded.
	Attrs           []object.Attribute
	ActionOperation eacl.Operation
	ExpiryEpoch     uint64
}

func (o *ObjectParameter) Operation() eacl.Operation {
	return o.ActionOperation
}
func (o *ObjectParameter) Epoch() uint64 {
	return o.ExpiryEpoch
}
func (o *ObjectParameter) ParentID() string {
	return o.containerID
}

func (o *ObjectParameter) ID() string {
	return o.id
}

func (o *ObjectParameter) Pool() *pool.Pool {
	return o.pl
}

func (o *ObjectParameter) Attributes() []object.Attribute {
	return o.Attrs
}

func (o *ObjectParameter) GateAccount() (*wallet.Account, error) {
	return nil, errors.New("no wallet")
}

type Object struct {
	ID string // Identifier for the object
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
		fmt.Println("wrong object id", err)
		return err
	}
	var cnrID cid.ID
	if err := cnrID.DecodeString(p.ParentID()); err != nil {
		fmt.Println("wrong container id", err)
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
		fmt.Println("wrong object id", err)
		return err
	}
	var cnrID cid.ID
	if err := cnrID.DecodeString(p.ParentID()); err != nil {
		fmt.Println("wrong container id", err)
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
		fmt.Println("wrong container id", err)
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
		return false
	}); err != nil {
		return err
	}
	return iterationError
}
func (o *Object) Read(wg *sync.WaitGroup, p payload.Parameters, actionChan chan notification.NewNotification, token tokens.Token) error {

	return nil
}
func (o *Object) Write(wg *sync.WaitGroup, p payload.Parameters, actionChan chan notification.NewNotification, token tokens.Token) error {
	return nil
}
