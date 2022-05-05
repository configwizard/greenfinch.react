package manager

import (
	"bytes"
	"encoding/json"
	"fmt"
	"github.com/amlwwalker/greenfinch.react/pkg/cache"
	"github.com/nspcc-dev/neo-go/pkg/crypto/keys"
	"github.com/nspcc-dev/neofs-sdk-go/client"
	"log"
	"sort"
	"strconv"
	"sync"
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

// NewListReadOnlyContainerContents lists from cache
func (m *Manager) NewListReadOnlyContainerContents(since int64) ([]filesystem.Element, error) {
	//list the containers
	containers, err := m.ListContainers(false, false)
	if err != nil {
		return nil, err
	}
	resultCounter := 0
	var validContainers []filesystem.Element
	//now for each container, we want to check the basic ACL
	wg := sync.WaitGroup{}
	var mu       sync.Mutex
	for _, cnt := range containers {
		wg.Add(1)
		go func(v filesystem.Element) {
			defer wg.Done()
			fmt.Println("serving container", v.ID, v.BasicAcl, acl.EACLReadOnlyBasicRule)
			if v.BasicAcl != acl.EACLReadOnlyBasicRule {
				return
			}
			//now we need the metadata for the objects in this container.
			objects, err := m.ListContainerObjects(v.ID, false)
			if err != nil {
				fmt.Println("failed to process container ", v.ID)
				return
			}
			fmt.Println("number of objects in container ", v.ID, len(objects))
			var pendingContainer filesystem.Element
			pendingContainer.ID = cnt.ID
			pendingContainer.Type = cnt.Type
			pendingContainer.Attributes = cnt.Attributes
			size := uint64(0)
			for _, el := range objects {
				size += el.Size
				//filteredElements = append(filteredElements, el)
				unixString, ok := el.Attributes[obj.AttributeTimestamp];
				unixTime, err := strconv.ParseInt(unixString, 10, 64);
				fmt.Println(" processing ", el.ID, unixTime, since, unixTime > since)
				if ok && err == nil && unixTime > since {
					//its a good object
					//remove the unecessary attribute
					delete(el.Attributes, "Thumbnail");
					pendingContainer.Children = append(pendingContainer.Children, el)
				}
			}
			pendingContainer.Size = size
			resultCounter += len(pendingContainer.Children)
			if len(pendingContainer.Children) > 0 {
				mu.Lock()
				validContainers = append(validContainers, pendingContainer)
				mu.Unlock()
			}
		}(cnt)
	}
	wg.Wait()
	fmt.Println("resulting in ", resultCounter)
	return validContainers, nil
}
//func (m *Manager) ListReadOnlyContainersContents(since int64) ([]filesystem.Element, error) {
//	tmpWallet, err := m.retrieveWallet()
//	if err != nil {
//		return []filesystem.Element{}, err
//	}
//	tmpKey := tmpWallet.Accounts[0].PrivateKey().PrivateKey
//	c, err := m.Client()
//	if err != nil {
//		return []filesystem.Element{}, err
//	}
//	sessionToken, err := client2.CreateSession(m.ctx, c, client2.DEFAULT_EXPIRATION, &tmpKey)
//	if err != nil {
//		return []filesystem.Element{}, err
//	}
//	ids, err := m.listContainerIDs()
//	if err != nil {
//		return []filesystem.Element{}, err
//	}
//	var containers []filesystem.Element
//	resultCounter := 0
//	for _, v := range ids {
//		tmpContainer := filesystem.PopulateContainerList(m.ctx, c, *v)
//		fmt.Printf("container eacl for %s: %s ?= %s\r\n", v.String(), tmpContainer.BasicAcl, acl.EACLReadOnlyBasicRule)
//		if tmpContainer.BasicAcl != acl.BasicACL(0x0FFFCFFF) { //acl.EACLReadOnlyBasicRule
//			continue
//		}
//		var filters = obj.SearchFilters{}
//		filters.AddRootFilter()
//		list, err := object.QueryObjects(m.ctx, c, *v, filters, nil, sessionToken)
//		if err != nil {
//			tmpContainer.Errors = append(tmpContainer.Errors, err)
//			continue
//		}
//		//is this inefficient? the expensive part is the request, but we are throwing away the whole object
//		_, els := filesystem.GenerateObjectStruct(m.ctx, c, list, *v, nil, sessionToken)
//		var filteredElements []filesystem.Element
//		for _, el := range els {
//			//filteredElements = append(filteredElements, el)
//			unixString, ok := el.Attributes[obj.AttributeTimestamp];
//			unixTime, err := strconv.ParseInt(unixString, 10, 64);
//			if ok && err == nil && unixTime > since {
//				//its a good object
//				filteredElements = append(filteredElements, el)
//			}
//		}
//		resultCounter += len(filteredElements)
//		if len(filteredElements) > 0 {
//			tmpContainer.Children = filteredElements
//			containers = append(containers, tmpContainer)
//		}
//	}
//	if m.DEBUG {
//		DebugSaveJson("ListContainers.json", containers)
//	}
//	fmt.Println("for ", since, " there are ", resultCounter, " objects")
//	return containers, nil
//}
func (m *Manager) ForceSync() {
	fmt.Println("force syncing")
	if _, err := m.listContainersAsync(); err != nil {
		fmt.Println("force sync error ", err)
	}

}
//listContainersAsync should be purely used to refresh the database cache
//todo: this needs to clean out the database as its a refresh of everything
func (m *Manager) listContainersAsync() ([]filesystem.Element, error) {
	var containers []filesystem.Element
	//runtime.EventsEmit(m.ctx, "clearContainer", nil)
	tmpWallet, err := m.retrieveWallet()
	if err != nil {
		return []filesystem.Element{}, err
	}
	tmpKey := tmpWallet.Accounts[0].PrivateKey().PrivateKey
	c, err := m.Client()
	if err != nil {
		return []filesystem.Element{}, err
	}
	sessionToken, err := client2.CreateSessionForContainerList(m.ctx, c, client2.DEFAULT_EXPIRATION, &tmpKey)
	if err != nil {
		return []filesystem.Element{}, err
	}
	ids, err := m.listContainerIDs()
	if err != nil {
		return []filesystem.Element{}, err
	}
	fmt.Println("container ids,", len(ids), ids)
	wg := sync.WaitGroup{}
	for _, v := range ids {
		wg.Add(1)
		go func(vID cid.ID) {
			defer wg.Done()
			tmpContainer, err := m.prepareAndAppendContainer(vID, sessionToken)
			str, err := json.MarshalIndent(tmpContainer, "", "  ")
			if err != nil {
				fmt.Println(err)
			}
			fmt.Println("retrieved containers", tmpContainer)
			//store in database
			fmt.Println("storing container", tmpContainer.ID)
			if err = cache.StoreContainer(tmpWallet.Accounts[0].Address, tmpContainer.ID, str); err != nil {
				fmt.Println("MASSIVE ERROR could not store container in database", err)
			}
		}(*v)
	}
	wg.Wait()
	if m.DEBUG {
		DebugSaveJson("ListContainers.json", containers)
	}
	containerList, err := m.ListContainers(true, false)
	fmt.Println("async returning", containerList)
	return containerList, err
}

// prepareAndAppendContainer only used to update cache. Never as part of cache
func (m *Manager) prepareAndAppendContainer(vID cid.ID, sessionToken *session.Token) (filesystem.Element, error) {
	c, err := m.Client()
	if err != nil {
		log.Fatal("SERIOUS ERROR , could not retrieve client - in Go routine", err)
		return filesystem.Element{}, err
	}
	tmpContainer := filesystem.PopulateContainerList(m.ctx, c, vID) // todo - why does this not return an eror on a container?
	var filters = obj.SearchFilters{}
	filters.AddRootFilter()
	list, err := object.QueryObjects(m.ctx, c, vID, filters, nil, sessionToken)
	if err != nil {
		tmpContainer.Errors = append(tmpContainer.Errors, err)
		return filesystem.Element{}, err
	}
	//is this inefficient? the expensive part is the request, but we are throwing away the whole object
	size, _ := filesystem.GenerateObjectStruct(m.ctx, c, list, vID, nil, sessionToken)
	tmpContainer.Size = size
	return tmpContainer, nil
}


// ListContainers populates from cache
func (m *Manager) ListContainers(synchronised, shared bool) ([]filesystem.Element, error) {
	tmpWallet, err := m.retrieveWallet()
	if err != nil {
		return []filesystem.Element{}, err
	}
	var tmpContainers map[string][]byte
	if shared {
		tmpContainers, err = cache.RetrieveContainers(tmpWallet.Accounts[0].Address)
		if err != nil {
			return nil, err
		}
	} else {
		tmpContainers, err = cache.RetrieveSharedContainers(tmpWallet.Accounts[0].Address)
		if err != nil {
			return nil, err
		}
	}
	if len(tmpContainers) == 0 {
		//we need to check there aren't any on the network
		//todo notify frontend of database sync
		return m.listContainersAsync()
	}
	var unsortedContainers []filesystem.Element
	//now convert to the elements
	fmt.Println("listing ", len(tmpContainers))
	for k, v := range tmpContainers {
		tmp := filesystem.Element{}
		err := json.Unmarshal(v, &tmp)
		if err != nil {
			fmt.Println("warning - could not unmarshal container", k)
			continue
		}
		fmt.Println("checking", tmp.ID, tmp.PendingDeleted)
		if !tmp.PendingDeleted { //don't return deleted containers
			fmt.Println("adding ", tmp.ID)
			unsortedContainers = append(unsortedContainers, tmp)

		} else {
			fmt.Println("not adding ", tmp.ID)
		}
	}
	fmt.Println("ended up with", len(unsortedContainers))
	//sort keys
	keys := make([]string, 0, len(unsortedContainers))
	for _, v := range unsortedContainers {
		keys = append(keys, v.Attributes[obj.AttributeFileName])
	}
	sort.Strings(keys)
	//append to array in alphabetical order by key
	var containers []filesystem.Element
	for _, k := range keys {
		for _, v := range unsortedContainers {
			if v.Attributes[obj.AttributeFileName] == k {
				containers = append(containers, v)
				break
			}
		}
	}

	fmt.Println("finally", len(unsortedContainers))
	return containers, nil
}

// DeleteContainer must mark the container in the cache as deleted
// and delete it from neoFS
func (m *Manager) DeleteContainer(id string) ([]filesystem.Element, error) {
	fmt.Println("deleting container ", id)
	c := cid.ID{}
	err := c.Parse(id)
	if err != nil {
		tmp := UXMessage{
			Title:       "Container Error",
			Type:        "error",
			Description: "Container does not exist " + err.Error(),
		}
		m.MakeToast(NewToastMessage(&tmp))
		return []filesystem.Element{}, err
	}
	tmpWallet, err := m.retrieveWallet()
	if err != nil {
		return []filesystem.Element{}, err
	}
	tmpKey := tmpWallet.Accounts[0].PrivateKey().PrivateKey
	fsCli, err := m.Client()
	if err != nil {
		return []filesystem.Element{}, err
	}
	sessionToken, err := client2.CreateSessionWithContainerDeleteContext(m.ctx, fsCli, nil, c, client2.DEFAULT_EXPIRATION, &tmpKey)
	if err != nil {
		return []filesystem.Element{}, err
	}
	_, err = container2.Delete(m.ctx, fsCli, c, sessionToken)
	if err != nil {
		fmt.Println("error deleting container", err)
		tmp := UXMessage{
			Title:       "Container Error",
			Type:        "error",
			Description: "Container could not be deleted " + err.Error(),
		}
		m.MakeToast(NewToastMessage(&tmp))
	} else {
		//now mark deleted
		cacheContainer, err := cache.RetrieveContainer(tmpWallet.Accounts[0].Address, id)
		if err != nil {
			fmt.Println("error retrieving container??", err)
			return []filesystem.Element{}, err
		}
		if cacheContainer == nil {
			//there is no container
		}
		tmp := filesystem.Element{}
		if err := json.Unmarshal(cacheContainer, &tmp); err != nil {
			return []filesystem.Element{}, err
		}
		tmp.PendingDeleted = true
		del, err := json.Marshal(tmp)
		if err := json.Unmarshal(cacheContainer, &tmp); err != nil {
			return []filesystem.Element{}, err
		}
		if err := cache.PendContainerDeleted(tmpWallet.Accounts[0].Address, id, del); err != nil {
			return []filesystem.Element{}, err
		}
		t := UXMessage{
			Title:       "Container Deleted",
			Type:        "success",
			Description: "Container successfully deleted",
		}
		m.MakeToast(NewToastMessage(&t))
	}
	return m.ListContainers(false, false)
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
		tmp := UXMessage{
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
		res := bytes.Equal(expected, got)
		if res {
			tmp := UXMessage{
				Title:       "Sharing successful",
				Type:        "success",
				Description: "successfully shared container",
			}
			m.MakeToast(NewToastMessage(&tmp))
		}
		return res
	})
	if err != nil {
		tmp := UXMessage{
			Title:       "Container Error",
			Type:        "error",
			Description: "failed to restrict container" + err.Error(),
		}
		m.MakeToast(NewToastMessage(&tmp))
		return err
	}
	return nil
}

