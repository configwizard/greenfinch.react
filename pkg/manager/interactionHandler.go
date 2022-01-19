package manager

import (
	"fmt"
	"github.com/amlwwalker/gaspump-api/pkg/filesystem"
	cid "github.com/nspcc-dev/neofs-sdk-go/container/id"
	"github.com/wailsapp/wails/v2/pkg/runtime"
	"os"
)

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
	//var objectAttributes map[string]string
	//objectAttributes = make(map[string]string)
	//objectAttributes["name"] = "james bond"
	////elaborate due to passing pointer so we still own the reader this end
	//
	objectID, err := m.UploadObject(containerID, filepath, attributes)
	fmt.Printf("containerID %s, objectID %s\r\n", containerID, objectID)
	fmt.Printf("https://http.testnet.fs.neo.org/%s/%s\r\n", containerID, objectID)
	return objectID, err
}

func (m Manager) RetrieveFileSystem() ([]filesystem.Element, error) {
	return filesystem.GenerateFileSystem(m.ctx, m.cli, m.key)
}
func (m Manager) RetrieveContainerFileSystem(containerID string) (filesystem.Element, error) {
	contID := cid.New()
	contID.Parse(containerID)
	fs := filesystem.GenerateFileSystemFromContainer(m.ctx, m.cli, m.key, contID)
	fmt.Printf("fs %+v\r\n", fs)
	return fs, nil
}
