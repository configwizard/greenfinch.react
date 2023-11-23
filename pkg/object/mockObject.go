package object

import (
	"encoding/json"
	"fmt"
	"github.com/amlwwalker/greenfinch.react/pkg/database"
	"github.com/amlwwalker/greenfinch.react/pkg/notification"
	"github.com/amlwwalker/greenfinch.react/pkg/payload"
	"github.com/amlwwalker/greenfinch.react/pkg/tokens"
	"io"
	"log"
	"sync"
	"time"
)

//
//type MockObjectParameter struct {
//	ContainerID string
//	Id          string
//	io.ReadWriter
//	WG              *sync.WaitGroup
//	Attrs           []object.Attribute
//	ActionOperation eacl.Operation
//	ExpiryEpoch     uint64
//}
//
//func (o *MockObjectParameter) Operation() eacl.Operation {
//	return o.ActionOperation
//}
//func (o *MockObjectParameter) Epoch() uint64 {
//	return o.ExpiryEpoch
//}
//func (o *MockObjectParameter) ParentID() string {
//	return o.ContainerID
//}
//
//func (o *MockObjectParameter) ID() string {
//	return o.Id
//}
//
//func (o *MockObjectParameter) WaitGroup() *sync.WaitGroup {
//	return o.WG
//}
//
//func (o *MockObjectParameter) Attributes() []object.Attribute {
//	return o.Attrs
//}

type MockObject struct {
	Id, ContainerId string // Identifier for the object
	CreatedAt       time.Time
	UpdatedAt       time.Time
	// the data payload
	//the location its to be read from/saved to if necessary
	notification.Notifier
	database.Store
}

// todo - this will need to handle synchronous requests to the database and then asynchronous requests to the network
// basically load what we have but update it.
// these will need to fire notifications and events on completion.
// think about what to return here. We are trying to avoid anything being slow which means if we have something in the database
// we should return that with an 'synchronising' message. then the routine can update the UI for this request using an emitter
// and a message type with any new information?
// however maybe that isn;t the jjob of this and its the hob of the controller, who interfces with the UI. so this needs a chanenl to send messages on actually
func (o *MockObject) Head(wg *sync.WaitGroup, p payload.Parameters, actionChan chan notification.NewNotification, token tokens.Token) error {
	buffer := make([]byte, 10)
	wg.Add(1)
	fmt.Println(o.Store)
	go func() {
		defer func() {
			wg.Done()
			fmt.Println("HEAD action completed")
		}()
		//pretend to go and get the head of an object using SDK
		//this should use the provided signed Token as authentication token

		fmt.Println("starting .....")
		// Continuously read from DualStream and write to destination
		byt, err := json.Marshal(o)
		if err != nil {
			actionChan <- o.Notification(
				"failed to marshal object",
				"could not marshal object for database storage "+err.Error(),
				notification.Error,
				notification.ActionNotification)
			return
		}
		if err := o.Create(database.ObjectBucket, o.Id, byt); err != nil {
			actionChan <- o.Notification(
				"failed to store object",
				"could not store [pending] object in database "+err.Error(),
				notification.Error,
				notification.ActionNotification)
			return
		}
		for {
			n, err := p.Read(buffer)
			if n > 0 {
				if _, err := p.Write(buffer[:n]); err != nil {
					actionChan <- o.Notification(
						"failed to write to buffer",
						"could not write object to buffer "+err.Error(),
						notification.Error,
						notification.ActionNotification)
					return
				}
			}
			if err != nil {
				if err == io.EOF {
					fmt.Println("reached end of file")
					actionChan <- o.Notification(
						"download complete!",
						"object "+o.Id+" completed",
						notification.Success,
						notification.ActionNotification)
					break
				}
				fmt.Println("actual error ", err)
				actionChan <- o.Notification(
					"error",
					"no more data",
					notification.Error,
					notification.ActionNotification)
			}
			//time.Sleep(2 * time.Millisecond)
		}

		//update the object now we have more information about it
		if err := o.Update(database.ObjectBucket, o.Id, byt); err != nil {
			actionChan <- o.Notification(
				"failed to store object",
				"could not store [pending] object in database "+err.Error(),
				notification.Error,
				notification.ActionNotification)
		}
	}()
	return nil
}
func (o *MockObject) Read(p payload.Parameters, actionChan chan notification.NewNotification, token tokens.Token) (notification.Notification, error) {
	wg := sync.WaitGroup{}
	wg.Add(1)
	go func() {
		defer wg.Done()
		//pretend to go and get the head of an object using SDK
		//this should use the provided signed Token as authentication token
		jpegHeader := []byte{0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46, 0x49, 0x46, 0x00, 0x01, 0x01, 0x01, 0x00, 0x60, 0x00, 0x60, 0x00, 0x00, 0xFF, 0xDB, 0x00, 0x43, 0x00, 0x03, 0x02, 0x02, 0x02, 0x02, 0x02, 0x03, 0x02, 0x02, 0x03, 0x03, 0x03, 0x03, 0x04, 0x03, 0x03, 0x04, 0x05, 0x08, 0x05, 0x05, 0x04, 0x04, 0x05, 0x0A}
		time.Sleep(2 * time.Second)
		log.Println("finished HEAD action")
		//the Read() and Head() method would use the reader portion to read and the writer portion to write
		_, err := p.Write(jpegHeader)
		if err != nil {
			log.Println("error writing to writer ", err)
			return
		}
	}()
	wg.Wait()
	return notification.Notification{}, nil
}
func (o *MockObject) Write(p payload.Parameters, actionChan chan notification.NewNotification, token tokens.Token) (notification.Notification, error) {
	return notification.Notification{}, nil
}
func (o *MockObject) Delete(p payload.Parameters, actionChan chan notification.NewNotification, token tokens.Token) (notification.Notification, error) {
	return notification.Notification{}, nil
}
func (o *MockObject) List(p payload.Parameters, actionChan chan notification.NewNotification, token tokens.Token) (notification.Notification, error) {
	return notification.Notification{}, nil
}
