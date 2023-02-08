package manager

import (
	"context"
	"encoding/json"
	"fmt"
	"github.com/amlwwalker/greenfinch.react/pkg/cache"
	gspool "github.com/amlwwalker/greenfinch.react/pkg/pool"
	"github.com/amlwwalker/greenfinch.react/pkg/tokens"
	"github.com/nspcc-dev/neo-go/pkg/crypto/keys"
	"github.com/nspcc-dev/neofs-sdk-go/container/acl"
	"github.com/nspcc-dev/neofs-sdk-go/eacl"
	"github.com/nspcc-dev/neofs-sdk-go/netmap"
	obj "github.com/nspcc-dev/neofs-sdk-go/object"
	"github.com/nspcc-dev/neofs-sdk-go/pool"
	"github.com/nspcc-dev/neofs-sdk-go/user"
	"github.com/wailsapp/wails/v2/pkg/runtime"
	"log"
	"path/filepath"
	"strconv"
	"sync"
	"time"

	"github.com/nspcc-dev/neofs-sdk-go/container"
	cid "github.com/nspcc-dev/neofs-sdk-go/container/id"
	"github.com/nspcc-dev/neofs-sdk-go/session"
)

type Container struct {
	ID   string
	Size uint64
}

func (m *Manager) listContainerIDs() ([]cid.ID, error) {
	tmpWallet, err := m.retrieveWallet()
	if err != nil {
		return nil, err
	}
	tmpKey := tmpWallet.Accounts[0].PrivateKey().PrivateKey
	userID := user.ID{}
	user.IDFromKey(&userID, tmpKey.PublicKey)

	// UserContainers implements neofs.NeoFS interface method.
	var prm pool.PrmContainerList
	prm.SetOwnerID(userID)

	pl, err := m.Pool()
	if err != nil {
		return nil, err
	}
	r, err := pl.ListContainers(m.ctx, prm)
	if err != nil {
		fmt.Errorf("list user containers via connection pool: %w", err)
	}
	log.Printf("%v\r\n", r)
	return r, err
}
func (m *Manager) ListContainerIDs() ([]string, error) {
	var stringIds []string
	ids, err := m.listContainerIDs()
	if err != nil {
		m.MakeNotification(NotificationMessage{
			User:        m.Wallet.Accounts[0].Address,
			Title:       "Listing container IDs",
			Type:        "error",
			Description: "attempting to list conainer IDs failed due to " + err.Error(),
			MarkRead:    false,
		})
		m.MakeToast(UXMessage{
			Title:       "Listing error",
			Type:        "error",
			Description: "Could not list containers",
		})
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
func (m *Manager) NewListReadOnlyContainerContents(since int64) ([]Element, error) {
	//list the containers
	containers, err := m.ListContainers(false)
	if err != nil {
		return nil, err
	}
	resultCounter := 0
	var validContainers []Element
	//now for each container, we want to check the basic ACL
	wg := sync.WaitGroup{}
	var mu       sync.Mutex
	for _, cnt := range containers {
		wg.Add(1)
		go func(v Element) {
			defer wg.Done()
			fmt.Println("serving container", v.ID, v.BasicAcl, acl.PublicROExtended)
			fmt.Println("warning disabled RO check for endpoint")
			//if v.BasicAcl != acl.PublicROExtended {
			//	return
			//}
			//now we need the metadata for the objects in this container.
			objects, err := m.ListContainerObjects(v.ID, false)
			if err != nil {
				m.MakeNotification(NotificationMessage{
					User:        m.Wallet.Accounts[0].Address,
					Title:       "Listing read only container endpoint failure",
					Type:        "error",
					Description: "a request to list read only container contens failed " + err.Error(),
					MarkRead:    false,
				})
				return
			}
			fmt.Println("number of objects in container ", v.ID, len(objects))
			var pendingContainer Element
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
	return validContainers, nil
}

//// PopulateContainerList returns a container with its attributes as an Element (used by GenerateFileSystemFromContainer)
func (m Manager) populateContainerList(ctx context.Context, pl *pool.Pool, containerID cid.ID) Element {
	cont := Element{
		Type: "container",
		ID: containerID.String(),
		Attributes: make(map[string]string),
	}
	var prmGet pool.PrmContainerGet
	prmGet.SetContainerID(containerID)

	cnr, err := pl.GetContainer(ctx, prmGet)
	if err != nil {
		m.MakeNotification(NotificationMessage{
			Title:       "Retrieving pool failed",
			Type:        "error",
			Description: fmt.Sprintf("Populate container list has failed to retrieve the pool %s", err.Error()),
			MarkRead:    false,
		})
		cont.Errors = append(cont.Errors, err)
		return cont
	}

	cont.BasicAcl = cnr.BasicACL()
	cnr.IterateAttributes(func(k string, v string) {
		cont.Attributes[k] = v
	})
	return cont
}
//generateObjectStruct returns an array of elements containing all the objects owned by the contianer ID
func (m *Manager) generateObjectStruct(objs []Element, containerID cid.ID) (uint64, []Element){
	var newObjs []Element
	size := uint64(0)
	for _, o := range objs {
		head, err := m.GetObjectMetaData(o.ID, containerID.String())
		if err != nil {
			m.MakeNotification(NotificationMessage{
				Title:       "Retrieving object meta data failed",
				Type:        "error",
				Description: fmt.Sprintf("Retrieving the metadata for %s failed %s", o.ID, err.Error()),
				MarkRead:    false,
			})
			o.Errors = append(o.Errors, err)
		}
		for _, a := range head.Attributes() {
			o.Attributes[a.Key()] = a.Value()
		}
		if filename, ok := o.Attributes[obj.AttributeFileName]; ok {
			o.Attributes["X_EXT"] = filepath.Ext(filename)[1:]
		} else {
			o.Attributes["X_EXT"] = ""
		}

		o.Size = head.PayloadSize()
		size += o.Size
		newObjs = append(newObjs, o)
	}
	return size, newObjs
}
func (m *Manager) ForceSync() {
	fmt.Println("force syncing")
	if _, err := m.listContainersAsync(); err != nil {
		m.MakeNotification(NotificationMessage{
			Title:       "Force Sync is failing",
			Type:        "error",
			Description: fmt.Sprintf("Force sync failing due to %s", err.Error()),
			MarkRead:    false,
		})
	}
}

//listContainersAsync should be purely used to refresh the database cache
//todo: this needs to clean out the database as its a refresh of everything
func (m *Manager) listContainersAsync() ([]Element, error) {
	var containers []Element
	runtime.EventsEmit(m.ctx, "clearContainer", nil)
	tmpWallet, err := m.retrieveWallet()
	if err != nil {
		return nil, err
	}
	ids, err := m.listContainerIDs()
	if err != nil {
		m.MakeNotification(NotificationMessage{
			Title:       "Force Syncing containers is failing",
			Type:        "error",
			Description: fmt.Sprintf("Force sync failing due to %s", err.Error()),
			MarkRead:    false,
		})
		return nil, err
	}
	fmt.Println("container ids,", len(ids), ids)
	wg := sync.WaitGroup{}
	for _, v := range ids {
		wg.Add(1)
		go func(vID cid.ID) {
			//todo - this is meant to update the cache with the relevant objects. Lets check this out
			defer wg.Done()
			tmpContainer, err := m.prepareAndAppendContainer(vID)
			str, err := json.MarshalIndent(tmpContainer, "", "  ")
			if err != nil {
				m.MakeNotification(NotificationMessage{
					Title:       "Cannot encode container",
					Type:        "error",
					Description: fmt.Sprintf("Encoding container %s is failing %s", vID, err.Error()),
					MarkRead:    false,
				})
				return
			}
			fmt.Println("retrieved containers", tmpContainer)
			//store in database
			fmt.Println("storing container", tmpContainer.ID)
			if err = cache.StoreContainer(tmpWallet.Accounts[0].Address, tmpContainer.ID, str); err != nil {
				m.MakeNotification(NotificationMessage{
					Title:       "Storing container in cache is failing",
					Type:        "error",
					Description: fmt.Sprintf("Storing failing due to %s", err.Error()),
					MarkRead:    false,
				})
				fmt.Println("MASSIVE ERROR could not store container in database", err)
			}
		}(v)
	}
	wg.Wait()
	if m.DEBUG {
		DebugSaveJson("ListContainers.json", containers)
	}
	containerList, err := m.ListContainers(true)
	if err != nil {
		m.MakeNotification(NotificationMessage{
			Title:       "Retrieve container list is failing",
			Type:        "error",
			Description: fmt.Sprintf("Retrieving the container list failed due to %s", err.Error()),
			MarkRead:    false,
		})
	}
	return containerList, err
}

// prepareAndAppendContainer only used to update cache. Never as part of cache
func (m *Manager) prepareAndAppendContainer(vID cid.ID) (Element, error) {

	pl, err := m.Pool()
	if err != nil {
		m.MakeNotification(NotificationMessage{
			Title:       "Retrieving the pool is failing",
			Type:        "error",
			Description: fmt.Sprintf("Retrieving pool failing due to %s", err.Error()),
			MarkRead:    false,
		})
		return Element{}, err
	}
	fmt.Println("prepare and append container ", vID.String())
	tmpContainer := m.populateContainerList(m.ctx, pl, vID) // todo - why does this not return an error on a container?
	//
	//var filters = obj.SearchFilters{}
	//filters.AddRootFilter()
	fmt.Printf("tmpContainer 1 %+v\r\n", tmpContainer)
	list, err := m.ListContainerObjects(vID.String(), false)//object.QueryObjects(m.ctx, c, vID, filters, nil, sessionToken)
	if err != nil {
		m.MakeNotification(NotificationMessage{
			Title:       "Listing container objects failing",
			Type:        "error",
			Description: fmt.Sprintf("Listing objects for %s failing %s", vID.String(), err.Error()),
			MarkRead:    false,
		})
		tmpContainer.Errors = append(tmpContainer.Errors, err)
		return tmpContainer, err
	}
	//is this inefficient? the expensive part is the request, but we are throwing away the whole object
	size, _ := m.generateObjectStruct(list, vID)
	tmpContainer.Size = size
	fmt.Printf("tmpContainer 3 %+v\r\n", tmpContainer)
	return tmpContainer, nil
}

//this is going to be a bit of a hack whilst working out the best way to do size
func (m Manager) getContainerSize(containerID string) (uint64, error) {
	objects, err := m.ListContainerObjects(containerID, true) //in sync so just grab from file system
	if err != nil {
		return 0, err
	}
	var size = uint64(0)
	for _, v := range objects {
		size += v.Size
	}
	return size, nil
}
// ListContainers populates from cache
func (m *Manager) ListContainers(synchronised bool) ([]Element, error) {
	tmpWallet, err := m.retrieveWallet()
	if err != nil {
		m.MakeNotification(NotificationMessage{
			Title:       "Retrieving wallet failed",
			Type:        "error",
			Description: fmt.Sprintf("Retrieving wallet failing due to %s", err.Error()),
			MarkRead:    false,
		})
		m.MakeToast(UXMessage{
			Title:       "Container Error",
			Type:        "error",
			Description: "Could not retrieve wallet",
		})
		return nil, err
	}
	tmpContainers, err := cache.RetrieveContainers(tmpWallet.Accounts[0].Address)
	if err != nil {
		m.MakeNotification(NotificationMessage{
			Title:       "Retrieving containers failed",
			Type:        "error",
			Description: fmt.Sprintf("Retrieving containers failing due to %s", err.Error()),
			MarkRead:    false,
		})
		m.MakeToast(UXMessage{
			Title:       "Container Error",
			Type:        "error",
			Description: "Could not retrieve containers",
		})
		return nil, err
	}
	if len(tmpContainers) == 0 {
		//we need to check there aren't any on the network
		//todo notify frontend of database sync
		return m.listContainersAsync()
	}
	var unsortedContainers []Element
	//now convert to the elements
	fmt.Println("listing ", len(tmpContainers))
	for k, v := range tmpContainers {
		tmp := Element{}
		err := json.Unmarshal(v, &tmp)
		if err != nil {
			m.MakeNotification(NotificationMessage{
				Title:       "Decoding container failed",
				Type:        "error",
				Description: fmt.Sprintf("Decoding container %s failing due to %s",k, err.Error()),
				MarkRead:    false,
			})
			continue
		}
		if tmp.Size, err = m.getContainerSize(tmp.ID); err != nil {
			fmt.Println("could no get container size ", err)
			m.MakeNotification(NotificationMessage{
				Title:       "Retrieving container size failed",
				Type:        "error",
				Description: fmt.Sprintf("Retrieving container %s size failing due to %s", tmp.ID, err.Error()),
				MarkRead:    false,
			})
			m.MakeToast(UXMessage{
				Title:       "Container Error",
				Type:        "error",
				Description: "Could not retrieve container size" + err.Error(),
			})
			return nil, err
		}
		if !tmp.PendingDeleted { //don't return deleted containers
			unsortedContainers = append(unsortedContainers, tmp)
		}
	}
	return unsortedContainers, nil
}

// DeleteContainer must mark the container in the cache as deleted
// and delete it from neoFS
func (m *Manager) DeleteContainer(id string) ([]Element, error) {
	cnrID := cid.ID{}
	if err := cnrID.DecodeString(id); err != nil {
		m.MakeNotification(NotificationMessage{
			Title:       "Deleting wallet failed",
			Type:        "error",
			Description: fmt.Sprintf("Container ID %s could not be decoded due to %s", id, err.Error()),
			MarkRead:    false,
		})
		m.MakeToast(NewToastMessage(&UXMessage{
			Title:       "Container Error",
			Type:        "error",
			Description: "Container could not be decoded",
		}))
		return nil, err
	}

	tmpWallet, err := m.retrieveWallet()
	if err != nil {
		m.MakeNotification(NotificationMessage{
			Title:       "Retrieving wallet failed",
			Type:        "error",
			Description: fmt.Sprintf("Retrieving wallet failing due to %s", err.Error()),
			MarkRead:    false,
		})
		m.MakeToast(UXMessage{
			Title:       "Container Error",
			Type:        "error",
			Description: "Could not retrieve wallet",
		})
		return nil, err
	}
	tmpKey := tmpWallet.Accounts[0].PrivateKey().PrivateKey
	pKey := &keys.PrivateKey{PrivateKey: tmpKey}
	pl, err := m.Pool()
	if err != nil {
		m.MakeNotification(NotificationMessage{
			Title:       "Retrieving pool failed",
			Type:        "error",
			Description: fmt.Sprintf("Retrieving pool failing due to %s", err.Error()),
			MarkRead:    false,
		})
		m.MakeToast(UXMessage{
			Title:       "Container Error",
			Type:        "error",
			Description: "Could not retrieve pool",
		})
		return nil, err
	}

	iAt, exp, err := gspool.TokenExpiryValue(m.ctx, pl, 100)
	sc, err := tokens.BuildContainerSessionToken(pKey, iAt, iAt, exp, cnrID, session.VerbContainerDelete, *pKey.PublicKey())
	if err != nil {
		m.MakeNotification(NotificationMessage{
			Title:       "Retrieving session token failed",
			Type:        "error",
			Description: fmt.Sprintf("Retrieving session oken failing due to %s", err.Error()),
			MarkRead:    false,
		})
		m.MakeToast(UXMessage{
			Title:       "Container Error",
			Type:        "error",
			Description: "Could not retrieve token",
		})
		return nil, err
	}
	var prm pool.PrmContainerDelete
	prm.SetContainerID(cnrID)
	prm.SetSessionToken(*sc)
	if err := pl.DeleteContainer(m.ctx, prm); err != nil {
		m.MakeNotification(NotificationMessage{
			Title:       "Deleting container failed",
			Type:        "error",
			Description: fmt.Sprintf("Deleting container failing due to %s", err.Error()),
			MarkRead:    false,
		})
	} else {
		////now mark deleted
		cacheContainer, err := cache.RetrieveContainer(tmpWallet.Accounts[0].Address, id)
		if err != nil {
			m.MakeNotification(NotificationMessage{
				Title:       "Retrieving container from cache failed",
				Type:        "error",
				Description: fmt.Sprintf("Retrieving container from cache failing due to %s", err.Error()),
				MarkRead:    false,
			})
			m.MakeToast(NewToastMessage(&UXMessage{ //todo make this a notification
				Title:       "Deletion Error",
				Type:        "error",
				Description: "Could not retrieve container",
			}))
			return nil, err
		}
		if cacheContainer == nil {
			m.MakeNotification(NotificationMessage{
				Title:       "Retrieving container from cache failed",
				Type:        "error",
				Description: fmt.Sprintf("No container in cache %s", err.Error()),
				MarkRead:    false,
			})
			m.MakeToast(NewToastMessage(&UXMessage{ //todo make this a notification
				Title:       "Deletion Error",
				Type:        "error",
				Description: "Container does not exist locally. ",
			}))
		}
		tmp := Element{}
		if err := json.Unmarshal(cacheContainer, &tmp); err != nil {
			m.MakeNotification(NotificationMessage{
				Title:       "Decoding container failed",
				Type:        "error",
				Description: fmt.Sprintf("Decoding container failing due to %s", err.Error()),
				MarkRead:    false,
			})
			m.MakeToast(NewToastMessage(&UXMessage{
				Title:       "Deletion Error",
				Type:        "error",
				Description: "Error decoding container",
			}))
			return nil, err
		}
		tmp.PendingDeleted = true
		del, err := json.Marshal(tmp)
		if err := cache.PendContainerDeleted(tmpWallet.Accounts[0].Address, id, del); err != nil {
			m.MakeNotification(NotificationMessage{
				Title:       "Deleting container failed",
				Type:        "error",
				Description: fmt.Sprintf("Deleting container failing due to %s", err.Error()),
				MarkRead:    false,
			})
			m.MakeToast(NewToastMessage(&UXMessage{
				Title:       "Deletion Error",
				Type:        "error",
				Description: "Could not delete container",
			}))
			return nil, err
		}

		m.MakeToast(NewToastMessage(&UXMessage{
			Title:       "Container Deleted",
			Type:        "success",
			Description: "Container successfully deleted",
		}))
	}
	return m.ListContainers(false)
}

//ultimately, you want to do this with containers that can be restricted (i.e eaclpublic)

func (m *Manager) RestrictContainer(id string, publicKey string) error {
	m.MakeToast(NewToastMessage(&UXMessage{
		Title:       "Sharing pending",
		Type:        "info",
		Description: "please wait",
	}))
	cnrID := cid.ID{}
	if err := cnrID.DecodeString(id); err != nil {
		m.MakeNotification(NotificationMessage{
			Title:       "Decoding container failed",
			Type:        "error",
			Description: fmt.Sprintf("Decoding container failing due to %s", err.Error()),
			MarkRead:    false,
		})
		m.MakeToast(NewToastMessage(&UXMessage{
			Title:       "Sharing Error",
			Type:        "error",
			Description: "Could not find a container",
		}))
		return err
	}
	tmpWallet, err := m.retrieveWallet()
	if err != nil {
		m.MakeNotification(NotificationMessage{
			Title:       "Retrieving wallet failed",
			Type:        "error",
			Description: fmt.Sprintf("Retrieving wallet failing due to %s", err.Error()),
			MarkRead:    false,
		})
		m.MakeToast(NewToastMessage(&UXMessage{
			Title:       "Sharing Error",
			Type:        "error",
			Description: "Could not retrieve wallet",
		}))
		return err
	}

	//this doesn't feel correct??
	tmpKey := tmpWallet.Accounts[0].PrivateKey().PrivateKey
	pKey := &keys.PrivateKey{PrivateKey: tmpKey}

	//todo: how do you attach a new session to a session Container?
	sc, err := tokens.BuildContainerSessionToken(pKey, 500, 500, 500, cnrID, session.VerbContainerPut, *pKey.PublicKey())
	if err != nil {
		m.MakeNotification(NotificationMessage{
			Title:       "Retrieving session token failed",
			Type:        "error",
			Description: fmt.Sprintf("Retrieving session token failing due to %s", err.Error()),
			MarkRead:    false,
		})
		m.MakeToast(NewToastMessage(&UXMessage{
			Title:       "Sharing Error",
			Type:        "error",
			Description: "Could not retrieve session token ",
		}))
	}

	//for the time being, this is the same key
	specifiedTargetRole := eacl.NewTarget()
	eacl.SetTargetECDSAKeys(specifiedTargetRole, &tmpKey.PublicKey)

	var prm pool.PrmContainerSetEACL
	table, err := tokens.AllowGetPut(cnrID, *specifiedTargetRole) //todo - open this up for other key types
	if err != nil {
		m.MakeNotification(NotificationMessage{
			Title:       "Retrieving table failed",
			Type:        "error",
			Description: fmt.Sprintf("Retrieving table failing due to %s", err.Error()),
			MarkRead:    false,
		})
		m.MakeToast(NewToastMessage(&UXMessage{
			Title:       "Sharing Error",
			Type:        "error",
			Description: "Could not retrieve EACL table" + err.Error(),
		}))
	}
	prm.SetTable(table)
	if sc != nil {
		prm.WithinSession(*sc) //todo = what if the sc is nil? Why continue?
	}
	pl, err := m.Pool()
	if err != nil {
		m.MakeToast(NewToastMessage(&UXMessage{
			Title:       "Sharing Error",
			Type:        "error",
			Description: "Could not retrieve pool" + err.Error(),
		}))
		return err
	}

	if err := pl.SetEACL(m.ctx, prm); err != nil {
		m.MakeNotification(NotificationMessage{
			Title:       "Setting container EACL failed",
			Type:        "error",
			Description: fmt.Sprintf("Setting container EACL failing due to %s", err.Error()),
			MarkRead:    false,
		})
		tmp := UXMessage{
			Title:       "Container Error",
			Type:        "error",
			Description: "Could not set EACL on container",
		}
		m.MakeToast(NewToastMessage(&tmp))
		return err
	}

	////table := eacl.AllAllowDenyOthersEACL(c, pKey)
	//var prmContainerSetEACL client.PrmContainerSetEACL
	//prmContainerSetEACL.SetTable(table)
	//pl, err := m.Pool()
	//if err != nil {
	//	return err
	//}
	//_, err = pl.ContainerSetEACL(m.ctx, prmContainerSetEACL)
	//if err != nil {
	//	tmp := UXMessage{
	//		Title:       "Container Error",
	//		Type:        "error",
	//		Description: "EACL failed" + err.Error(),
	//	}
	//	m.MakeToast(NewToastMessage(&tmp))
	//	return err
	//}
	//
	//err = AwaitTime(30, func() bool {
	//	var prmContainerEACL client.PrmContainerEACL
	//	prmContainerEACL.SetContainer(c)
	//	r, err := fsCli.ContainerEACL(m.ctx, prmContainerEACL)
	//	if err != nil {
	//		return false
	//	}
	//	expected, _ := table.Marshal()
	//	got, _ := r.Table().Marshal()
	//	res := bytes.Equal(expected, got)
	//	if res {
	//		tmp := UXMessage{
	//			Title:       "Sharing successful",
	//			Type:        "success",
	//			Description: "successfully shared container",
	//		}
	//		m.MakeToast(NewToastMessage(&tmp))
	//	}
	//	return res
	//})
	//if err != nil {
	//	tmp := UXMessage{
	//		Title:       "Container Error",
	//		Type:        "error",
	//		Description: "failed to restrict container" + err.Error(),
	//	}
	//	m.MakeToast(NewToastMessage(&tmp))
	//	return err
	//}
	return nil
}

//presets within the neofs-sdk that are not exposed so recreating here
const (
	attributeName      = "Name"
	attributeTimestamp = "Timestamp"
)
func (m *Manager) CreateContainer(name string, permission string, block bool) error {
	var containerAttributes = make(map[string]string) //todo shift this up to the javascript side
	tmpWallet, err := m.retrieveWallet()
	if err != nil {
		m.MakeNotification(NotificationMessage{
			Title:       "Retrieving wallet failed",
			Type:        "error",
			Description: fmt.Sprintf("Retrieving wallet failing due to %s", err.Error()),
			MarkRead:    false,
		})
		m.MakeToast(NewToastMessage(&UXMessage{
			Title:       "Container Error",
			Type:        "error",
			Description: "Retrieving wallet failed ",
		}))
		return err
	}
	tmpKey := tmpWallet.Accounts[0].PrivateKey().PrivateKey
	pKey := &keys.PrivateKey{PrivateKey: tmpKey}

	pl, err := m.Pool()
	if err != nil {
		m.MakeNotification(NotificationMessage{
			Title:       "Retrieving pool failed",
			Type:        "error",
			Description: fmt.Sprintf("Retrieving pool failing due to %s", err.Error()),
			MarkRead:    false,
		})
		m.MakeToast(NewToastMessage(&UXMessage{
			Title:       "Container Error",
			Type:        "error",
			Description: "Retrieving pool failed ",
		}))
		return err
	}
	userID := user.ID{}
	user.IDFromKey(&userID, tmpKey.PublicKey)

	placementPolicy := `REP 2 IN X 
	CBF 2
	SELECT 2 FROM * AS X
	`

	policy := netmap.PlacementPolicy{}
	if err := policy.DecodeString(placementPolicy); err != nil {
		m.MakeNotification(NotificationMessage{
			Title:       "Decoding placement policy failed",
			Type:        "error",
			Description: fmt.Sprintf("Decoding placement policy failing due to %s", err.Error()),
			MarkRead:    false,
		})
		m.MakeToast(NewToastMessage(&UXMessage{
			Title:       "Container Error",
			Type:        "error",
			Description: "Decoding policy failed",
		}))
		return err
	}

	var cnr container.Container
	cnr.Init()
	cnr.SetPlacementPolicy(policy)
	cnr.SetOwner(userID)

	var customAcl acl.Basic //0x0FFFCFFF
	switch permission {
	case "PRIVATE":
		customAcl = acl.Private //0x1C8C8CCC -> 478973132
	case "PUBLICREAD":
		customAcl = acl.PublicROExtended //EACLReadOnlyBasicRule //0x0FBF8CFF -> 264211711
	case "PUBLICBASIC":
		customAcl = acl.PublicRWExtended //EACLPublicBasicRule //0x0FBFBFFF -> 264224767
	default:
		fmt.Println("setting container to default ACL")
		customAcl = acl.PublicRWExtended //BasicACL(0x0FFFCFFF) //0x0FFFCFFF -> 268423167
	}

	creationTime := time.Now()
	cnr.SetBasicACL(customAcl) //acl.PublicRWExtended)
	container.SetCreationTime(&cnr, creationTime)

	//this should set user specific attributes and not default attributes. I.e block attributes that are 'reserved
	for k, v := range containerAttributes {
		cnr.SetAttribute(k, v)
	}

	fmt.Println("time check ", creationTime, string(creationTime.Unix()), strconv.FormatInt(time.Now().Unix(), 10))
	containerAttributes[attributeTimestamp] = strconv.FormatInt(time.Now().Unix(), 10)
	// todo: what is the difference between domain name and container name??
	//var d container.Domain
	//d.SetName("domain-name")
	//container.WriteDomain(&cnr, d)
	container.SetName(&cnr, name)
	containerAttributes[attributeName] = name
	if err := pool.SyncContainerWithNetwork(m.ctx, &cnr, pl); err != nil {
		fmt.Errorf("sync container with the network state: %w", err)
		m.MakeNotification(NotificationMessage{
			Title:       "Syncing container with network failed",
			Type:        "error",
			Description: fmt.Sprintf("Syncing container with network failing due to %s", err.Error()),
			MarkRead:    false,
		})
		m.MakeToast(NewToastMessage(&UXMessage{
			Title:       "Container Error",
			Type:        "error",
			Description: "Syncing with failed",
		}))
		return err
	}
	var prmPut pool.PrmContainerPut
	prmPut.SetContainer(cnr)

	iAt, exp, err := gspool.TokenExpiryValue(m.ctx, pl, 100)
	sc, err := tokens.BuildContainerSessionToken(pKey, iAt, iAt, exp, cid.ID{}, session.VerbContainerPut, *pKey.PublicKey())
	if err != nil {
		m.MakeNotification(NotificationMessage{
			Title:       "Retrieving session token failed",
			Type:        "error",
			Description: fmt.Sprintf("Retrieving session token failing due to %s", err.Error()),
			MarkRead:    false,
		})
		m.MakeToast(UXMessage{
			Title:       "Container Error",
			Type:        "error",
			Description: "Could not retrieve session token",
		})
		return err
	}
	if sc != nil {
		prmPut.WithinSession(*sc)
	}
	fmt.Println("about to put container")

	go func() {
		// send request to save the container
		//todo - do this on a routine so that we don't hang
		idCnr, err := pl.PutContainer(m.ctx, prmPut) //see SetWaitParams to change wait times
		if err != nil {
			m.MakeNotification(NotificationMessage{
				Title:       "Creating new container failed",
				Type:        "error",
				Description: fmt.Sprintf("Creating new container %s failing due to %s", name, err.Error()),
				MarkRead:    false,
			})
			m.MakeToast(NewToastMessage(&UXMessage{
				Title:       "Container Error",
				Type:        "error",
				Description: "Creating container failed ",
			}))
			return
		}

		el := Element{
			ID:         idCnr.String(),
			Type:       "container",
			Size:       0,
			BasicAcl:   customAcl,
			Attributes: make(map[string]string),
		}
		for k, v := range containerAttributes {
			el.Attributes[k] = v
		}
		marshal, err := json.Marshal(el)
		if err != nil {
			m.MakeNotification(NotificationMessage{
				Title:       "Creating new container failed",
				Type:        "error",
				Description: fmt.Sprintf("Creating new container %s failing due to %s", name, err.Error()),
				MarkRead:    false,
			})
			m.MakeToast(UXMessage{
				Title:       "Container Error",
				Type:        "error",
				Description: "Storing container failed ",
			})
			return
		}
		err = cache.StoreContainer(tmpWallet.Accounts[0].Address, idCnr.String(), marshal)
		if err != nil {
			m.MakeNotification(NotificationMessage{
				Title:       "Creating new container failed",
				Type:        "error",
				Description: fmt.Sprintf("Creating new container %s failing due to %s", name, err.Error()),
				MarkRead:    false,
			})
			m.MakeToast(UXMessage{
				Title:       "Container Error",
				Type:        "error",
				Description: "Storing container failed",
			})
			return
		}
		m.MakeToast(NewToastMessage(&UXMessage{
			Title:       "Container Created",
			Type:        "success",
			Description: "Container '" + name + "' created",
		}))
	}()
	return nil
}
