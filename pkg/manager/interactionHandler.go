package manager

import (
	"errors"
	"fmt"
	client2 "github.com/configwizard/gaspump-api/pkg/client"
	"github.com/nspcc-dev/neofs-sdk-go/session"
	"github.com/nspcc-dev/neofs-sdk-go/token"
	"path"

	"github.com/configwizard/gaspump-api/pkg/filesystem"
	"github.com/patrickmn/go-cache"

	//"github.com/configwizard/gaspump-api/pkg/object"
	"io"
	"os"
	"time"

	"github.com/machinebox/progress"
	cid "github.com/nspcc-dev/neofs-sdk-go/container/id"
	"github.com/wailsapp/wails/v2/pkg/runtime"
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
		progressChan := progress.NewTicker(m.ctx, r, fs.Size(), 250*time.Millisecond)
		for p := range progressChan {
			fmt.Printf("\r%v remaining...", p.Remaining().Round(250*time.Millisecond))
			tmp := NewProgressMessage(&ProgressMessage{
				Title:    "Uploading object",
				Progress: int(p.Percent()),
				Show:     true,
			})
			m.SetProgressPercentage(tmp)
		}
		end := NewProgressMessage(&ProgressMessage{
			Title: "Uploading object",
			Show:  false,
		})
		//auto close the progress bar
		m.SetProgressPercentage(end)
		tmp := NewToastMessage(&UXMessage{
			Title:       "Uploading complete",
			Type:        "success",
			Description: "Uploading " + path.Base(filepath) + " complete",
		})
		var o interface{}
		m.SendSignal("freshUpload", o)
		m.MakeToast(tmp)
		fmt.Println("\rupload is completed")
	}()
	rr := (io.Reader)(r)

	objectID, err := m.UploadObject(containerID, filepath, int(fs.Size()), attributes, &rr)
	if err != nil {
		end := NewProgressMessage(&ProgressMessage{
			Title: "Uploading object",
			Show:  false,
		})
		//auto close the progress bar
		m.SetProgressPercentage(end)
		tmp := NewToastMessage(&UXMessage{
			Title:       "Error uploading",
			Type:        "error",
			Description: "Uploading " + path.Base(filepath) + " failed: " + err.Error(),
		})
		m.MakeToast(tmp)

	} else {
		m.RetrieveFileSystem()
	}


	return objectID, err
}

//Upload will put an object in NeoFS. You can access publically available files at
//https://http.testnet.fs.neo.org/<containerID>/<objectID>
func (m *Manager) Download(filename, objectID, containerID string) error {
	homeDir, err := os.UserHomeDir()
	fmt.Println("downloading to ", filename)
	filepath, err := runtime.SaveFileDialog(m.ctx, runtime.SaveDialogOptions{
		DefaultDirectory:           homeDir,
		DefaultFilename:            filename,
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
		progressChan := progress.NewTicker(m.ctx, w, int64(metaData.PayloadSize()), 250*time.Millisecond)
		for p := range progressChan {
			fmt.Printf("\r%v remaining...", p.Remaining().Round(250*time.Millisecond))
			tmp := NewProgressMessage(&ProgressMessage{
				Title:    "Downloading object",
				Progress: int(p.Percent()),
				Show:     true,
			})
			m.SetProgressPercentage(tmp)
		}
		tmp := NewToastMessage(&UXMessage{
			Title:       "Download complete",
			Type:        "success",
			Description: "Downloading " + path.Base(filepath) + " complete",
		})
		m.MakeToast(tmp)
		//auto close the progress bar
		end := NewProgressMessage(&ProgressMessage{
			Title: "Downloading object",
			Show:  false,
		})
		m.SetProgressPercentage(end)
		fmt.Println("\rdownload is completed")
	}()
	WW := (io.Writer)(w)
	_, err = m.Get(objectID, containerID, int(metaData.PayloadSize()), &WW)
	if err != nil {
		tmp := NewToastMessage(&UXMessage{
			Title:       "Error downloading",
			Type:        "error",
			Description: "Downloading " + path.Base(filepath) + " failed: " + err.Error(),
		})
		m.MakeToast(tmp)
	}
	return err
}

//func (m Manager) RetrieveFileSystem() ([]filesystem.Element, error) {
//	tmpWallet, err := m.retrieveWallet()
//	if err != nil {
//		return []filesystem.Element{}, err
//	}
//	tmpKey := tmpWallet.Accounts[0].PrivateKey().PrivateKey
//	fsCli, err := m.Client()
//	if err != nil {
//		return []filesystem.Element{}, err
//	}
//	sessionToken, err := client2.CreateSession(m.ctx, fsCli, client2.DEFAULT_EXPIRATION, &tmpKey)
//	if err != nil {
//		return nil, err
//	}
//	el, err := filesystem.GenerateFileSystem(m.ctx, fsCli, &tmpKey, nil, sessionToken)
//	if err != nil {
//		tmp := NewToastMessage(&UXMessage{
//			Title:       "Error updating filesystem",
//			Type:        "error",
//			Description: "Updating latest filesystem failed: " + err.Error(),
//		})
//		m.MakeToast(tmp)
//	} else {
//		m.c.Set(CACHE_FILE_SYSTEM, el, cache.NoExpiration)
//	}
//	return el, err
//}
//func (m Manager) RetrieveContainerFileSystem(containerID string, token *token.BearerToken, session *session.Token) (filesystem.Element, error) {
//	//tmpWallet, err := m.retrieveWallet()
//	//if err != nil {
//	//	return filesystem.Element{}, err
//	//}
//	//tmpKey := tmpWallet.Accounts[0].PrivateKey().PrivateKey
//	fsCli, err := m.Client()
//	if err != nil {
//		return filesystem.Element{}, err
//	}
//	contID := cid.ID{}
//	contID.Parse(containerID)
//	fs := filesystem.GenerateFileSystemFromContainer(m.ctx, fsCli, contID, token, session)
//	if m.DEBUG {
//		DebugSaveJson("RetrieveContainerFileSystem.json", fs)
//	}
//	return fs, nil
//}
