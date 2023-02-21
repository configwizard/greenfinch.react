package manager

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"github.com/atotto/clipboard"
	"github.com/disintegration/imaging"
	"github.com/nspcc-dev/neofs-sdk-go/container/acl"
	"github.com/nspcc-dev/neofs-sdk-go/eacl"
	"image"
	"image/jpeg"
	"image/png"
	"io"
	"io/ioutil"
	"os/exec"
	"path"
	"runtime"
	"time"
)

func (m Manager) OpenInDefaultBrowser(txt string) error {
	var err error
	switch runtime.GOOS {
	case "linux":
		err = exec.Command("xdg-open", txt).Start()
	case "windows":
		err = exec.Command("rundll32", "url.dll,FileProtocolHandler", txt).Start()
	case "darwin":
		err = exec.Command("open", txt).Start()
	default:
		err = fmt.Errorf("unsupported platform")
	}
	return err
}
func (m Manager) CopyToClipboard(txt string) error {
	err := clipboard.WriteAll(txt)
	return err
}
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

var invalidImageError = errors.New("not an image")
//todo - we should use this library to cover more formats of thumbnail https://github.com/bakape/thumbnailer/
func thumbnail(ioReader io.Reader) ([]byte, error) {
	var img image.Image
	//Read the content - need to check if this errors what happens to the reader
	rawBody, err := ioutil.ReadAll(ioReader)
	if err != nil {
		return []byte{}, err
	}
	// Restore the io.ReadCloser to it's original state
	ioReader = (io.Reader)(ioutil.NopCloser(bytes.NewBuffer(rawBody)))
	srcImage, format, err := image.Decode(bytes.NewReader(rawBody))
	fmt.Println("format detected", format, err)
	if err != nil {
		//if err == image.ErrFormat {
		//	fmt.Println("error format is ", err)
		//	return nil, image.ErrFormat
		//}
		//fmt.Println(" otherwise responding with ", err)
		return nil, err
	}
	if format != "jpeg" && format != "png" {
		return nil, image.ErrFormat
	}
	bounds := srcImage.Bounds()
	point := bounds.Size()
	width := float64(point.Y)
	height := float64(point.X)
	var ratio float64
	fixedSize := 180.
	if width > height {
		fmt.Println("width > height")
		ratio = fixedSize / width
		fmt.Println("ratio", ratio)
		width = height * ratio
		height = fixedSize
		fmt.Println("new height", height)
	} else {
		fmt.Println("height > width", height, width)
		ratio = fixedSize / height
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
		return nil, invalidImageError
	}
	return buf.Bytes(), nil
}

type Element struct {
	ID string `json:"id"`
	Type string `josn:"type"`
	Size uint64 `json:"size"`
	BasicAcl acl.Basic
	ExtendedAcl eacl.Table
	Attributes map[string]string `json:"attributes""`
	Errors []error `json:"errors",omitempty`
	ParentID string
	Children []Element `json:"children",omitempty`
	PendingDeleted bool
}
