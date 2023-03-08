package manager

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"github.com/amlwwalker/greenfinch.react/pkg/config"
	"github.com/atotto/clipboard"
	"github.com/disintegration/imaging"
	"github.com/gen2brain/go-fitz"
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



type Network string

const mainnet Network = "mainnet"
const testnet Network = "testnet"
type NetworkData struct{
	Name string
	ID           string
	Address      string
	SidechainRPC []string
	StorageNodes map[string]config.Peer
	RpcNodes     []string
}

var networks = map[Network]NetworkData{
	"mainnet": {
		Name: "Main Net",
		ID:      "mainnet",
		Address: "NNxVrKjLsRkWsmGgmuNXLcMswtxTGaNQLk",
		SidechainRPC: []string{
			"https://rpc1.morph.fs.neo.org:40341",
			"https://rpc2.morph.fs.neo.org:40341",
			"https://rpc3.morph.fs.neo.org:40341",
			"https://rpc4.morph.fs.neo.org:40341",
			"https://rpc5.morph.fs.neo.org:40341",
			"https://rpc6.morph.fs.neo.org:40341",
			"https://rpc7.morph.fs.neo.org:40341",
		},
		StorageNodes: map[string]config.Peer{
			"0": {
				Address: "grpcs://st1.storage.fs.neo.org:8082",
				Priority: 1,
				Weight: 1,
			},
			"1": {
				Address: "grpcs://st2.storage.fs.neo.org:8082",
				Priority: 2,
				Weight: 1,
			},
			"2": {
				Address: "grpcs://st3.storage.fs.neo.org:8082",
				Priority: 3,
				Weight: 1,
			},
			"3": {
				Address: "grpcs://st4.storage.fs.neo.org:8082",
				Priority: 4,
				Weight: 1,
			},
		},
		RpcNodes: []string{
			"https://rpc10.n3.nspcc.ru:10331",
		},
	},
	"testnet": {
		Name: "Test Net",
		ID:      "testnet",
		Address: "NZAUkYbJ1Cb2HrNmwZ1pg9xYHBhm2FgtKV",
		SidechainRPC: []string{
			"https://rpc1.morph.t5.fs.neo.org:51331",
			"https://rpc2.morph.t5.fs.neo.org:51331",
			"https://rpc3.morph.t5.fs.neo.org:51331",
			"https://rpc4.morph.t5.fs.neo.org:51331",
			"https://rpc5.morph.t5.fs.neo.org:51331",
			"https://rpc6.morph.t5.fs.neo.org:51331",
			"https://rpc7.morph.t5.fs.neo.org:51331",
		},
		StorageNodes: map[string]config.Peer{
			"0": {
				Address:  "grpcs://st1.t5.fs.neo.org:8082",
				Priority: 1,
				Weight:   1,
			},
			"1": {
				Address:  "grpcs://st2.t5.fs.neo.org:8082",
				Priority: 2,
				Weight:   1,
			},
			"2": {
				Address:  "grpcs://st3.t5.fs.neo.org:8082",
				Priority: 3,
				Weight:   1,
			},
			"3": {
				Address:  "grpcs://st4.t5.fs.neo.org:8082",
				Priority: 4,
				Weight:   1,
			},
		},
		RpcNodes: []string{
			"https://rpc.t5.n3.nspcc.ru:20331",
		},
	},
}
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
		//check if its a pdf
		doc, err := fitz.NewFromReader(ioReader)
		if err != nil {
			fmt.Println("could not open using fitz. Not pdf? ", err)
		} else {
			if srcImage, err = doc.Image(0); err != nil {
				return nil, err
			}
			format = "png" //fake it to save as a png
			fmt.Println("saving the pdf")
		}
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
