package object

import (
	"github.com/amlwwalker/greenfinch.react/pkg/database"
	"github.com/amlwwalker/greenfinch.react/pkg/notification"
	"github.com/amlwwalker/greenfinch.react/pkg/payload"
	"github.com/amlwwalker/greenfinch.react/pkg/tokens"
	"github.com/nspcc-dev/neofs-sdk-go/eacl"
	"github.com/nspcc-dev/neofs-sdk-go/object"
	"io"
)

type ObjectParameter struct {
	ContainerID string
	Id          string
	io.ReadWriter
	database.Store
	notification.Notifier
	//WG              *sync.WaitGroup
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
	return o.ContainerID
}

func (o *ObjectParameter) ID() string {
	return o.Id
}

//
//func (o *ObjectParameter) WaitGroup() *sync.WaitGroup {
//	return o.WG
//}

func (o *ObjectParameter) Attributes() []object.Attribute {
	return o.Attrs
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
func (o *Object) Head(p payload.Parameters, signedToken payload.Payload, token tokens.Token) (notification.Notification, error) {
	// e.g
	//p.Chan() <- signedToken //example - not real!
	return notification.Notification{}, nil
}
func (o *Object) Read(p payload.Parameters, signedToken payload.Payload, token tokens.Token) (notification.Notification, error) {
	return notification.Notification{}, nil
}
func (o *Object) Write(p payload.Parameters, signedToken payload.Payload, token tokens.Token) (notification.Notification, error) {
	return notification.Notification{}, nil
}
func (o *Object) Delete(p payload.Parameters, signedToken payload.Payload, token tokens.Token) (notification.Notification, error) {
	return notification.Notification{}, nil
}
func (o *Object) List(p payload.Parameters, signedToken payload.Payload, token tokens.Token) (notification.Notification, error) {
	return notification.Notification{}, nil
}
