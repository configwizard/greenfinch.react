package notification

import (
	"github.com/google/uuid"
	"strconv"
	"time"
)

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
