package mocker

import (
	"encoding/json"
	"fmt"
	"github.com/amlwwalker/greenfinch.react/pkg/manager"
	"github.com/configwizard/gaspump-api/pkg/filesystem"
	obj "github.com/nspcc-dev/neofs-sdk-go/object"
	"io/ioutil"
	"os"
	"path"
	"strings"
)

type Mocker struct {
	BasePath string
}
func (m *Mocker) ListContainers(filename string) ([]filesystem.Element, error) {
	//filename := "listPopulatedContainers.json"
	file, _ := ioutil.ReadFile(path.Join(m.BasePath, "dbg_data_structures", filename))
	var data []filesystem.Element
	err := json.Unmarshal([]byte(file), &data)
	return data, err
}

func (m *Mocker) ListContainerPopulatedObjects(filename string) ([]filesystem.Element, error) {
	//filename := "listContainerPopulatedObjects.json"
	file, _ := ioutil.ReadFile(path.Join(m.BasePath, "dbg_data_structures", filename))
	var data []filesystem.Element
	err := json.Unmarshal([]byte(file), &data)
	return data, err
}
func (m *Mocker) GetAccountInformation(filename string) (manager.Account, error) {
	//filename := "accountInformation.json"
	file, _ := ioutil.ReadFile(path.Join(m.BasePath, "dbg_data_structures", filename))
	var data manager.Account
	err := json.Unmarshal([]byte(file), &data)
	return data, err
}

func (m *Mocker) Search(search, filename string) ([]filesystem.Element, error) {
	wd, _ := os.Getwd()
	fmt.Println("wd: ", wd)
	//filename := "listContainerPopulatedObjects.json"
	file, err := ioutil.ReadFile(path.Join(m.BasePath, "dbg_data_structures", filename))
	fmt.Println("file search" ,string(file), err)
	var data []filesystem.Element
	err = json.Unmarshal([]byte(file), &data)
	if err != nil {
		return []filesystem.Element{}, err
	}
	fmt.Println("file search data" ,data)
	var results []filesystem.Element
	//now search the filesystem for a string comparison
	for _, v := range data {
		if fnAttr, ok := v.Attributes[obj.AttributeFileName]; ok {
			if strings.Contains(fnAttr, search) {
				results = append(results, v)
			}
		}
	}
	return results, nil
}
