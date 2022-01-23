package manager

import (
	"github.com/amlwwalker/gaspump-api/pkg/filesystem"
	cid "github.com/nspcc-dev/neofs-sdk-go/container/id"
	"github.com/wailsapp/wails/v2/pkg/runtime"
	"os"
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
	objectID, err := m.UploadObject(containerID, filepath, attributes)
	return objectID, err
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
