package controller

import (
	"github.com/amlwwalker/greenfinch.react/pkg/notification"
	obj "github.com/amlwwalker/greenfinch.react/pkg/object"
	"github.com/amlwwalker/greenfinch.react/pkg/payload"
	"github.com/amlwwalker/greenfinch.react/pkg/tokens"
	wal "github.com/nspcc-dev/neo-go/pkg/wallet"
	"github.com/nspcc-dev/neofs-sdk-go/eacl"
	"github.com/nspcc-dev/neofs-sdk-go/object"
	"os"
	"sync"
	"testing"
)

type MockActionType struct {
	ID string // Identifier for the object
	// the data payload
	//the location its to be read from/saved to if necessary
}

func (o *MockActionType) Head(p payload.Parameters, token tokens.Token) (notification.Notification, error) {
	return notification.NewNotificationMessage(&notification.Notification{
		Title:       "mock head notification",
		Type:        "warning",
		Description: "mocking the head notification for requests that require signatures",
	}), nil
}
func (o *MockActionType) Read(p payload.Parameters, token tokens.Token) (notification.Notification, error) {
	return notification.Notification{}, nil
}
func (o *MockActionType) Write(p payload.Parameters, token tokens.Token) (notification.Notification, error) {
	return notification.Notification{}, nil
}
func (o *MockActionType) Delete(p payload.Parameters, token tokens.Token) (notification.Notification, error) {
	return notification.Notification{}, nil
}
func (o *MockActionType) List() (notification.Notification, error) {
	return notification.Notification{}, nil
}

func TestPayloadSigning(t *testing.T) {
	controller := New(nil)
	m := MockEvent{&controller}
	controller.Emitter = m //tied closely during tests...
	controller.LoadSession("", "")
	ephemeralAccount, err := wal.NewAccount()
	if err != nil {
		t.Fatal("could not create account ", err)
	}
	controller.tokenManager = tokens.MockTokenManager{W: *ephemeralAccount}
	//obj := object.Object{ID: "123"}

	mockAction := MockActionType{ID: "123"}

	wg := sync.WaitGroup{}
	// Request to perform a read action
	//p := payload.NewPayload([]byte("example data"))
	/*
		1. we need a token that will be signed but should that come from here?
		2. then we need to craft the payload for signing
		3. then we need to create the parameters for the action
	*/
	file, err := os.Open("path/to/your/file") // Use os.Create if you want to write to a new file
	if err != nil {
		// handle error
	}
	var o obj.ObjectParameter
	o.Id = "A6iuMASnCLGPVGgESWCiDfAWZZ8RiWQR5934JrJBDBoK"
	o.ContainerID = "87JeshQhXKBw36nULzpLpyn34Mhv1kGCccYyHU2BqGpT"
	o.PayloadChannel = make(chan payload.Payload)
	o.Attrs = make([]object.Attribute, 0)
	o.ActionOperation = eacl.OperationHead
	o.ReadWriter = file
	o.ExpiryEpoch = 100
	if err := controller.PerformAction(&wg, &o, mockAction.Head, nil); err != nil {
		t.Fatal(err)
	}
}
