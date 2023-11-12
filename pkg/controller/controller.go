package controller

import (
	"context"
	"errors"
	"github.com/amlwwalker/greenfinch.react/pkg/notification"
	"github.com/amlwwalker/greenfinch.react/pkg/payload"
	"github.com/amlwwalker/greenfinch.react/pkg/tokens"
	"github.com/amlwwalker/greenfinch.react/pkg/utils"
	"github.com/google/uuid"
	"github.com/nspcc-dev/neo-go/pkg/crypto/keys"
	wal "github.com/nspcc-dev/neo-go/pkg/wallet"
	cid "github.com/nspcc-dev/neofs-sdk-go/container/id"
	"github.com/nspcc-dev/neofs-sdk-go/eacl"
	"log"
	"sync"
	"time"
)

type EventMessage string

const (
	RequestSign         EventMessage = "request_sign_payload"
	ContainerListUpdate              = "container_list_update"
	ObjectListUpdate                 = "objectUpdate"
)

// type ActionType func(p payload.Parameters, signedPayload payload.Payload, token Token) (notification.Notification, error)
type ActionType func(p payload.Parameters, token tokens.Token) (notification.Notification, error)

// Action defines the interface for actions that can be performed on objects
type Action interface {

	//todo - payload currently holds the signed token, but the naming here could be better
	Head(p payload.Parameters, token tokens.Token) (notification.Notification, error)
	Read(p payload.Parameters, token tokens.Token) (notification.Notification, error)
	Write(p payload.Parameters, token tokens.Token) (notification.Notification, error)
	Delete(p payload.Parameters, token tokens.Token) (notification.Notification, error)
	List(p payload.Parameters, token tokens.Token) (notification.Notification, error)
}

type RawWallet struct {
	*wal.Wallet
	Address string
}

func NewRawWallet(filepath string) (RawWallet, error) {
	return RawWallet{
		Wallet:  nil,
		Address: "",
	}, nil
}
func (w RawWallet) Sign(p payload.Payload) error {
	//here you would sign it using a normal wallet private key etc
	return nil
}

func (w RawWallet) PublicKeyHexString() string {
	// retrieve the public key from the wallet
	return ""
}

type WCWallet struct {
	WalletAddress string
	PublicKey     string
	emitter       Emitter
}

func (w WCWallet) Address() string {
	return w.WalletAddress
}
func (w WCWallet) Sign(p payload.Payload) error {
	return w.emitter.Emit(context.Background(), (string)(RequestSign), p)
}

func (w WCWallet) PublicKeyHexString() string {
	return w.PublicKey
}

type Wallet interface {
	Sign(p payload.Payload) error
	PublicKeyHexString() string
	Address() string
}

type TokenManager interface {
	NewBearerToken(table eacl.Table, lIat, lNbf, lExp uint64, temporaryKey *keys.PublicKey) (tokens.Token, error)
	FindBearerToken(address string, id cid.ID, epoch uint64, operation eacl.Operation) (tokens.Token, error)
	GateKey() wal.Account
}

// Controller manages the frontend and backend/SDK interconnectivity
type Controller struct {
	ctx           context.Context
	pendingEvents map[uuid.UUID]payload.Payload //holds any asynchronous information sent to frontend
	actionMap     map[uuid.UUID]ActionType      // Maps payload UID to corresponding action
	Emitter       Emitter
	wallet        Wallet
	tokenManager  TokenManager
}

func New(emitter Emitter) Controller {
	return Controller{
		pendingEvents: make(map[uuid.UUID]payload.Payload),
		actionMap:     make(map[uuid.UUID]ActionType),
		Emitter:       emitter,
		tokenManager:  tokens.TokenManager{},
	}
}

func (m *Controller) Startup(ctx context.Context) {
	m.ctx = ctx
}

// domReady is called after the front-end dom has been loaded
func (m *Controller) DomReady(ctx context.Context) {
}

// LoadSession is responsible for taking input from the user and creating the wallet to manage the session.
func (c *Controller) LoadSession(address, publicKey string) { //todo - these fields may not be available immediately
	//somehow the user informs us of the wallet they want to load. We should adjust the wallet here accordingly.
	c.wallet = WCWallet{
		WalletAddress: "",
		PublicKey:     "",
		emitter:       c.Emitter,
	}
}

// RequestSign asks the wallet to begin the signing process. This assumes signing is asynchronous
func (c *Controller) SignRequest(payload payload.Payload) error {
	if c.wallet == nil {
		return errors.New(utils.ErrorNoSession)
	}
	if _, ok := c.pendingEvents[payload.Uid]; ok {
		//exists. end
		return errors.New(utils.ErrorPendingInUse)
	}
	//if we have a signed request
	c.pendingEvents[payload.Uid] = payload
	return c.wallet.Sign(payload)
}

