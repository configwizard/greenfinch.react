package mocker

import (
	"encoding/json"
	"fmt"
	"github.com/amlwwalker/greenfinch.react/pkg/manager"
	obj "github.com/nspcc-dev/neofs-sdk-go/object"
	"io/ioutil"
	"os"
	"path"
	"strings"
)

type Mocker struct {
	BasePath string
}

func (m *Mocker) ListContainers(filename string) ([]manager.Element, error) {
	//filename := "listPopulatedContainers.json"
	file, _ := ioutil.ReadFile(path.Join(m.BasePath, "dbg_data_structures", filename))
	var data []manager.Element
	err := json.Unmarshal([]byte(file), &data)
	return data, err
}

func (m *Mocker) ListContainerPopulatedObjects(filename string) ([]manager.Element, error) {
	//filename := "listContainerPopulatedObjects.json"
	file, _ := ioutil.ReadFile(path.Join(m.BasePath, "dbg_data_structures", filename))
	var data []manager.Element
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

func (m *Mocker) Search(search, filename string) ([]manager.Element, error) {
	wd, _ := os.Getwd()
	fmt.Println("wd: ", wd)
	//filename := "listContainerPopulatedObjects.json"
	file, err := ioutil.ReadFile(path.Join(m.BasePath, "dbg_data_structures", filename))
	fmt.Println("file search", string(file), err)
	var data []manager.Element
	err = json.Unmarshal([]byte(file), &data)
	if err != nil {
		return []manager.Element{}, err
	}
	fmt.Println("file search data", data)
	var results []manager.Element
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
