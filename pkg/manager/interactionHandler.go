package manager

import (
	"context"
	"errors"
	"fmt"
	"github.com/amlwwalker/gaspump-api/pkg/filesystem"
	//"github.com/amlwwalker/gaspump-api/pkg/object"
	"github.com/machinebox/progress"
	cid "github.com/nspcc-dev/neofs-sdk-go/container/id"
	"github.com/wailsapp/wails/v2/pkg/runtime"
	"io"
	"os"
	"time"
)

//Upload will put an object in NeoFS. You can access publically available files at
//https://http.testnet.fs.neo.org/<containerID>/<objectID>
func (m *Manager) Upload(containerID string, attributes map[string]string) (string, error) {
	homeDir, err := os.UserHomeDir()
	filepath, err := runtime.OpenFileDialog(m.ctx, runtime.OpenDialogOptions{
		DefaultDirectory:           homeDir,
		Title:                      "Choose a file to upload",
		Filters:                    nil,
		ShowHiddenFiles:            false,
		CanCreateDirectories:       false,
		ResolvesAliases:            true,
		TreatPackagesAsDirectories: false,
	})
	if err != nil {
		return "", err
	}
	f, err := os.Open(filepath)
	defer f.Close()
	if err != nil {
		return "", err
	}
	fs, err := f.Stat()
	if err != nil {
		return "", err
	}
	r := progress.NewReader(f)
	go func() {
		ctx := context.Background()
		progressChan := progress.NewTicker(ctx, r, fs.Size(), 250*time.Millisecond)
		for p := range progressChan {
			fmt.Printf("\r%v remaining...", p.Remaining().Round(250*time.Millisecond))
		}
		fmt.Println("\rupload is completed")
	}()
	rr := (io.Reader)(r)

	objectID, err := m.UploadObject(containerID, filepath, attributes, &rr)
	return objectID, err
}
//Upload will put an object in NeoFS. You can access publically available files at
//https://http.testnet.fs.neo.org/<containerID>/<objectID>
func (m *Manager) Download(objectID, containerID string) (error) {
	homeDir, err := os.UserHomeDir()
	filepath, err := runtime.SaveFileDialog(m.ctx, runtime.SaveDialogOptions{
		DefaultDirectory:           homeDir,
		Title:                      "Choose where to save file to",
		Filters:                    nil,
		ShowHiddenFiles:            false,
		CanCreateDirectories:       true,
		TreatPackagesAsDirectories: false,
	})
	if err != nil {
		return err
	}
	if filepath == "" {
		return errors.New("no filepath detected")
	}
	metaData, err := m.GetObjectMetaData(objectID, containerID)
	if err != nil {
		return err
	}
	f, err := os.Create(filepath)
	defer f.Close()
	if err != nil {
		return err
	}
	w := progress.NewWriter(f)
	go func() {
		ctx := context.Background()
		progressChan := progress.NewTicker(ctx, w, int64(metaData.Object().PayloadSize()), 250*time.Millisecond)
		for p := range progressChan {
			fmt.Printf("\r%v remaining...", p.Remaining().Round(250*time.Millisecond))
		}
		fmt.Println("\rdownload is completed")
	}()
	WW := (io.Writer)(w)
	_, err = m.GetObject(objectID, containerID, &WW)
	return err
}
func (m Manager) RetrieveFileSystem() ([]filesystem.Element, error) {
	return filesystem.GenerateFileSystem(m.ctx, m.fsCli, m.key)
}
func (m Manager) RetrieveContainerFileSystem(containerID string) (filesystem.Element, error) {
	contID := cid.New()
	contID.Parse(containerID)
	fs := filesystem.GenerateFileSystemFromContainer(m.ctx, m.fsCli, m.key, contID)
	if m.DEBUG {
		DebugSaveJson("RetrieveContainerFileSystem.json", fs)
	}
	return fs, nil
}