// SignResponse will be called when a signed payload is returned
func (c *Controller) SignResponse(signedPayload payload.Payload) error {
	if c.wallet == nil {
		return errors.New(utils.ErrorNoSession)
	}
	if p, ok := c.pendingEvents[signedPayload.Uid]; ok {
		updatedPayload := p // Dereference to get a copy of the payload
		updatedPayload.Complete = true
		updatedPayload.OutgoingData = nil //we are done with this. No need to pass it around now
		//tidier way to do this?
		updatedPayload.Signature = &payload.Signature{ // if this is null, there is no signature to attach to the token
			HexSignature: signedPayload.Signature.HexSignature,
			HexSalt:      signedPayload.Signature.HexSalt,
			HexPublicKey: signedPayload.Signature.HexPublicKey,
		}
		// Update the map with the new struct
		c.pendingEvents[signedPayload.Uid] = updatedPayload
		// Notify through the channel
		updatedPayload.ResponseCh <- true
		return nil
	}
	return errors.New(utils.ErrorNotFound)
}

// PerformAction is partnered with any 'event' that requires and action from the user and could take a while.
// It runs the action that is stored, related to the payload that has been sent to the frontend.
func (c *Controller) PerformAction(wg *sync.WaitGroup, p payload.Parameters, action ActionType, token tokens.Token) error {
	if c.wallet == nil {
		return errors.New(utils.ErrorNoSession)
	}
	var cnrId cid.ID
	err := cnrId.DecodeString(p.ParentID())
	if err != nil {
		return err
	}

	//at this point we need to find out if we have a bearer token that can handle this action for us
	//1. check if we have a token that will fulfil the operation for the request
	if bearerToken, err := c.tokenManager.FindBearerToken(c.wallet.Address(), cnrId, p.Epoch(), p.Operation()); err == nil {
		//we believe we have a token that can perform
		//the action should now be passed what it was going to be passed anyway, along with the token that it can use to make the request.
		//these actions will be responsible for notifying UI themselves (i.e progress bars etc)
		if notification, err := action(p, bearerToken); err != nil {
			//notification (interface) handler would handle any errors here. (c.notificationHandler interface type)
			return err
		} else {
			log.Println("notification due to finding bearer token ", notification)
		}
		return nil // this task has been triggered. No need to continue
	}
	var neoFSPayload payload.Payload
	neoFSPayload.Uid = uuid.New()
	neoFSPayload.ResponseCh = make(chan bool)
	// Store the action in the map
	c.actionMap[neoFSPayload.Uid] = action

	//make up the unsigned token here, so can be used by both the signer and the verifier functions
	target := eacl.Target{}
	target.SetRole(eacl.RoleUser)
	key := c.tokenManager.GateKey()
	target.SetBinaryKeys([][]byte{key.PublicKey().Bytes()})
	table := tokens.GeneratePermissionsTable(cnrId, target) //currently this allows all operations.
	bearerToken, err := c.tokenManager.NewBearerToken(table, 0, 0, 0, key.PublicKey())
	if err != nil {
		return err
	}
	//update the payload to the data to sign
	neoFSPayload.OutgoingData = bearerToken.SignedData()
	wg.Add(1)
	// Wait for the payload to be signed in a separate goroutine
	go func() {
		defer wg.Done()
		select {
		case <-neoFSPayload.ResponseCh:
			//we just received a signed token payload. Lets recreate the associated token
			// Payload signed, perform the action
			if pendingPayload, exists := c.pendingEvents[neoFSPayload.Uid]; exists {
				neoFSPayload = pendingPayload
			} else {
				return
			}
			if act, exists := c.actionMap[neoFSPayload.Uid]; exists {
				if err := bearerToken.Sign(c.wallet.Address(), neoFSPayload); err != nil {
					return
				}
				_, err := act(p, bearerToken)
				if err != nil {
					//handle the error with the UI (n)
					return
				}
				delete(c.actionMap, neoFSPayload.Uid) // Clean up
			}
		case <-time.After(60 * time.Second):
			// Handle timeout
			delete(c.actionMap, neoFSPayload.Uid) // Clean up
			delete(c.pendingEvents, neoFSPayload.Uid)
			log.Fatal("timer ticked. Nothing found.")
		}
	}()
	// Request signing
	if err := c.SignRequest(neoFSPayload); err != nil {
		return err
	}
	wg.Wait()
	return nil
}
