package manager

import (
	"fmt"
	client2 "github.com/amlwwalker/gaspump-api/pkg/client"
	container2 "github.com/amlwwalker/gaspump-api/pkg/container"
	"github.com/amlwwalker/gaspump-api/pkg/filesystem"
	"github.com/amlwwalker/gaspump-api/pkg/object"
	"github.com/nspcc-dev/neofs-sdk-go/container"
	cid "github.com/nspcc-dev/neofs-sdk-go/container/id"
	"log"
	"time"
)

type Container struct {
	ID string
	Size uint64
}
func (m *Manager) listContainerIDs() ([]*cid.ID, error) {
	ids, err := container2.List(m.ctx, m.fsCli, m.key)
	log.Printf("%v\r\n", ids)
	return ids, err
}
func (m *Manager) ListContainerIDs() ([]string, error) {
	var stringIds []string
	ids, err := m.listContainerIDs()
	if err != nil {
		return stringIds, err
	}
	for _, v := range ids {
		stringIds = append(stringIds, v.String())
	}
	if m.DEBUG {
		DebugSaveJson("ListContainerIDs.json", stringIds)
	}
	return stringIds, err
}
func (m *Manager) ListContainers() ([]filesystem.Element, error) {
	sessionToken, err := client2.CreateSession(client2.DEFAULT_EXPIRATION, m.ctx, m.fsCli, m.key)
	if err != nil {
		return []filesystem.Element{}, err
	}
	ids, err := m.listContainerIDs()
	if err != nil {
		return []filesystem.Element{}, err
	}
	var containers []filesystem.Element
	for _, v := range ids {
		tmpContainer := filesystem.PopulateContainerList(m.ctx, m.fsCli, v)
		list, err := object.ListObjects(m.ctx, m.fsCli, v, sessionToken)
		if err != nil {
			tmpContainer.Errors = append(tmpContainer.Errors, err)
			continue
		}
		//is this inefficient? the expensive part is the request, but we are throwing away the whole object
		size, _:= filesystem.GenerateObjectStruct(m.ctx, m.fsCli, sessionToken, list, v)
		tmpContainer.Size = size
		containers = append(containers, tmpContainer)
	}
	if m.DEBUG {
		DebugSaveJson("ListContainers.json", containers)
	}
	return containers, nil
}
func (m *Manager) GetContainer(id string) (*container.Container, error) {
	c := cid.New()
	err := c.Parse(id)
	if err != nil {
		fmt.Println("error parsing id", err)
		return nil, err
	}
	cont, err := container2.Get(m.ctx, m.fsCli, c)
	if m.DEBUG {
		DebugSaveJson("GetContainer.json", cont)
	}
	return cont, err
}
func (m *Manager) DeleteContainer(id string) error {
	c := cid.New()
	err := c.Parse(id)
	if err != nil {
		fmt.Println("error parsing id", err)
		return err
	}
	_, err = container2.Delete(m.ctx, m.fsCli, c)
	return err
}
func (m *Manager) CreateContainer(name string) (string, error) {
	log.Println("creating cxontainer with name", name)
	attr := container.Attribute{}
	attr.SetKey("name")
	attr.SetValue(name)
	var attributes []*container.Attribute
	attributes = append(attributes, &attr)
	id, err := container2.Create(m.ctx, m.fsCli, m.key, attributes)
	if err != nil {
		return id.String(), err
	}
	// Poll containers ID until it will be available in the network.
	for i := 0; i <= 30; i++ {
		if i == 30 {
			log.Printf("Timeout, containers %s was not persisted in side chain\n", id)
			return id.String(), err
		}
		_, err := container2.Get(m.ctx, m.fsCli, id)
		if err == nil {
			return id.String(), err
		}
		time.Sleep(time.Second)
		//todo output the time/poll to a channel for the frontend
	}
	//convert to frontend friendly format
	return id.String(), err
}
