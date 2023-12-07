package main

import (
	"context"
	"errors"
	"fmt"
	"github.com/amlwwalker/greenfinch.react/pkg/notification"
	"github.com/amlwwalker/greenfinch.react/pkg/utils"
	"time"
)

type UIProgressEvent struct {
	name         string
	progressChan chan int
}

func NewUIProgressEvent(name string, progressChan chan int) UIProgressEvent {
	return UIProgressEvent{
		name:         name,
		progressChan: progressChan,
	}
}
func (m UIProgressEvent) Emit(c context.Context, message string, p any) error {
	if pyld, ok := p.(notification.ProgressMessage); ok {
		//fmt.Printf("UIProgress - Progress [%s]: %d%%, Written: %d bytes\n", pyld.Title, pyld.Progress, pyld.BytesWritten)
		m.progressChan <- pyld.Progress
	} else {
		return errors.New(utils.ErrorNotPayload)
	}
	return nil
}

type ProgressBar interface {
	// Increment the progress by a given amount
	Increment(int)
	// Set the progress to a specific value
	SetProgress(int)
	// Get the current progress value
	Value() int
	// View returns the string representation of the progress bar
	View() string
}

func downloadFile(url string, progressChan chan<- int) {
	//defer close(progressChan) // Close the channel once the download is complete
	// Simulate a download process
	totalSize := 100 // total size for demonstration
	for i := 0; i <= totalSize; i++ {
		// Simulate work
		time.Sleep(50 * time.Millisecond)
		// Update progress: send the current progress to the channel
		progressChan <- i
	}

}

type SimpleProgressBar struct {
	progress int
	total    int
}

func NewSimpleProgressBar(total int) *SimpleProgressBar {
	return &SimpleProgressBar{
		progress: 0,
		total:    total,
	}
}

func (p *SimpleProgressBar) Increment(amount int) {
	p.progress += amount
	if p.progress > p.total {
		p.progress = p.total
	}
}

func (p *SimpleProgressBar) SetProgress(value int) {
	p.progress = value
	if p.progress > p.total {
		p.progress = p.total
	}
}

func (p *SimpleProgressBar) Value() int {
	return p.progress
}

func (p *SimpleProgressBar) View() string {
	return fmt.Sprintf("Progress: %d%%", p.progress)
}
