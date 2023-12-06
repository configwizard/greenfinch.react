package utils

import (
	"fmt"
	"log"
	"math/rand"
	"os"
	"path/filepath"
)

var minimalJPEG = []byte{
	0xFF, 0xD8, // Start of Image (SOI) marker
	0xFF, 0xE0, // APP0 marker
	0x00, 0x10, // APP0 segment length
	'J', 'F', 'I', 'F', 0x00, // JFIF header
	0x01, 0x01, // Major and minor version
	0x00,                   // Pixel density units
	0x00, 0x01, 0x00, 0x01, // X and Y pixel density
	0x00, 0x00, // Thumbnail width and height
	0xFF, 0xDB, // Quantization Table marker
	0x00, 0x43, // Segment length
	0x00, // Table identifier
	// A minimal quantization table follows here...
	// This should be filled with valid values, but is omitted for brevity
	0xFF, 0xC0, // Start of Frame (SOF) marker
	// Frame segment with minimal values follows here...
	// This should be filled with valid values, but is omitted for brevity
	0xFF, 0xC4, // Huffman Table marker
	// Huffman table data follows here...
	// This should be filled with valid values, but is omitted for brevity
	0xFF, 0xDA, // Start of Scan (SOS) marker
	// Scan data follows here...
	// This should be filled with valid values, but is omitted for brevity
	0xFF, 0xD9, // End of Image (EOI) marker
}

func MockFileCopy() (*os.File, os.FileInfo) {
	//the dualstream is designed to read from one location and write to the other
	dir := os.TempDir()
	file, err := os.Create(filepath.Join(dir, "stream.log")) // Use os.Create if you want to write to a new file
	if err != nil {
		log.Fatal("error could not open file")
	}
	// Simulate a JPEG header (this is just an example)
	if write, err := file.Write(minimalJPEG); err != nil {
		log.Fatal("could not write to file. Managed ", write, " bytes")
	}
	// Generate random data to simulate the rest of the JPEG content
	randomData := make([]byte, 4096) // Adjust size as needed
	rand.Read(randomData)            // Fill with random bytes
	if write, err := file.Write(randomData); err != nil {
		log.Fatal("could not write to file. Managed ", write, " bytes")
	}
	if write, err := file.Write([]byte("end-of-file")); err != nil {
		log.Fatal("could not write to file. Managed ", write, " bytes")
	}
	_, err = file.Seek(0, 0) // Seek to the beginning of the file
	if err != nil {
		log.Fatal("error seeking file", err)
	}

	fileStats, _ := file.Stat()
	fmt.Println("stats size = ", fileStats.Size())
	return file, fileStats
}
