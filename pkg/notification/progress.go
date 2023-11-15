package notification

import (
	"context"
	"errors"
	"fmt"
	"github.com/amlwwalker/greenfinch.react/pkg/emitter"
	"github.com/amlwwalker/greenfinch.react/pkg/utils"
	"github.com/machinebox/progress"
	"io"
	"sync"
	"time"
)

type MockProgressEvent struct {
	name string
}

func (m MockProgressEvent) Emit(c context.Context, message string, p any) error {
	if pyld, ok := p.(ProgressMessage); ok {
		fmt.Printf("MOCKPROGRESS - Progress [%s]: %d%%, Written: %d bytes\n", pyld.Title, pyld.Progress, pyld.BytesWritten)
	} else {
		return errors.New(utils.ErrorNotPayload)
	}
	return nil
}

type ProgressMessage struct {
	Title        string
	Progress     int
	BytesWritten int64
	Completed    bool
	Remaining    time.Duration
	ExpectedSize int64
	Show         bool
	Error        string
}

type ProgressBarFactory func(w io.Writer, name string) ProgressBar

type ProgressBarManager struct {
	emitter.Emitter
	ProgressBars       []ProgressBar
	progressBarFactory ProgressBarFactory
	UpdatesCh          chan ProgressMessage // A channel to send updates back to the caller
	activeBars         int
	activeBarsLock     sync.Mutex
}

func NewProgressBarManager(factory ProgressBarFactory, emitter emitter.Emitter) *ProgressBarManager {
	return &ProgressBarManager{
		Emitter:            emitter,
		ProgressBars:       make([]ProgressBar, 0),
		progressBarFactory: factory,
		UpdatesCh:          make(chan ProgressMessage),
	}
}

func (p *ProgressBarManager) AddProgressWriter(w io.Writer, name string) *WriterProgressBar {
	progressBar, ok := p.progressBarFactory(w, name).(*WriterProgressBar) // Corrected type assertion
	if !ok {
		panic("ProgressBarFactory did not return a *writerProgressBar")
	}

	p.activeBarsLock.Lock()
	p.activeBars++
	p.activeBarsLock.Unlock()

	p.ProgressBars = append(p.ProgressBars, progressBar)

	// Start listening to updates from this progress bar
	go func() {
		for update := range progressBar.statusCh {
			//update.
			//you can either listen and emit directly from here
			err := p.Emit(context.Background(), emitter.ProgressMessage, update)
			if err != nil {
				fmt.Println("emitting ", err)
			}
			//or you can push it to a channel reachable elsewhere.
			//p.UpdatesCh <- update // Forward updates to the manager's channel
		}
		p.decrementActiveBars()
	}()

	return progressBar
}
func (p *ProgressBarManager) decrementActiveBars() {
	p.activeBarsLock.Lock()
	defer p.activeBarsLock.Unlock()
	p.activeBars--
	if p.activeBars == 0 {
		close(p.UpdatesCh)
	}
}
func (p *ProgressBarManager) StartProgressBar(wg *sync.WaitGroup, name string, payloadSize int64) {
	for _, bar := range p.ProgressBars {
		if wBar, ok := bar.(*WriterProgressBar); ok && wBar.name == name {
			wg.Add(1)
			go func() {
				defer wg.Done()
				fmt.Println("starting progress bar ", name)
				bar.Start(payloadSize, wg)
				fmt.Println("hello bar")
			}()
		}
	}
}

type ProgressBar interface {
	Start(payloadSize int64, wg *sync.WaitGroup) // Initialize and start the progress bar
	Write(data []byte) (int, error)              // Update the progress bar to the current value
	Finish()                                     // Finish the progress bar
}

type WriterProgressBar struct {
	ctx context.Context
	*progress.Writer
	duration time.Duration
	name     string
	statusCh chan ProgressMessage
}

func WriterProgressBarFactory(w io.Writer, name string) ProgressBar {
	statusCh := make(chan ProgressMessage) // Each bar should have its own channel
	return &WriterProgressBar{             // Return a pointer
		ctx:      context.Background(),
		Writer:   progress.NewWriter(w),
		name:     name,
		duration: 50 * time.Millisecond,
		statusCh: statusCh,
	}
}

func NewWriterProgressBar(ctx context.Context, statusCh chan ProgressMessage, rw io.Writer, name string, update time.Duration) WriterProgressBar {
	w := WriterProgressBar{}
	w.ctx = ctx
	w.Writer = progress.NewWriter(rw)
	w.name = name
	w.duration = update
	w.statusCh = statusCh
	return w
}

func (w WriterProgressBar) Write(data []byte) (int, error) {
	return w.Writer.Write(data)
}

// Start is run on a routine so it can continously  update the channel
func (w WriterProgressBar) Start(payloadSize int64, wg *sync.WaitGroup) {
	// Implementation for Start
	status := ProgressMessage{
		Title: w.name,
		Show:  true,
	}
	wg.Add(1)
	go func() {
		defer wg.Done()
		progressChan := progress.NewTicker(w.ctx, w.Writer, payloadSize, w.duration)
		for p := range progressChan {
			select {
			case <-w.ctx.Done():
				errMsg, ok := w.ctx.Value("error").(string)
				status := status
				if ok && errMsg != "" {
					//no error, finish gracefully?
					status.Error = errMsg
				}
				status.Show = false
				w.statusCh <- status
			default:
				//send to a progress notifier that has been supplied
				if p.N() == 0 {
					continue
				}
				status := status
				status.Progress = int(p.Percent())
				status.BytesWritten = p.N()
				status.ExpectedSize = p.Size()
				status.Remaining = p.Remaining().Round(250 * time.Millisecond)
				w.statusCh <- status
			}
		}
	}()
}

func (w WriterProgressBar) Update(current int64) {
	//obselete potentially
}
func (w WriterProgressBar) Finish() {
	// Implementation for Finish
	defer close(w.statusCh) // Close the statusCh channel

	err := w.Writer.Err()
	if err != nil {
		fmt.Println("writer progress bar has an error ", err)
	}
}
