package manager

import (
	"bytes"
	"encoding/json"
	"fmt"
	"github.com/nspcc-dev/neo-go/pkg/crypto/keys"
	"github.com/nspcc-dev/neofs-sdk-go/client"
	"log"
	"strconv"
	"time"

	client2 "github.com/configwizard/gaspump-api/pkg/client"
	container2 "github.com/configwizard/gaspump-api/pkg/container"
	"github.com/configwizard/gaspump-api/pkg/eacl"
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
	tmpWallet, err := m.retrieveWallet()
	if err != nil {
		return []*cid.ID{}, err
	}
	tmpKey := tmpWallet.Accounts[0].PrivateKey().PrivateKey
	c, err := m.Client()
	if err != nil {
		return []*cid.ID{}, err
	}
	ids, err := container2.List(m.ctx, c, &tmpKey)
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

func (m *Manager) ListReadOnlyContainersContents(since int64) ([]filesystem.Element, error) {
	tmpWallet, err := m.retrieveWallet()
	if err != nil {
		return []filesystem.Element{}, err
	}
	tmpKey := tmpWallet.Accounts[0].PrivateKey().PrivateKey
	c, err := m.Client()
	if err != nil {
		return []filesystem.Element{}, err
	}
	sessionToken, err := client2.CreateSession(m.ctx, c, client2.DEFAULT_EXPIRATION, &tmpKey)
	if err != nil {
		return []filesystem.Element{}, err
	}
	ids, err := m.listContainerIDs()
	if err != nil {
		return []filesystem.Element{}, err
	}
	var containers []filesystem.Element
	resultCounter := 0
	for _, v := range ids {
		tmpContainer := filesystem.PopulateContainerList(m.ctx, c, *v)
		fmt.Printf("container eacl for %s: %s ?= %s\r\n", v.String(), tmpContainer.BasicAcl, acl.EACLReadOnlyBasicRule)
		if tmpContainer.BasicAcl != acl.BasicACL(0x0FFFCFFF) { //acl.EACLReadOnlyBasicRule
			continue
		}
		var filters = obj.SearchFilters{}
		filters.AddRootFilter()
		list, err := object.QueryObjects(m.ctx, c, *v, filters, nil, sessionToken)
		if err != nil {
			tmpContainer.Errors = append(tmpContainer.Errors, err)
			continue
		}
		//is this inefficient? the expensive part is the request, but we are throwing away the whole object
		_, els := filesystem.GenerateObjectStruct(m.ctx, c, list, *v, nil, sessionToken)
		var filteredElements []filesystem.Element
		for _, el := range els {
			//filteredElements = append(filteredElements, el)
			unixString, ok := el.Attributes[obj.AttributeTimestamp];
			unixTime, err := strconv.ParseInt(unixString, 10, 64);
			if ok && err == nil && unixTime > since {
				//its a good object
				filteredElements = append(filteredElements, el)
			}
		}
		resultCounter += len(filteredElements)
		if len(filteredElements) > 0 {
			tmpContainer.Children = filteredElements
			containers = append(containers, tmpContainer)
		}
	}
	if m.DEBUG {
		DebugSaveJson("ListContainers.json", containers)
	}
	fmt.Println("for ", since, " there are ", resultCounter, " objects")
	return containers, nil
}
func (m *Manager) ListContainersAsync() error {
	var containers []filesystem.Element
	runtime.EventsEmit(m.ctx, "clearContainer", nil)
	tmpWallet, err := m.retrieveWallet()
	if err != nil {
		return err
	}
	tmpKey := tmpWallet.Accounts[0].PrivateKey().PrivateKey
	c, err := m.Client()
	if err != nil {
		return err
	}
	sessionToken, err := client2.CreateSession(m.ctx, c, client2.DEFAULT_EXPIRATION, &tmpKey)
	if err != nil {
		return err
	}
	ids, err := m.listContainerIDs()
	if err != nil {
		return err
	}

	for _, v := range ids {
		go func(vID cid.ID) {
			m.prepareAndAppendContainer(vID, sessionToken)
		}(*v)
	}
	if m.DEBUG {
		DebugSaveJson("ListContainers.json", containers)
	}
	return nil
}

func (m *Manager) prepareAndAppendContainer(vID cid.ID, sessionToken *session.Token) {
	c, err := m.Client()
	if err != nil {
		log.Fatal("SERIOUS ERROR , could not retrieve client - in Go routine", err)
		return
	}
	tmpContainer := filesystem.PopulateContainerList(m.ctx, c, vID)
	var filters = obj.SearchFilters{}
	filters.AddRootFilter()
	list, err := object.QueryObjects(m.ctx, c, vID, filters, nil, sessionToken)
	if err != nil {
		tmpContainer.Errors = append(tmpContainer.Errors, err)
		return
	}
	//is this inefficient? the expensive part is the request, but we are throwing away the whole object
	size, _ := filesystem.GenerateObjectStruct(m.ctx, c, list, vID, nil, sessionToken)
	tmpContainer.Size = size
	str, err := json.MarshalIndent(tmpContainer, "", "  ")
	if err != nil {
		fmt.Println(err)
	}
	fmt.Println(string(str))
	runtime.EventsEmit(m.ctx, "appendContainer", tmpContainer)
}
func (m *Manager) GetContainer(id string) (*container.Container, error) {
	c := cid.ID{}
	err := c.Parse(id)
	if err != nil {
		fmt.Println("error parsing id", err)
		return nil, err
	}
	fcCli, err := m.Client()
	if err != nil {
		return nil, err
	}
	cont, err := container2.Get(m.ctx, fcCli, c)
	if m.DEBUG {
		DebugSaveJson("GetContainer.json", cont)
	}
	return cont, err
}
func (m *Manager) DeleteContainer(id string) error {
	fmt.Println("deleting container ", id)
	c := cid.ID{}
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
	tmpWallet, err := m.retrieveWallet()
	if err != nil {
		return err
	}
	tmpKey := tmpWallet.Accounts[0].PrivateKey().PrivateKey
	fsCli, err := m.Client()
	if err != nil {
		return err
	}
	sessionToken, err := client2.CreateSession(m.ctx, fsCli, client2.DEFAULT_EXPIRATION, &tmpKey)
	if err != nil {
		return err
	}
	resp, err := container2.Delete(m.ctx, fsCli, c, sessionToken)
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

//ultimately, you want to do this with containers that can be restricted (i.e eaclpublic)

func (m *Manager) RestrictContainer(id string, publicKey string) error {
	//block everything for other keys
	var pKey *keys.PublicKey
	if publicKey != "" {
		var err error
		pKey, err = keys.NewPublicKeyFromString(publicKey)
		if err != nil {
			return err
		}
	}
	c := cid.ID{}
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
	table := eacl.PutAllowDenyOthersEACL(c, pKey)
	var prmContainerSetEACL client.PrmContainerSetEACL
	prmContainerSetEACL.SetTable(table)
	fsCli, err := m.Client()
	if err != nil {
		return err
	}
	_, err = fsCli.ContainerSetEACL(m.ctx, prmContainerSetEACL)
	if err != nil {
		log.Fatal("eacl was not set")
	}

	err = AwaitTime(30, func() bool {
		var prmContainerEACL client.PrmContainerEACL
		prmContainerEACL.SetContainer(c)
		r, err := fsCli.ContainerEACL(m.ctx, prmContainerEACL)
		if err != nil {
			return false
		}
		expected, _ := table.Marshal()
		got, _ := r.Table().Marshal()
		return bytes.Equal(expected, got)
	})
	if err != nil {
		tmp := ToastMessage{
			Title:       "Container Error",
			Type:        "error",
			Description: "failed to restrict container" + err.Error(),
		}
		m.MakeToast(NewToastMessage(&tmp))
		return err
	}
	return nil
}
func (m *Manager) CreateContainer(name string, permission string, block bool) error {
	tmpWallet, err := m.retrieveWallet()
	if err != nil {
		return err
	}
	tmpKey := tmpWallet.Accounts[0].PrivateKey().PrivateKey
	fsCli, err := m.Client()
	if err != nil {
		return err
	}
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
		var customAcl acl.BasicACL //0x0FFFCFFF
		switch permission {
		case "PRIVATE":
			customAcl = acl.PrivateBasicRule
		case "PUBLICREAD":
			customAcl = acl.EACLReadOnlyBasicRule
		case "PUBLICBASIC":
			customAcl = acl.EACLPublicBasicRule
		default:
			customAcl = acl.EACLReadOnlyBasicRule
		}
		id, err := container2.Create(m.ctx, fsCli, &tmpKey, placementPolicy, customAcl, attributes)
		sessionToken, err := client2.CreateSession(m.ctx, fsCli, client2.DEFAULT_EXPIRATION, &tmpKey)
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
			Title:       "Container " + name + " initialised",
			Type:        "info",
			Description: "Please wait up to 1 minute",
		}
		m.MakeToast(NewToastMessage(&tmp))
		for i := 0; i <= 60; i++ {
			if i == 60 {
				log.Printf("Timeout, containers %s was not persisted in side chain\n", id)
				tmp := ToastMessage{
					Title:       "Container Error",
					Type:        "error",
					Description: "Container '" + name + "' failed. Timeout",
				}
				m.MakeToast(NewToastMessage(&tmp))
				return
			}
			_, err := container2.Get(m.ctx, fsCli, *id)
			if err == nil {
				tmp := ToastMessage{
					Title:       "Container Created",
					Type:        "success",
					Description: "Container '" + name + "' created",
				}

				m.prepareAndAppendContainer(*id, sessionToken)
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
