package payload

import (
	//"github.com/amlwwalker/greenfinch.react/pkg/notification"
	"github.com/google/uuid"
	"github.com/nspcc-dev/neofs-sdk-go/eacl"
	"github.com/nspcc-dev/neofs-sdk-go/object"
	"io"
)

// this could be a struct. Nothing here needs to be directly tested.
type Parameters interface {
	ParentID() string //container ID holder?
	ID() string       //object or container ID holder...
	//WaitGroup() *sync.WaitGroup     //channel to send any information on that is outside of the read/writer. Like a list or something.
	Attributes() []object.Attribute //need to be able to pass around anything that can be set on the object
	Operation() eacl.Operation
	Epoch() uint64
	io.ReadWriter //for data transfer pass an interface for a reader and writer. The use then will have the correct type (e.g put or get)
}

type Payload struct {
	OutgoingData []byte `json:"data"`
	Signature    *Signature
	Uid          uuid.UUID
	Complete     bool
	ResponseCh   chan bool // Channel to notify when the payload is signed
}

type Signature struct {
	HexSignature, HexSalt, HexPublicKey string
}

func NewPayload(data []byte) Payload {
	return Payload{
		OutgoingData: data,
		Uid:          uuid.New(),
		ResponseCh:   make(chan bool),
	}
}
