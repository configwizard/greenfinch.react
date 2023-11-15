package readwriter

import (
	"bytes"
	"io"
	"testing"
	"time"
)

// DualStream definition from previous example
// ...

func TestDualStream(t *testing.T) {
	// Create a buffer to act as the data source
	sourceData := []byte("Hello, World!")
	source := bytes.NewBuffer(sourceData)

	// Create a buffer to act as the data destination
	destination := new(bytes.Buffer)

	// Create and set up DualStream
	dualStream := &DualStream{
		Reader: source, //here is where it knows the source of the data
		Writer: destination,
	}

	// Buffer to read data into
	buffer := make([]byte, len(sourceData))

	// Read from DualStream (which should read from source)
	n, err := dualStream.Read(buffer) //this is where to read the source data into
	if err != nil || n != len(sourceData) {
		t.Fatalf("Read failed: %v", err)
	}
	if !bytes.Equal(buffer, sourceData) {
		t.Errorf("Expected %s, got %s", string(sourceData), string(buffer))
	}

	// Write to DualStream (which should write to destination)
	_, err = dualStream.Write(buffer)
	if err != nil {
		t.Fatalf("Write failed: %v", err)
	}
	if !bytes.Equal(destination.Bytes(), sourceData) {
		t.Errorf("Expected %s, got %s", string(sourceData), destination.String())
	}
}

func TestDualStreamWithStreamingData(t *testing.T) {
	source := new(bytes.Buffer)
	destination := new(bytes.Buffer)
	doneWriting := make(chan struct{})

	dualStream := &DualStream{
		Reader: source,
		Writer: destination,
	}

	// Simulate streaming data by writing to source in a separate goroutine
	go func() {
		for i := 0; i < 5; i++ {
			source.WriteString("data chunk;")
			time.Sleep(100 * time.Millisecond)
		}
		close(doneWriting)
	}()

	buffer := make([]byte, 1024)
	var totalReadData bytes.Buffer

	// Continuously read from DualStream and write to destination
	for {
		n, err := dualStream.Read(buffer)
		if err != nil {
			if err == io.EOF {
				break // End of stream, check if writing is done
			}
			t.Fatalf("Read failed: %v", err)
		}
		if n > 0 {
			totalReadData.Write(buffer[:n])
			if _, err := dualStream.Write(buffer[:n]); err != nil {
				t.Fatalf("Write failed: %v", err)
			}
		}

		select {
		case <-doneWriting:
			if totalReadData.Len() == 0 || destination.Len() == 0 {
				t.Fatal("No data was read or written")
			}
			if totalReadData.String() != destination.String() {
				t.Fatalf("Data mismatch. Read: %s, Written: %s", totalReadData.String(), destination.String())
			}
			return // Test completed successfully
			//default:
			//	// Continue reading
		}
	}
}
