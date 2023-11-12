package notification

import (
	"context"
	"sync"
	"testing"
)

func TestNotification(t *testing.T) {
	m := MockNotifier{
		notificationCh: make(chan NewNotification),
		ctx:            context.Background(),
	}
	wg := sync.WaitGroup{}
	wg.Add(1)
	go m.ListenAndEmit()
	m.QueueNotification(NewNotification{
		Title:       "Success",
		Type:        "success",
		Action:      ActionNotification,
		Description: "Successful Notification",
	})
	wg.Wait()
}
