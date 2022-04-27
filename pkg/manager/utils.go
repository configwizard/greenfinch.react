package manager

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"github.com/disintegration/imaging"
	"image"
	"image/jpeg"
	"image/png"
	"io"
	"io/ioutil"
	"path"
	"time"
)

func DebugSaveJson(filename string, data interface{}) error {
	file, _ := json.MarshalIndent(data, "", " ")
	filepath := path.Join("frontend/src/dbg_data_structures", filename)
	return ioutil.WriteFile(filepath, file, 0644)
}
func AwaitTime(seconds int, f func() bool) error {
	for i := 1; i <= seconds; i++ {
		if f() {
			return nil
		}

		time.Sleep(time.Second)
	}
	return errors.New("time ran out")
}

func thumbnail(ioReader *io.Reader) ([]byte, error) {
	var img image.Image
	//Read the content - need to check if this errors what happens to the reader
	rawBody, err := ioutil.ReadAll(*ioReader)
	if err != nil {
		return []byte{}, err
	}
	// Restore the io.ReadCloser to it's original state
	*ioReader = (io.Reader)(ioutil.NopCloser(bytes.NewBuffer(rawBody)))
	srcImage, format, err := image.Decode(bytes.NewReader(rawBody))
	if err != nil {
		return []byte{}, err
	}
	fmt.Println("format detected", format)
	bounds := srcImage.Bounds()
	point := bounds.Size()
	width := float64(point.Y)
	height := float64(point.X)
	var ratio float64
	fixedSize := 80.
	if width > height {
		fmt.Println("width > height")
		ratio = fixedSize/width
		fmt.Println("ratio", ratio)
		width = height * ratio
		height = fixedSize
		fmt.Println("new height", height)
	} else {
		fmt.Println("height > width", height, width)
		ratio = fixedSize/height
		fmt.Println("ratio", ratio)
		height = width * ratio
		width = fixedSize
		fmt.Println("new width", width)
	}
	img = imaging.Thumbnail(srcImage, int(width), int(height), imaging.CatmullRom)
	//now convert to bytes based on type of image
	buf := new(bytes.Buffer)
	if format == "jpeg" {
		err := jpeg.Encode(buf, img, nil)
		if err != nil {
			return []byte{}, err
		}
	} else if format == "png" {
		err = png.Encode(buf, img)
		if err != nil {
			return []byte{}, err
		}
	} else {
		return []byte{}, errors.New("unknown format")
	}
	return buf.Bytes(), nil
}
