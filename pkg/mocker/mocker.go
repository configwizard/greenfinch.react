package mocker

import (
	"changeme/pkg/manager"
	"encoding/json"
	"github.com/amlwwalker/gaspump-api/pkg/filesystem"
	"io/ioutil"
	"path"
)

type Mocker struct {

}
func (m *Mocker) ListContainers() ([]filesystem.Element, error) {
	filename := "listPopulatedContainers.json"
	file, _ := ioutil.ReadFile(path.Join("dbg_data_structure", filename))
	var data []filesystem.Element
	err := json.Unmarshal([]byte(file), &data)
	return data, err
}

func (m *Mocker) ListContainerPopulatedObjects() ([]filesystem.Element, error) {
	filename := "listContainerPopulatedObjects.json"
	file, _ := ioutil.ReadFile(path.Join("dbg_data_structure", filename))
	var data []filesystem.Element
	err := json.Unmarshal([]byte(file), &data)
	return data, err
}
func (m *Mocker) GetAccountInformation() (manager.Account, error) {
	filename := "accountInformation.json"
	file, _ := ioutil.ReadFile(path.Join("dbg_data_structure", filename))
	var data manager.Account
	err := json.Unmarshal([]byte(file), &data)
	return data, err
}
