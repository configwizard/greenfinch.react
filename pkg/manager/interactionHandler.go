package manager

import (
	"errors"
	"fmt"
	"path"

	"github.com/wailsapp/wails/v2/pkg/runtime"
	"os"
)

// Upload will put an object in NeoFS. You can access publically available files at
// https://http.testnet.fs.neo.org/<containerID>/<objectID>
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
		return m.ListContainerObjects(containerID, false, false)
	}
	if filepath == "" {
		m.MakeNotification(NotificationMessage{
			Title:       "Open file error",
			Type:        "error",
			Description: "No file selected",
			MarkRead:    false,
		})
		fmt.Println("no upload filepath. Bailing out")
		return m.ListContainerObjects(containerID, false, false)
	}

	// todo: FIX ME HERE THIS IS WHERE THE UPLOAD SHOULD HAPPEN
	oidID, err := m.InitialiseUploadProcedure(containerID, filepath, attributes)
	if err != nil {
		fmt.Println("error init procedure ", err)
	}
	fmt.Println("created object ", oidID, " in container ", containerID)
	return m.ListContainerObjects(containerID, false, false)
}

// Upload will put an object in NeoFS. You can access publically available files at
// https://http.testnet.fs.neo.org/<containerID>/<objectID>
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

	byt, err := m.Get(objectID, containerID, filepath, f)
	if err != nil {
		m.MakeNotification(NotificationMessage{
			Title:       "Error downloading",
			Type:        "error",
			Description: fmt.Sprintf("Downloading object at path %s error %s", path.Base(filepath), err.Error()),
			MarkRead:    false,
		})
		tmp := NewToastMessage(&UXMessage{
			Title:       "Error downloading",
			Type:        "error",
			Description: "Downloading " + path.Base(filepath) + " error: " + err.Error(),
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
