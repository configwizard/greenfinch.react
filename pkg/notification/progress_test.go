package notification

import (
	"bytes"
	"context"
	"fmt"
	"github.com/amlwwalker/greenfinch.react/pkg/readwriter"
	"io"
	"sync"
	"testing"
	"time"
)

func TestProgressBar(t *testing.T) {
	statusCh := make(chan ProgressMessage)
	writer := new(bytes.Buffer)

	// Simulating data
	data := []byte{0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46, 0x49, 0x46, 0x00}
	data = append(data, data...)
	data = append(data, data...)
	data = append(data, data...)
	data = append(data, data...)
	dataReader := bytes.NewReader(data)

	ctx, cancelFunc := context.WithCancel(context.Background())
	wg := sync.WaitGroup{}

	wp := NewWriterProgressBar(ctx, statusCh, writer, "test transfer", 50*time.Millisecond)
	wg.Add(1)
	go func() {
		defer wg.Done()
		wp.Start(int64(len(data)), &wg)
	}()
	wg.Add(1)
	go func() {
		defer wg.Done()
		for {
			select {
			case status := <-statusCh:
				fmt.Printf("Progress: %d%%, Written: %d bytes\n", status.Progress, status.BytesWritten)
			case <-ctx.Done():
				fmt.Println("finished")
				return
			}
		}
	}()
	// Simulate data transfer
	buf := make([]byte, 8)
	for {
		n, err := dataReader.Read(buf)
		if n > 0 {
			if _, err := wp.Write(buf[:n]); err != nil {
				t.Fatalf("error writing to buffer: %s", err)
			}
		}
		if err != nil {
			cancelFunc()
			break
		}
		time.Sleep(100 * time.Millisecond)
	}
	// Finalize the progress bar
	wp.Finish()

	wg.Wait()

	// Test validation: Ensure written data matches expected data
	if writer.String() != string(data) {
		t.Errorf("written data does not match expected data. Got: %s, Want: %s", writer.String(), string(data))
	}
}

func TestProgressBarWithManager(t *testing.T) {
	mockProgressEmitter := MockProgressEvent{}
	manager := NewProgressBarManager(WriterProgressBarFactory, mockProgressEmitter)
	writers := make([]*bytes.Buffer, 2) // Assume two progress bars for the test
	var wg = &sync.WaitGroup{}

	// Creating and starting multiple progress bars
	for i := range writers {
		writers[i] = new(bytes.Buffer)
		bar := manager.AddProgressWriter(writers[i], fmt.Sprintf("TestBar%d", i))
		data := []byte{0xFF, 0xD8, 0xFF, byte(i)} // Sample data for each bar
		dataReader := bytes.NewReader(data)

		wg.Add(1)
		go func(b *WriterProgressBar, dr *bytes.Reader) {
			defer wg.Done()
			manager.StartProgressBar(wg, b.name, int64(len(data)))

			buf := make([]byte, 1)
			for {
				n, err := dr.Read(buf)
				if n > 0 {
					if _, err := b.Write(buf[:n]); err != nil {
						t.Errorf("error writing to buffer: %s", err)
						return
					}
				}
				if err != nil {
					break
				}
				time.Sleep(250 * time.Millisecond)
			}
			bar.Finish()
		}(bar, dataReader)
	}
	// Wait for all progress bars to complete
	wg.Wait()
	// Test validation for each writer
	for i, writer := range writers {
		expectedData := []byte{0xFF, 0xD8, 0xFF, byte(i)}
		if len(writer.String()) == 0 || writer.String() != string(expectedData) {
			t.Errorf("writer %d: written data does not match expected data. Got: %s, Want: %s", i, writer.String(), string(expectedData))
		}
	}
}
func TestProgressManagerWithDualStream(t *testing.T) {

	type MockObjectParameter struct {
		io.ReadWriter
	}
	mockProgressEmitter := MockProgressEvent{}
	manager := NewProgressBarManager(WriterProgressBarFactory, mockProgressEmitter)
	writers := make([]*bytes.Buffer, 2) // Assume two progress bars for the test

	var wg sync.WaitGroup
	// Sample data for each bar - make sure they are different
	sampleData := [][]byte{
		{0xFF, 0xD8, 0xFF, 0x00}, // Data for first bar
		{0xAA, 0xBB, 0xCC, 0xDD, 0xAA, 0xBB, 0xCC, 0xDD, 0xAA, 0xBB, 0xCC, 0xDD, 0xAA, 0xBB, 0xCC, 0xDD}, // Data for second bar
	}
	for i := range writers {
		writers[i] = new(bytes.Buffer)

		dataReader := bytes.NewReader(sampleData[i]) // Use distinct data for each bar

		progressBarName := fmt.Sprintf("TestBar%d", i)
		progressBar := manager.AddProgressWriter(writers[i], progressBarName)

		dualStream := readwriter.DualStream{
			Reader: dataReader,
			Writer: progressBar,
		}

		objParam := &MockObjectParameter{
			ReadWriter: &dualStream,
		}
		wg.Add(1)
		go func(obj *MockObjectParameter, progressBarName string, dataSize int64) {
			defer wg.Done()
			manager.StartProgressBar(&wg, progressBarName, dataSize)

			buf := make([]byte, 1)
			for {
				n, err := obj.Read(buf)
				if n > 0 {
					if _, err := obj.Write(buf[:n]); err != nil {
						t.Errorf("error writing to buffer: %s", err)
						return
					}
				}
				if err != nil {
					if err != io.EOF {
						t.Errorf("error reading from buffer: %s", err)
					}
					break
				}
				time.Sleep(250 * time.Millisecond)
			}
		}(objParam, progressBarName, int64(len(sampleData[i])))
	}

	// Wait for all progress bars to complete
	wg.Wait()

	// Test validation for each writer
	for i, writer := range writers {
		if writer.String() != string(sampleData[i]) {
			t.Errorf("writer %d: written data does not match expected data. Got: %s, Want: %s", i, writer.String(), string(sampleData[i]))
		}
	}
}
