package object

import (
	"github.com/amlwwalker/greenfinch.react/pkg/notification"
	"github.com/amlwwalker/greenfinch.react/pkg/payload"
	"github.com/amlwwalker/greenfinch.react/pkg/tokens"
	"github.com/nspcc-dev/neofs-sdk-go/eacl"
	"github.com/nspcc-dev/neofs-sdk-go/object"
	"io"
	"sync"
)

type ObjectParameter struct {
	ContainerID string
	Id          string
	io.ReadWriter
	//database.Store
	//notification.Notifier
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
func (o *Object) Head(wg *sync.WaitGroup, p payload.Parameters, actionChan chan notification.NewNotification, token tokens.Token) error {
	//objID := oid.ID{}
	//if err := objID.DecodeString(objectID); err != nil {
	//	fmt.Println("wrong object id", err)
	//	return object.Object{}, err
	//}
	//cnrID := cid.ID{}
	//
	//if err := cnrID.DecodeString(containerID); err != nil {
	//	fmt.Println("wrong object id", err)
	//	return object.Object{}, err
	//}
	//
	//var addr oid.Address
	//addr.SetContainer(cnrID)
	//addr.SetObject(objID)
	//
	//var prmHead client.PrmObjectHead
	//
	//pl, err := m.Pool(false)
	//if err != nil {
	//	return object.Object{}, err
	//}
	//target := eacl.Target{}
	//target.SetRole(eacl.RoleUser)
	//target.SetBinaryKeys([][]byte{m.gateAccount.PublicKey().Bytes()}) //todo - is this correct??
	//gateSigner := user.NewAutoIDSignerRFC6979(m.gateAccount.PrivateKey().PrivateKey)
	//
	//cliSdk, err := pl.RawClient()
	//if err != nil {
	//	return object.Object{}, err
	//}
	//netInfo, err := cliSdk.NetworkInfo(context.Background(), client.PrmNetworkInfo{})
	//if err != nil {
	//	return object.Object{}, fmt.Errorf("read current network info: %w", err)
	//}
	//var sessionToken session.Object
	//sessionToken.SetAuthKey(gateSigner.Public()) //gateSigner.Public()
	//sessionToken.SetID(uuid.New())
	//sessionToken.SetIat(netInfo.CurrentEpoch())
	//sessionToken.SetNbf(netInfo.CurrentEpoch())
	//sessionToken.SetExp(netInfo.CurrentEpoch() + 100) // or particular exp value
	//sessionToken.BindContainer(cnrID)
	//sessionToken.ForVerb(session.VerbObjectHead)
	//
	//fmt.Println("attempting to get object metadata ") //fails as chan
	//m.SignWithWC(&sessionToken)
	//
	//prmHead.WithinSession(sessionToken)
	//hdr, err := pl.ObjectHead(m.ctx, cnrID, objID, gateSigner, prmHead)
	//if err != nil {
	//	if reason, ok := isErrAccessDenied(err); ok {
	//		fmt.Printf("error here: %s: %s\r\n", err, reason)
	//		return object.Object{}, err
	//	}
	//	fmt.Errorf("read object header via connection pool: %w", err)
	//	return object.Object{}, err
	//}
	//
	//return *hdr, nil
	return nil
}
func (o *Object) Read(wg *sync.WaitGroup, p payload.Parameters, actionChan chan notification.NewNotification, token tokens.Token) error {
	return nil
}
func (o *Object) Write(wg *sync.WaitGroup, p payload.Parameters, actionChan chan notification.NewNotification, token tokens.Token) error {
	return nil
}
func (o *Object) Delete(wg *sync.WaitGroup, p payload.Parameters, actionChan chan notification.NewNotification, token tokens.Token) error {
	return nil
}
func (o *Object) List(wg *sync.WaitGroup, p payload.Parameters, actionChan chan notification.NewNotification, token tokens.Token) error {
	return nil
}
