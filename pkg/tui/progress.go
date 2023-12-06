package main

import (
	"context"
	"errors"
	"fmt"
	"github.com/amlwwalker/greenfinch.react/pkg/notification"
	"github.com/amlwwalker/greenfinch.react/pkg/utils"
	"time"
)

type ProgressBar interface {
	Emit(c context.Context, message string, payload any) error
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
	// Simulate a download process
	totalSize := 100 // total size for demonstration
	for i := 0; i <= totalSize; i++ {
		// Simulate work
		time.Sleep(50 * time.Millisecond)

		// Update progress: send the current progress to the channel
		progressChan <- i
	}
	close(progressChan) // Close the channel once the download is complete
}

type SimpleProgressBar struct {
	onUpdate func(progress int)
	progress int
	total    int
}

func NewSimpleProgressBar(total int, onUpdate func(progress int)) *SimpleProgressBar {
	return &SimpleProgressBar{
		onUpdate: onUpdate,
		progress: 0,
		total:    total,
	}
}
func (p *SimpleProgressBar) SetUpdateCallback(callback func(progress int)) {
	p.onUpdate = callback
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
	// Here you would implement the logic to create a text representation of the progress bar
	// For simplicity, it will just show the percentage
	//percent := (p.progress * 100) / p.total
	logger.Println("p.View ", p.progress)
	return fmt.Sprintf("Progress: %d%%", p.progress)
}

func (p SimpleProgressBar) Emit(c context.Context, message string, pld any) error {
	if pyld, ok := pld.(notification.ProgressMessage); ok {
		p.progress = pyld.Progress
		if p.onUpdate != nil {
			logger.Println("we have an update", p.progress)
			p.onUpdate(p.progress)
			fmt.Printf("MOCKPROGRESS - Progress [%s]: %d%%, Written: %d bytes\n", pyld.Title, pyld.Progress, pyld.BytesWritten)
		}
	} else {
		return errors.New(utils.ErrorNotPayload)
	}
	return nil
}
