package manager

import (
	"fmt"
	container2 "github.com/amlwwalker/gaspump-api/pkg/container"
	"github.com/nspcc-dev/neofs-sdk-go/container"
	cid "github.com/nspcc-dev/neofs-sdk-go/container/id"
	"log"
	"time"
)

func (m *Manager) listContainers() ([]*cid.ID, error) {
	ids, err := container2.List(m.ctx, m.cli, m.key)
	log.Printf("%v\r\n", ids)
	return ids, err
}
func (m *Manager) ListContainers() ([]string, error) {
	var stringIds []string
	ids, err := m.listContainers()
	if err != nil {
		return stringIds, err
	}
	for _, v := range ids {
		stringIds = append(stringIds, v.String())
	}
	return stringIds, err
}
func (m *Manager) GetContainer(id string) (*container.Container, error) {
	c := cid.New()
	err := c.Parse(id)
	if err != nil {
		fmt.Println("error parsing id", err)
		return nil, err
	}
	cont, err := container2.Get(m.ctx, m.cli, c)
	fmt.Println(cont, err)
	return cont, err
}
func (m *Manager) DeleteContainer(id string) error {
	c := cid.New()
	err := c.Parse(id)
	if err != nil {
		fmt.Println("error parsing id", err)
		return err
	}
	_, err = container2.Delete(m.ctx, m.cli, c)
	return err
}
func (m *Manager) CreateContainer(name string) (string, error) {
	log.Println("creating cxontainer with name", name)
	attr := container.Attribute{}
	attr.SetKey("name")
	attr.SetValue(name)
	var attributes []*container.Attribute
	attributes = append(attributes, &attr)
	id, err := container2.Create(m.ctx, m.cli, m.key, attributes)
	if err != nil {
		return id.String(), err
	}
	// Poll containers ID until it will be available in the network.
	for i := 0; i <= 30; i++ {
		if i == 30 {
			log.Printf("Timeout, containers %s was not persisted in side chain\n", id)
			return id.String(), err
		}
		_, err := container2.Get(m.ctx, m.cli, id)
		if err == nil {
			return id.String(), err
		}
		time.Sleep(time.Second)
		//todo output the time/poll to a channel for the frontend
	}
	//convert to frontend friendly format
	return id.String(), err
}
