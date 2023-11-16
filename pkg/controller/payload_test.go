package controller

import (
	"bytes"
	"context"
	"fmt"
	"github.com/amlwwalker/greenfinch.react/pkg/database"
	"github.com/amlwwalker/greenfinch.react/pkg/emitter"
	"github.com/amlwwalker/greenfinch.react/pkg/notification"
	obj "github.com/amlwwalker/greenfinch.react/pkg/object"
	"github.com/amlwwalker/greenfinch.react/pkg/payload"
	"github.com/amlwwalker/greenfinch.react/pkg/readwriter"
	"github.com/amlwwalker/greenfinch.react/pkg/tokens"
	wal "github.com/nspcc-dev/neo-go/pkg/wallet"
	"github.com/nspcc-dev/neofs-sdk-go/eacl"
	"github.com/nspcc-dev/neofs-sdk-go/object"
	"log"
	"math/rand"
	"os"
	"path/filepath"
	"sync"
	"testing"
)

type MockActionType struct {
	ID string // Identifier for the object
	// the data payload
	//the location its to be read from/saved to if necessary
}

func (o *MockActionType) Head(p payload.Parameters, token tokens.Token) (notification.NewNotification, error) {
	return notification.NewNotification{
		Title:       "mock head notification",
		Type:        notification.Success,
		Action:      notification.ActionToast,
		Description: "mocking the head notification for requests that require signatures",
	}, nil
}
func (o *MockActionType) Read(p payload.Parameters, token tokens.Token) (notification.NewNotification, error) {
	return notification.NewNotification{}, nil
}
func (o *MockActionType) Write(p payload.Parameters, token tokens.Token) (notification.NewNotification, error) {
	return notification.NewNotification{}, nil
}
func (o *MockActionType) Delete(p payload.Parameters, token tokens.Token) (notification.NewNotification, error) {
	return notification.NewNotification{}, nil
}
func (o *MockActionType) List() (notification.NewNotification, error) {
	return notification.NewNotification{}, nil
}

func TestPayloadSigning(t *testing.T) {
	wg := &sync.WaitGroup{}
	ctx, cancelFunc := context.WithCancel(context.Background())
	walletId := "address"
	publicKey := "publicKey"
	walletLocation := "walletLocation"
	db := database.NewMockDB(database.TESTNET, walletId, walletLocation)
	err := db.CreateWalletBucket()
	if err != nil {
		log.Fatal("error creating bucket wallet ", err)
	}

	//create an emitter for notifications
	notifyEmitter := notification.MockNotificationEvent{Name: "notification events:", DB: db}
	//create a notification manager
	n := notification.NewMockNotifier(wg, notifyEmitter, ctx, cancelFunc)

	//create a controller to hande comms between elements of business logic
	controller := New(db, nil, ctx, n) //emitter set later to tie them together

	mockSigner := emitter.MockSigningEvent{Name: "signing events:"}
	mockSigner.SignResponse = controller.SignResponse //set the callback hereso that we can close the loop during tests
	controller.Emitter = mockSigner                   //tied closely during tests...
	controller.LoadSession(walletId, publicKey)
	controller.wallet.Address()
	ephemeralAccount, err := wal.NewAccount()
	if err != nil {
		t.Fatal("could not create account ", err)
	}
	controller.tokenManager = tokens.MockTokenManager{W: *ephemeralAccount}

	mockAction := obj.MockObject{Id: "object", ContainerId: "container"}

	//the dualstream is designed to read from one location and write to the other
	dir := os.TempDir()
	file, err := os.Create(filepath.Join(dir, "stream.log")) // Use os.Create if you want to write to a new file
	if err != nil {
		log.Fatal("error could not open file")
	}
	//faking a jpeg image
	// Simulate a JPEG header (this is just an example)
	jpegHeader := []byte{0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46, 0x49, 0x46, 0x00}
	if write, err := file.Write(jpegHeader); err != nil {
		log.Fatal("could not write to file. Managed ", write, " bytes")
	}
	// Generate random data to simulate the rest of the JPEG content
	randomData := make([]byte, 4096) // Adjust size as needed
	rand.Read(randomData)            // Fill with random bytes
	if write, err := file.Write(randomData); err != nil {
		log.Fatal("could not write to file. Managed ", write, " bytes")
	}
	if write, err := file.Write([]byte("end-of-file")); err != nil {
		log.Fatal("could not write to file. Managed ", write, " bytes")
	}
	_, err = file.Seek(0, 0) // Seek to the beginning of the file
	if err != nil {
		log.Fatal("error seeking file", err)
	}

	fileStats, _ := file.Stat()
	fmt.Println("stats size = ", fileStats.Size())
	destination := new(bytes.Buffer) //this is where we want to put it
	//todo: in here now we can add a progressBarManager to the process.
	/*
				we add a progress bar and wrap the file with the writer so that the dual stream reader
			can use the progress bar. we have created one currently that we just need to swap out the file
			destination so that the progressbar becomes "middleware". We can then check that the data is travelling
			to the destination correctly and we can monitor progress.

		after that we need to make this process happen in the object type. The object will need to know how to write to a database interface
	*/
	progressBarEmitter := notification.MockProgressEvent{}
	controller.progressBarManager = notification.NewProgressBarManager(notification.WriterProgressBarFactory, progressBarEmitter)
	pBarName := "file_monitor" //todo - expose the name of a progress bar
	fileWriterProgressBar := controller.progressBarManager.AddProgressWriter(destination, pBarName)
	controller.progressBarManager.StartProgressBar(wg, pBarName, fileStats.Size())

	//wg.Add(1)
	//go func() {
	//	defer wg.Done()
	//	for update := range progressBarManager.UpdatesCh {
	//		fmt.Printf("Manager - Progress [%s]: %d%%, Written: %d bytes\n", update.Title, update.Progress, update.BytesWritten)
	//	}
	//}()

	wg.Add(1)
	go controller.Notifier.ListenAndEmit() //this sends out notifications to the frontend.
	// Request to perform a read action
	//p := payload.NewPayload([]byte("example data"))
	/*
		1. we need a token that will be signed but should that come from here?
		2. then we need to craft the payload for signing
		3. then we need to create the parameters for the action
	*/
	var o obj.ObjectParameter
	o.Id = "A6iuMASnCLGPVGgESWCiDfAWZZ8RiWQR5934JrJBDBoK"
	o.ContainerID = "87JeshQhXKBw36nULzpLpyn34Mhv1kGCccYyHU2BqGpT"
	//o.WaitGroup() = make(chan payload.Payload)
	o.Attrs = make([]object.Attribute, 0)
	o.ActionOperation = eacl.OperationHead
	o.ReadWriter = &readwriter.DualStream{
		Reader: file,                  //here is where it knows the source of the data
		Writer: fileWriterProgressBar, //this is where we write the data to
	}
	o.ExpiryEpoch = 100

	//waits for actions to complete entirely
	if err := controller.PerformAction(wg, &o, mockAction.Head); err != nil {
		t.Fatal(err)
	}
	read, err := controller.DB.Read(database.NotificationBucket, n.GenerateIdentifier())
	if err != nil {
		fmt.Println("database error ", err)
		return
	}
	fmt.Printf("database: %+v\r\n", string(read))
	fmt.Printf("last of data - %s\r\n", destination.String()[len(destination.String())-11:])
	defer func(file *os.File) {
		err := file.Close()
		if err != nil {

		}
	}(file)
}
