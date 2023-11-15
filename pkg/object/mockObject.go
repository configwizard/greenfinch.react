package object

import (
	"fmt"
	"github.com/amlwwalker/greenfinch.react/pkg/notification"
	"github.com/amlwwalker/greenfinch.react/pkg/payload"
	"github.com/amlwwalker/greenfinch.react/pkg/tokens"
	"github.com/nspcc-dev/neofs-sdk-go/eacl"
	"github.com/nspcc-dev/neofs-sdk-go/object"
	"io"
	"log"
	"sync"
	"time"
)

type MockObjectParameter struct {
	ContainerID string
	Id          string
	io.ReadWriter
	WG              *sync.WaitGroup
	Attrs           []object.Attribute
	ActionOperation eacl.Operation
	ExpiryEpoch     uint64
}

func (o *MockObjectParameter) Operation() eacl.Operation {
	return o.ActionOperation
}
func (o *MockObjectParameter) Epoch() uint64 {
	return o.ExpiryEpoch
}
func (o *MockObjectParameter) ParentID() string {
	return o.ContainerID
}

func (o *MockObjectParameter) ID() string {
	return o.Id
}

func (o *MockObjectParameter) WaitGroup() *sync.WaitGroup {
	return o.WG
}

func (o *MockObjectParameter) Attributes() []object.Attribute {
	return o.Attrs
}

type MockObject struct {
	Id, ContainerId string // Identifier for the object
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
func (o *MockObject) Head(wg *sync.WaitGroup, p payload.Parameters, token tokens.Token) (notification.NewNotification, error) {
	buffer := make([]byte, 1024)
	wg.Add(1)
	go func() {
		defer func() {
			wg.Done()
			fmt.Println("HEAD action completed")
		}()
		//pretend to go and get the head of an object using SDK
		//this should use the provided signed Token as authentication token
		time.Sleep(2 * time.Second)

		fmt.Println("starting .....")
		// Continuously read from DualStream and write to destination

		for {
			n, err := p.Read(buffer)
			if n > 0 {
				fmt.Println("reading ", n, " bytes")
				if _, err := p.Write(buffer[:n]); err != nil {
					fmt.Println("writing ", n, " bytes")
					log.Fatalf("Write failed: %v", err)
				}
			}
			if err != nil {
				if err == io.EOF {
					fmt.Println("reached end of file")
					break // End of stream, check if writing is done
				}
				log.Fatalf("Read failed: %v", err)
			}
			time.Sleep(150 * time.Millisecond)
		}
	}()
	return notification.NewNotification{}, nil
}
func (o *MockObject) Read(p payload.Parameters, token tokens.Token) (notification.Notification, error) {
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
func (o *MockObject) Write(p payload.Parameters, token tokens.Token) (notification.Notification, error) {
	return notification.Notification{}, nil
}
func (o *MockObject) Delete(p payload.Parameters, token tokens.Token) (notification.Notification, error) {
	return notification.Notification{}, nil
}
func (o *MockObject) List(p payload.Parameters, token tokens.Token) (notification.Notification, error) {
	return notification.Notification{}, nil
}