func (m *Manager) ListSharedContainers() ([]filesystem.Element, error) {
	return m.ListContainers(false, true)
}
func (m *Manager) AddSharedContainer(containerID string) error {
	//check if you can access this container
	tmpWallet, err := m.retrieveWallet()
	if err != nil {
		return err
	}
	tmpKey := tmpWallet.Accounts[0].PrivateKey().PrivateKey
	fsCli, err := m.Client()
	c := cid.ID{}
	err = c.Parse(containerID)
	if err != nil {
		return err
	}
	sessionToken, err := client2.CreateSessionForContainerList(m.ctx, fsCli, client2.DEFAULT_EXPIRATION, &tmpKey)
	if err != nil {
		return err
	}
	cont, err := m.prepareAndAppendContainer(c, sessionToken)
	if err != nil {
		return err
	}
	fmt.Printf("shared container %+v\r\n", cont)
	marshal, err := json.Marshal(cont)
	if err != nil {
		return err
	}
	if err := cache.StoreContainer(tmpWallet.Accounts[0].Address, containerID, marshal); err != nil {
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
			customAcl = acl.PrivateBasicRule //0x1C8C8CCC -> 478973132
		case "PUBLICREAD":
			customAcl = acl.EACLReadOnlyBasicRule //0x0FBF8CFF -> 264211711
		case "PUBLICBASIC":
			customAcl = acl.EACLPublicBasicRule //0x0FBFBFFF -> 264224767
		default:
			customAcl = acl.BasicACL(0x0FFFCFFF) //0x0FFFCFFF -> 268423167
		}
		id, err := container2.Create(m.ctx, fsCli, &tmpKey, placementPolicy, customAcl, attributes)
		//sessionToken, err := client2.CreateSession(m.ctx, fsCli, client2.DEFAULT_EXPIRATION, &tmpKey)
		//if err != nil {
		//	fmt.Println("could not create session token")
		//	return
		//}
		if err != nil {
			tmp := UXMessage{
				Title:       "Container Error",
				Type:        "error",
				Description: "Container '" + name + "' failed " + err.Error(),
			}
			m.MakeToast(NewToastMessage(&tmp))
			return
		}
		tmp := UXMessage{
			Title:       "Container " + name + " initialised",
			Type:        "info",
			Description: "Please wait up to 1 minute",
		}
		m.MakeToast(NewToastMessage(&tmp))
		for i := 0; i <= 180; i++ {
			if i == 60 {
				log.Printf("Timeout, containers %s was not persisted in side chain\n", id)
				tmp := UXMessage{
					Title:       "Container Error",
					Type:        "error",
					Description: "Container '" + name + "' failed. Timeout",
				}
				m.MakeToast(NewToastMessage(&tmp))
				return
			}
			_, err := container2.Get(m.ctx, fsCli, *id)
			if err == nil {
				tmp := UXMessage{
					Title:       "Container Created",
					Type:        "success",
					Description: "Container '" + name + "' created",
				}
				el := filesystem.Element{
					ID:             id.String(),
					Type:           "container",
					Size:           0,
					BasicAcl: customAcl,
					Attributes: make(map[string]string),
				}
				for _, a := range attributes {
					el.Attributes[a.Key()] = a.Value()
				}
				marshal, err := json.Marshal(el)
				if err != nil {
					return
				}
				err = cache.StoreContainer(tmpWallet.Accounts[0].Address, id.String(), marshal)
				if err != nil {
					return 
				}
				//update the database cache
				//m.prepareAndAppendContainer(*id, sessionToken)
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
