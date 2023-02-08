package manager

import (
	"errors"
	"fmt"
	"path"

	"github.com/wailsapp/wails/v2/pkg/runtime"
	"os"
)

//Upload will put an object in NeoFS. You can access publically available files at
//https://http.testnet.fs.neo.org/<containerID>/<objectID>
func (m *Manager) Upload(containerID string, attributes map[string]string) ([]Element, error) {
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
		m.MakeNotification(NotificationMessage{
			Title:       "Open file error",
			Type:        "error",
			Description: fmt.Sprintf("Opening a local file error %s", err.Error()),
			MarkRead:    false,
		})
		return nil, err
	}
	if filepath == "" {
		m.MakeNotification(NotificationMessage{
			Title:       "Open file error",
			Type:        "error",
			Description: "No file selected",
			MarkRead:    false,
		})
		return nil, err
	}

	objects, err := m.UploadObject(containerID, filepath, attributes)
	if err != nil {
		end := NewProgressMessage(&ProgressMessage{
			Title: "Uploading object",
			Show:  false,
		})
		m.MakeNotification(NotificationMessage{
			Title:       "Error uploading object",
			Type:        "error",
			Description: "Uploading failed due to " + err.Error(),
			MarkRead:    false,
		})
		//auto close the progress bar
		m.SetProgressPercentage(end)
		tmp := NewToastMessage(&UXMessage{
			Title:       "Error uploading",
			Type:        "error",
			Description: "Uploading " + path.Base(filepath) + " failed: " + err.Error(),
		})
		m.MakeToast(tmp)
	}
	return objects, nil
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
		m.MakeNotification(NotificationMessage{
			Title:       "Save file error",
			Type:        "error",
			Description: fmt.Sprintf("Saving to a local file error %s", err.Error()),
			MarkRead:    false,
		})
		return err
	}
	if filepath == "" {
		m.MakeNotification(NotificationMessage{
			Title:       "Open file error",
			Type:        "error",
			Description: "No file selected",
			MarkRead:    false,
		})
		return errors.New("no filepath detected")
	}
	//metaData, err := m.GetObjectMetaData(objectID, containerID)
	//if err != nil {
	//	m.MakeNotification(NotificationMessage{
	//		Title:       "Retrieving object metadata error",
	//		Type:        "error",
	//		Description: "Retieving object metadata failing " + err.Error(),
	//		MarkRead:    false,
	//	})
	//	return err
	//}
	f, err := os.Create(filepath)
	defer f.Close()
	if err != nil {
		m.MakeNotification(NotificationMessage{
			Title:       "Creating file object error",
			Type:        "error",
			Description: "Creating file object failing " + err.Error(),
			MarkRead:    false,
		})
		return err
	}

	//w := progress.NewWriter(f)
	//go func() {
	//	progressChan := progress.NewTicker(m.ctx, w, int64(metaData.PayloadSize()), 250*time.Millisecond)
	//	for p := range progressChan {
	//		fmt.Printf("\r%v remaining...", p.Remaining().Round(250*time.Millisecond))
	//		tmp := NewProgressMessage(&ProgressMessage{
	//			Title:    "Downloading object",
	//			Progress: int(p.Percent()),
	//			Show:     true,
	//		})
	//		m.SetProgressPercentage(tmp)
	//	}
	//	tmp := NewToastMessage(&UXMessage{
	//		Title:       "Download complete",
	//		Type:        "success",
	//		Description: "Downloading " + path.Base(filepath) + " complete",
	//	})
	//	m.MakeToast(tmp)
	//	//auto close the progress bar
	//	end := NewProgressMessage(&ProgressMessage{
	//		Title: "Downloading object",
	//		Show:  false,
	//	})
	//	m.SetProgressPercentage(end)
	//	fmt.Println("\rdownload is completed")
	//}()
	byt, err := m.Get(objectID, containerID, filepath, f)
	if err != nil {
		m.MakeNotification(NotificationMessage{
			Title:       "Retrieving object error",
			Type:        "error",
			Description: fmt.Sprintf("Retrieving object at path %s failing %s", path.Base(filepath), err.Error()),
			MarkRead:    false,
		})
		tmp := NewToastMessage(&UXMessage{
			Title:       "Error downloading",
			Type:        "error",
			Description: "Downloading file failed",
		})
		m.MakeToast(tmp)
	}
	fmt.Println("byt ", string(byt))
	return err
}

//func (m Manager) RetrieveFileSystem() ([]Element, error) {
//	tmpWallet, err := m.retrieveWallet()
//	if err != nil {
//		return []Element{}, err
//	}
//	tmpKey := tmpWallet.Accounts[0].PrivateKey().PrivateKey
//	fsCli, err := m.Client()
//	if err != nil {
//		return []Element{}, err
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
//func (m Manager) RetrieveContainerFileSystem(containerID string, token *token.BearerToken, session *session.Token) (Element, error) {
//	//tmpWallet, err := m.retrieveWallet()
//	//if err != nil {
//	//	return Element{}, err
//	//}
//	//tmpKey := tmpWallet.Accounts[0].PrivateKey().PrivateKey
//	fsCli, err := m.Client()
//	if err != nil {
//		return Element{}, err
//	}
//	contID := cid.ID{}
//	contID.Parse(containerID)
//	fs := filesystem.GenerateFileSystemFromContainer(m.ctx, fsCli, contID, token, session)
//	if m.DEBUG {
//		DebugSaveJson("RetrieveContainerFileSystem.json", fs)
//	}
//	return fs, nil
//}
