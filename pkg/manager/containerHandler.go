package manager

import (
	"encoding/json"
	"fmt"
	"log"
	"strconv"
	"time"

	client2 "github.com/configwizard/gaspump-api/pkg/client"
	container2 "github.com/configwizard/gaspump-api/pkg/container"
	"github.com/configwizard/gaspump-api/pkg/filesystem"
	"github.com/configwizard/gaspump-api/pkg/object"
	"github.com/nspcc-dev/neofs-sdk-go/acl"
	"github.com/nspcc-dev/neofs-sdk-go/container"
	cid "github.com/nspcc-dev/neofs-sdk-go/container/id"
	obj "github.com/nspcc-dev/neofs-sdk-go/object"
	"github.com/nspcc-dev/neofs-sdk-go/session"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

type Container struct {
	ID   string
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
		list, err := object.ListObjects(m.ctx, m.fsCli, v, nil, sessionToken)
		if err != nil {
			tmpContainer.Errors = append(tmpContainer.Errors, err)
			continue
		}
		//is this inefficient? the expensive part is the request, but we are throwing away the whole object
		size, _ := filesystem.GenerateObjectStruct(m.ctx, m.fsCli, nil, sessionToken, list, v)
		tmpContainer.Size = size
		containers = append(containers, tmpContainer)
	}
	if m.DEBUG {
		DebugSaveJson("ListContainers.json", containers)
	}
	return containers, nil
}
func (m *Manager) ListContainersAsync() error {
	var containers []filesystem.Element
	runtime.EventsEmit(m.ctx, "clearContainer", nil)
	sessionToken, err := client2.CreateSession(client2.DEFAULT_EXPIRATION, m.ctx, m.fsCli, m.key)
	if err != nil {
		return err
	}
	ids, err := m.listContainerIDs()
	if err != nil {
		return err
	}

	for _, v := range ids {
		go func(vID *cid.ID) {
			m.prepareAndAppendContainer(vID, sessionToken)
		}(v)
	}
	if m.DEBUG {
		DebugSaveJson("ListContainers.json", containers)
	}
	return nil
}

func (m *Manager) prepareAndAppendContainer(vID *cid.ID, sessionToken *session.Token) {

	tmpContainer := filesystem.PopulateContainerList(m.ctx, m.fsCli, vID)
	list, err := object.ListObjects(m.ctx, m.fsCli, vID, nil, sessionToken)
	if err != nil {
		tmpContainer.Errors = append(tmpContainer.Errors, err)
		return
	}
	//is this inefficient? the expensive part is the request, but we are throwing away the whole object
	size, _ := filesystem.GenerateObjectStruct(m.ctx, m.fsCli, nil, sessionToken, list, vID)
	tmpContainer.Size = size
	str, err := json.MarshalIndent(tmpContainer, "", "  ")
	if err != nil {
		fmt.Println(err)
	}
	fmt.Println(string(str))
	runtime.EventsEmit(m.ctx, "appendContainer", tmpContainer)
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
	fmt.Println("deleting container ", id)
	c := cid.New()
	err := c.Parse(id)
	if err != nil {
		tmp := ToastMessage{
			Title:       "Container Error",
			Type:        "error",
			Description: "Container does not exist " + err.Error(),
		}
		m.MakeToast(NewToastMessage(&tmp))
		return err
	}
	resp, err := container2.Delete(m.ctx, m.fsCli, c)
	fmt.Printf("resp %+v\r\n", resp.Status())
	if err != nil {
		tmp := ToastMessage{
			Title:       "Container Error",
			Type:        "error",
			Description: "Container could not be deleted " + err.Error(),
		}
		m.MakeToast(NewToastMessage(&tmp))
	} else {
		tmp := ToastMessage{
			Title:       "Container Deleted",
			Type:        "success",
			Description: "Container successfully deleted",
		}
		m.MakeToast(NewToastMessage(&tmp))
	}
	return err
}
func (m *Manager) CreateContainer(name string) error {
	log.Println("creating container with name", name)
	attr := container.NewAttribute()
	attr.SetKey(obj.AttributeFileName)
	attr.SetValue(name)

	timeAttr := container.NewAttribute()
	timeAttr.SetKey(container.AttributeTimestamp)
	timeAttr.SetValue(strconv.FormatInt(time.Now().Unix(), 10))
	var attributes []*container.Attribute
	attributes = append(attributes, []*container.Attribute{attr, timeAttr}...)
	// Poll containers ID until it will be available in the network.
	go func() {
		placementPolicy := `REP 2 IN X
        CBF 2
        SELECT 2 FROM * AS X
        `
		customACL := acl.BasicACL(0x0FFFCFFF)
		id, err := container2.Create(m.ctx, m.fsCli, m.key, placementPolicy, customACL, attributes)

		sessionToken, err := client2.CreateSession(client2.DEFAULT_EXPIRATION, m.ctx, m.fsCli, m.key)
		if err != nil {
			fmt.Println("could not create session token")
			return
		}
		if err != nil {
			tmp := ToastMessage{
				Title:       "Container Error",
				Type:        "error",
				Description: "Container '" + name + "' failed " + err.Error(),
			}
			m.MakeToast(NewToastMessage(&tmp))
			return
		}
		tmp := ToastMessage{
			Title:       "Container initialised",
			Type:        "info",
			Description: "Container '" + name + "' being created",
		}
		m.MakeToast(NewToastMessage(&tmp))
		for i := 0; i <= 30; i++ {
			if i == 30 {
				log.Printf("Timeout, containers %s was not persisted in side chain\n", id)
				tmp := ToastMessage{
					Title:       "Container Error",
					Type:        "error",
					Description: "Container '" + name + "' failed. Timeout",
				}
				m.MakeToast(NewToastMessage(&tmp))
				return
			}
			_, err := container2.Get(m.ctx, m.fsCli, id)
			if err == nil {
				tmp := ToastMessage{
					Title:       "Container Created",
					Type:        "success",
					Description: "Container '" + name + "' created",
				}

				m.prepareAndAppendContainer(id, sessionToken)
				//m.SendSignal("appendContainer", newContainer)
				//m.SendSignal("freshUpload", o)
				m.MakeToast(NewToastMessage(&tmp))
				return
			}
			time.Sleep(time.Second)
			//todo output the time/poll to a channel for the frontend
		}
	}()
	//convert to frontend friendly format
	return nil
}
