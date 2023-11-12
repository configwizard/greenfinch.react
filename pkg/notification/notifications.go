package notification

import (
	"context"
	"errors"
	"fmt"
	"github.com/amlwwalker/greenfinch.react/pkg/emitter"
	"github.com/amlwwalker/greenfinch.react/pkg/utils"
	"github.com/google/uuid"
	"log"
	"strconv"
	"sync"
	"time"
)

/*
for mocker we need an emitter
*/

type MockNotificationEvent struct {
	Name string
}

func (m MockNotificationEvent) Emit(c context.Context, message string, p any) error {
	log.Println("emitting ", message, p)
	actualPayload, ok := p.(NewNotification)
	if !ok {
		return errors.New(utils.ErrorNotPayload)
	}
	fmt.Printf("%s firing notification %+v\r\n", m.Name, actualPayload)
	return nil
}

type NotificationType uint8

const (
	ActionToast NotificationType = iota
	ActionNotification
	ActionClipboard
)
const (
	Success string = "success"
	Info           = "info"
	Warning        = "warning"
	Error          = "erro"
)

type Notifier interface {
	Notification(title, description, typz string, action NotificationType) NewNotification //creates a new notifier
	QueueNotification(notification NewNotification)                                        //pushes a notification onto a sending queue
	ListenAndEmit()                                                                        //listens for notifications and sends them out
}
type NewNotification struct {
	Id          string
	User        string //who is this message for so we can store it in the database
	Title       string
	Type        string
	Action      NotificationType
	Description string
	Meta        map[string]string
	CreatedAt   string
	MarkRead    bool
}

type EmitNotifier struct { //used to emit messages over a provided emitter
	emitter.Emitter
}

type MockNotifier struct {
	emitter.Emitter
	notificationCh chan NewNotification
	ctx            context.Context //to cancel the routine
	cancelFunc     context.CancelFunc
	wg             *sync.WaitGroup
}

func NewMockNotifier(wg *sync.WaitGroup, emit emitter.Emitter, ctx context.Context, cancelFunc context.CancelFunc) MockNotifier {
	return MockNotifier{
		Emitter:        emit,
		notificationCh: make(chan NewNotification),
		ctx:            ctx,
		cancelFunc:     cancelFunc,
		wg:             wg,
	}
}
func (m MockNotifier) End() {
	m.cancelFunc()
}
func (m MockNotifier) Notification(title, description, typez string, action NotificationType) NewNotification {
	return NewNotification{
		Title:       title,
		Description: description,
		Type:        typez,
		Action:      action,
	}
}
func (m MockNotifier) QueueNotification(notification NewNotification) {
	fmt.Println("pushing notification ", notification)
	m.notificationCh <- notification
}

func (m MockNotifier) ListenAndEmit() {
	defer m.wg.Done()
	defer close(m.notificationCh)
	for {
		select {
		case <-m.ctx.Done():
			log.Println("closed mock notifier")
			return
		case not := <-m.notificationCh:
			//log.Printf("notification received %+v\r\n", not)
			if err := m.Emit(m.ctx, emitter.NotificationMessage, not); err != nil {
				return
			}
			m.End() //this is to close this routine for tests (stop hanging) - means test will only process one notification
		}
	}
}

// this is used by the existing notification architecture
type Notification struct {
	Id          string
	User        string //who is this message for so we can store it in the database
	Title       string
	Type        string
	Action      string
	Description string
	Meta        map[string]string
	CreatedAt   string
	MarkRead    bool
}

func NewNotificationMessage(p *Notification) Notification {
	uuid, _ := uuid.NewUUID()
	p.Id = uuid.String() //rand.Intn(10001-1) + 1
	p.CreatedAt = strconv.FormatInt(time.Now().Unix(), 10)
	//store it in the database against the current user
	return *p
}
