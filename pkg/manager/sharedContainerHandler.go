package manager

import (
	"context"
	"encoding/json"
	"fmt"
	"github.com/amlwwalker/greenfinch.react/pkg/cache"
	client2 "github.com/configwizard/gaspump-api/pkg/client"
	"github.com/configwizard/gaspump-api/pkg/filesystem"
	"github.com/configwizard/gaspump-api/pkg/object"
	"github.com/nspcc-dev/neofs-sdk-go/client"
	cid "github.com/nspcc-dev/neofs-sdk-go/container/id"
	obj "github.com/nspcc-dev/neofs-sdk-go/object"
	oid "github.com/nspcc-dev/neofs-sdk-go/object/id"
	"path/filepath"
	"sort"
	"sync"
)

func getHelperTokenExpiry(ctx context.Context, cli *client.Client) uint64 {
	ni, err := cli.NetworkInfo(ctx, client.PrmNetworkInfo{})
	if err != nil {
		return 0
	}

	expire := ni.Info().CurrentEpoch() + 10 // valid for 10 epochs (~ 10 hours)
	return expire
}


func (m *Manager) ListSharedContainers() ([]filesystem.Element, error) {
	tmpWallet, err := m.retrieveWallet()
	if err != nil {
		return []filesystem.Element{}, err
	}
	fmt.Println("finding shared for ",tmpWallet.Accounts[0].Address)
	tmpContainers, err := cache.RetrieveSharedContainers(tmpWallet.Accounts[0].Address)
	if err != nil {
		return nil, err
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
	return unsortedContainers, nil
}

//ListSharedContainerObjectsAsync
//ListSharedContainerObjectsAsync update object in database with metadata
func (m *Manager) listSharedContainerObjectsAsync(containerID string) ([]filesystem.Element, error) {
	cntID := cid.ID{}
	cntID.Parse(containerID)
	tmpWallet, err := m.retrieveWallet()
	if err != nil {
		return []filesystem.Element{}, err
	}
	tmpKey := tmpWallet.Accounts[0].PrivateKey().PrivateKey
	c, err := m.Client()
	if err != nil {
		return []filesystem.Element{}, err
	}
	//CreateSessionForContainerList
	sessionToken, err := client2.CreateSessionForContainerList(m.ctx, c, getHelperTokenExpiry(m.ctx, c), &tmpKey)
	if err != nil {
		return []filesystem.Element{}, err
	}

	var filters = obj.SearchFilters{}
	filters.AddRootFilter()
	ids, err := object.QueryObjects(m.ctx, c, cntID, filters, nil, sessionToken)
	fmt.Println("ids for container,", containerID, " ids ", len(ids))
	wg := sync.WaitGroup{}
	for _, v := range ids {
		fmt.Println("looping", v.String())
		wg.Add(1)
		go func(vID oid.ID) {
			defer wg.Done()
			fmt.Println("processing object with id", vID.String())
			tmp := filesystem.Element{
				Type: "object",
				ID:         vID.String(),
				Attributes: make(map[string]string),
				ParentID: containerID,
			}
			head, err := object.GetObjectMetaData(m.ctx, c, vID, cntID, nil, sessionToken)
			if err != nil {
				tmp.Errors = append(tmp.Errors, err)
			}
			for _, a := range head.Attributes() {
				tmp.Attributes[a.Key()] = a.Value()
			}
			if filename, ok := tmp.Attributes[obj.AttributeFileName]; ok {
				tmp.Attributes["X_EXT"] = filepath.Ext(filename)[1:]
			} else {
				tmp.Attributes["X_EXT"] = ""
			}
			tmp.Size = head.PayloadSize()
			str, err := json.MarshalIndent(tmp, "", "  ")
			if err != nil {
				fmt.Println(err)
			}
			//store in database
			if err = cache.StoreSharedObject(tmpWallet.Accounts[0].Address, vID.String(), str); err != nil {
				fmt.Println("MASSIVE ERROR could not store container in database", err)
			}
		}(v)
	}
	fmt.Println("length of ids", len(ids))
	if len(ids) > 0 {
		wg.Wait()
	}
	objectList, err := m.ListSharedContainerObjects(containerID, true)
	fmt.Println("async returning", objectList)
	return objectList, err
}
//ListSharedContainerObjects ets from cache
func (m *Manager) ListSharedContainerObjects(containerID string, synchronised bool) ([]filesystem.Element, error) {
	tmpWallet, err := m.retrieveWallet()
	if err != nil {
		return []filesystem.Element{}, err
	}
	tmpObjects, err := cache.RetrieveSharedObjects(tmpWallet.Accounts[0].Address)
	if err != nil {
		return nil, err
	}
	if len(tmpObjects) == 0 && !synchronised {
		//we need to check there aren't any on the network
		//todo notify frontend of database sync
		return m.listSharedContainerObjectsAsync(containerID)
	}
	fmt.Println("len unsorted", len(tmpObjects))
	//filter for this container
	var unsortedObjects []filesystem.Element //make(map[string]filesystem.Element)
	fmt.Println("processinb ojects for", containerID)
	for k, v := range tmpObjects {
		tmp := filesystem.Element{}
		err := json.Unmarshal(v, &tmp)
		if err != nil {
			fmt.Println("warning - could not unmarshal container", k)
			continue
		}
		//fmt.Println("object ", tmp.ID, tmp.PendingDeleted, tmp.ParentID)
		if filename, ok := tmp.Attributes[obj.AttributeFileName]; ok {
			tmp.Attributes["X_EXT"] = filepath.Ext(filename)[1:]
		} else {
			tmp.Attributes["X_EXT"] = ""
		}
		//ok this needs to be an array to add the correct ones, not a map other wise we lose duplicates quickly
		if !tmp.PendingDeleted && tmp.ParentID == containerID { //don't return deleted containers
			unsortedObjects = append(unsortedObjects, tmp)
			//if name, ok := tmp.Attributes[obj.AttributeFileName]; ok && name != "" {
			//	unsortedObjects[tmp.Attributes[obj.AttributeFileName]] = tmp
			//} else {
			//	unsortedObjects[tmp.ID] = tmp
			//}
		}
	}
	//filter for the objects specifically for this container
	if len(unsortedObjects) == 0 && !synchronised {
		//we need to check there aren't any on the network
		//todo notify frontend of database sync
		return m.listSharedContainerObjectsAsync(containerID)
	}
	fmt.Println("len unsorted", len(unsortedObjects))
	//sort keys
	//the way to do this is seperate the objects without names
	//then only sort the ones with names
	//then attach the others on the end as miscs...
	keys := make([]string, 0, len(unsortedObjects))
	for _, v := range unsortedObjects {
		if name, ok := v.Attributes[obj.AttributeFileName]; ok && name != "" {
			keys = append(keys, v.Attributes[obj.AttributeFileName])
		} else {
			keys = append(keys, v.ID)
		}
	}
	sort.Strings(keys)
	//sorting harder than i thought when no name is possilbe on an object
	//append to array in alphabetical order by key
	//var objects []filesystem.Element
	//var unnamed []filesystem.Element
	//for _, k := range keys {
	//	for _, v := range unsortedObjects {
	//		if name, ok := v.Attributes[obj.AttributeFileName]; ok && name != "" && name == k {
	//			objects = append(objects, v)
	//			break
	//		}
	//		if name, ok := v.Attributes[obj.AttributeFileName]; ok || name != "" {
	//			unnamed = append(unnamed, v)
	//		}
	//
	//	}
	//}
	return unsortedObjects, nil
}

func (m *Manager) RemoveSharedContainer(containerId string) ([]filesystem.Element, error)  {
	fmt.Println("adding ocntainer with id", containerId)
	tmpWallet, err := m.retrieveWallet()
	if err != nil {
		fmt.Println("error retrieving wallet")
		return nil, err
	}
	if err := cache.DeleteSharedContainer(tmpWallet.Accounts[0].Address, containerId); err != nil {
		return nil, err
	}
	return m.ListSharedContainers()
}
func (m *Manager) AddSharedContainer(containerID string) error {
	//check if you can access this container
	fmt.Println("adding ocntainer with id", containerID)
	tmpWallet, err := m.retrieveWallet()
	if err != nil {
		fmt.Println("error retrieving wallet")
		return err
	}
	tmpKey := tmpWallet.Accounts[0].PrivateKey().PrivateKey
	fsCli, err := m.Client()
	c := cid.ID{}
	err = c.Parse(containerID)
	if err != nil {
		fmt.Println("error parsing container ", err)
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
	if err := cache.StoreSharedContainer(tmpWallet.Accounts[0].Address, containerID, marshal); err != nil {
		return err
	}
	return nil
}
