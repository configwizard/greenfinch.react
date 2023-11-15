package main

import (
	"bytes"
	"context"
	"fmt"
	"github.com/amlwwalker/greenfinch.react/pkg/notification"
	"log"
	"sync"
	"time"
)

func main() {
	statusCh := make(chan notification.ProgressMessage)
	writer := new(bytes.Buffer)

	// Simulating data (e.g., a JPEG header)
	data := []byte{0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46, 0x49, 0x46, 0x00}
	data = append(data, data...) // * 2
	data = append(data, data...) // * 4
	data = append(data, data...) // * 8
	data = append(data, data...) // * 16 -> 16 * 11 = 176
	dataReader := bytes.NewReader(data)

	ctx, cancelFunc := context.WithCancel(context.Background())
	wg := sync.WaitGroup{}
	wg.Add(2)

	// Create and start the writerProgressBar
	wp := notification.NewWriterProgressBar(ctx, statusCh, writer, "data transfer", 50*time.Millisecond)
	go func() {
		defer wg.Done()
		wp.Start(int64(len(data)), &wg)
	}()

	//Goroutine for reading progress updates
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
				log.Fatalf("error writing to buffer: %s", err)
			}
		}
		if err != nil {
			// if errors.Is(err, io.EOF) useful if end of file met
			cancelFunc()
			break
		}
		time.Sleep(100 * time.Millisecond)
	}

	wg.Wait()
}
