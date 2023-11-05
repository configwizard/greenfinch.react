package manager

import (
	"context"
	"crypto/ecdsa"
	"github.com/nspcc-dev/neofs-sdk-go/client"
	neofscrypto "github.com/nspcc-dev/neofs-sdk-go/crypto"
	neofsecdsa "github.com/nspcc-dev/neofs-sdk-go/crypto/ecdsa"

	//"crypto/ecdsa"
	"encoding/json"
	"errors"
	"fmt"
	"github.com/amlwwalker/greenfinch.react/pkg/cache"
	gspool "github.com/amlwwalker/greenfinch.react/pkg/pool"
	"github.com/amlwwalker/greenfinch.react/pkg/tokens"
	//"github.com/nspcc-dev/neo-go/pkg/crypto/keys"
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
	"strings"
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
	userID := user.ResolveFromECDSAPublicKey(*(*ecdsa.PublicKey)(m.TemporaryUserPublicKey())) //dereference

	// UserContainers implements neofs.NeoFS interface method.

	pl, err := m.Pool(false)
	if err != nil {
		return nil, err
	}
	lst := client.PrmContainerList{}
	lst.WithXHeaders() //fixme - discover what this is for
	r, err := pl.ContainerList(m.ctx, userID, lst)
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
	containers, err := m.ListContainers(false, false)
	if err != nil {
		return nil, err
	}
	resultCounter := 0
	var validContainers []Element
	//now for each container, we want to check the basic ACL
	wg := sync.WaitGroup{}
	var mu sync.Mutex
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
			objects, err := m.ListContainerObjects(v.ID, false, false)
			if err != nil {
				fmt.Println("failed to process container ", v.ID)
				return
			}
			fmt.Println("number of objects in container ", v.ID, len(objects))
			var pendingContainer Element
			pendingContainer.ID = v.ID
			pendingContainer.Type = v.Type
			pendingContainer.Attributes = v.Attributes
			pendingContainer.BasicAcl = v.BasicAcl
			pendingContainer.ExtendedAcl = v.ExtendedAcl
			size := uint64(0)
			for _, el := range objects {
				size += el.Size
				//filteredElements = append(filteredElements, el)
				unixString, ok := el.Attributes[obj.AttributeTimestamp]
				unixTime, err := strconv.ParseInt(unixString, 10, 64)
				fmt.Println(" processing ", el.ID, unixTime, since, unixTime > since)
				if ok && err == nil && unixTime > since {
					//its a good object
					//remove the unecessary attribute
					delete(el.Attributes, "Thumbnail")
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

// // PopulateContainerList returns a container with its attributes as an Element (used by GenerateFileSystemFromContainer)
func populateContainerList(ctx context.Context, pl *pool.Pool, containerID cid.ID) Element {
	cont := Element{
		Type:       "container",
		ID:         containerID.String(),
		Attributes: make(map[string]string),
	}

	var prmGet client.PrmContainerGet
	prmGet.WithXHeaders()

	cnr, err := pl.ContainerGet(ctx, containerID, prmGet)
	if err != nil {
		cont.Errors = append(cont.Errors, err)
		return cont
	}

	cont.BasicAcl = cnr.BasicACL()
	cnr.IterateAttributes(func(k string, v string) {
		fmt.Println("populating for ", k, v)
		cont.Attributes[k] = v
	})
	return cont
}

// generateObjectStruct returns an array of elements containing all the objects owned by the contianer ID
func (m *Manager) generateObjectStruct(objs []Element, containerID cid.ID) (uint64, []Element) {
	var newObjs []Element
	size := uint64(0)
	for _, o := range objs {
		head, err := m.GetObjectMetaData(o.ID, containerID.String())
		if err != nil {
			o.Errors = append(o.Errors, err)
		}
		for _, a := range head.Attributes() {
			o.Attributes[a.Key()] = a.Value()
		}
		checksum, _ := head.PayloadChecksum()
		o.Attributes[payloadChecksumHeader] = checksum.String()
		if filename, ok := o.Attributes[obj.AttributeFileName]; ok {
			o.Attributes["X_EXT"] = strings.TrimPrefix(filepath.Ext(filename), ".")
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
	if cnts, err := m.listContainersAsync(true); err != nil {
		fmt.Println("force sync error ", err)
	} else {
		for _, v := range cnts {
			go func(id string) {
				m.listObjectsAsync(id)
			}(v.ID)

		}
	}
	m.ContainersChanged()
}

// listContainersAsync should be purely used to refresh the database cache
// todo: this needs to clean out the database as its a refresh of everything
func (m *Manager) listContainersAsync(synchronised bool) ([]Element, error) {
	//var containers []Element
	runtime.EventsEmit(m.ctx, "clearContainer", nil)
	walletAddress, err := m.retrieveWallet()
	if err != nil {
		return []Element{}, err
	}
	ids, err := m.listContainerIDs()
	if err != nil {
		return []Element{}, err
	}
	/*
		1. if a container exists on NeoFS, sync it
		2. if it exists locally but not on NeoFS, delete it
	*/
	if len(ids) == 0 { //don't go on there are no containers
		return []Element{}, nil
	}
	cached, err := cache.RetrieveContainers(walletAddress, m.selectedNetwork.ID)
	if err != nil {
		return nil, err
	}
	for _, v := range ids {
		if _, ok := cached[v.String()]; ok {
			delete(cached, v.String())
		}
	}
	//so now whats left in cached, should be deleted locally
	for k, _ := range cached {
		err := cache.DeleteContainer(walletAddress, m.selectedNetwork.ID, k)
		if err != nil {
			m.MakeNotification(NotificationMessage{
				Title:       "Error cleaning container",
				Type:        "info",
				Description: "Couldn't clean local container " + k,
			})
		}
	}
	fmt.Println("container ids,", len(ids), ids)
	wg := sync.WaitGroup{}
	var listContainers []Element
	for _, v := range ids {
		wg.Add(1)
		go func(vID cid.ID) {
			//todo - this is meant to update the cache with the relevant objects. Lets check this out
			defer wg.Done()
			tmpContainer, err := m.prepareAndAppendContainer(vID, synchronised)
			str, err := json.MarshalIndent(tmpContainer, "", "  ")
			if err != nil {
				fmt.Println(err)
			}
			fmt.Println("retrieved containers", tmpContainer)
			//store in database
			fmt.Println("storing container", tmpContainer.ID)
			if !m.enableCaching {
				listContainers = append(listContainers, tmpContainer)
			}
			if err = cache.StoreContainer(walletAddress, m.selectedNetwork.ID, tmpContainer.ID, str); err != nil {
				fmt.Println("MASSIVE ERROR could not store container in database", err)
			}
		}(v)
	}
	if len(ids) > 0 {
		wg.Wait()
	}
	if !m.enableCaching {
		return listContainers, nil
	}

	containerList, err := m.ListContainers(false, true)
	//fmt.Println("async returning", containerList)
	return containerList, err
}

// prepareAndAppendContainer only used to update cache. Never as part of cache
func (m *Manager) prepareAndAppendContainer(vID cid.ID, synchronised bool) (Element, error) {
	//c, err := m.Client()
	//if err != nil {
	//	log.Fatal("SERIOUS ERROR , could not retrieve client - in Go routine", err)
	//	return Element{}, err
	//}
	pl, err := m.Pool(false)
	if err != nil {
		return Element{}, err
	}
	fmt.Println("prepare and append container ", vID.String())
	tmpContainer := populateContainerList(m.ctx, pl, vID) // todo - why does this not return an error on a container?
	//
	//var filters = obj.SearchFilters{}
	//filters.AddRootFilter()
	fmt.Printf("tmpContainer 1 %+v\r\n", tmpContainer)
	list, err := m.ListContainerObjects(vID.String(), synchronised, false) //object.QueryObjects(m.ctx, c, vID, filters, nil, sessionToken)
	if err != nil {
		fmt.Println("error querying objects of container", err)
		tmpContainer.Errors = append(tmpContainer.Errors, err)
		return tmpContainer, err
	}
	fmt.Printf("tmpContainer 2 %+v\r\n", tmpContainer)
	//is this inefficient? the expensive part is the request, but we are throwing away the whole object
	size, _ := m.generateObjectStruct(list, vID)
	tmpContainer.Size = size
	fmt.Printf("tmpContainer 3 %+v\r\n", tmpContainer)
	return tmpContainer, nil
}

// this is going to be a bit of a hack whilst working out the best way to do size
func (m Manager) getContainerSize(containerID string, synchronised bool) (uint64, error) {
	objects, err := m.ListContainerObjects(containerID, synchronised, false) //in sync so just grab from file system
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
func (m *Manager) ListContainers(synchronised bool, deleted bool) ([]Element, error) {
	walletAddress, err := m.retrieveWallet()
	if err != nil {
		return []Element{}, err
	}
	//just go straight to getting them remotely first. Next time around will allow to retrieve from the database.
	if !m.enableCaching { //fixme: potential issue where by this takes a while and the cache is re-enabled.....
		fmt.Println("cache disabled, so listing from network...")
		return m.listContainersAsync(false)
	}
	tmpContainers, err := cache.RetrieveContainers(walletAddress, m.selectedNetwork.ID)
	if err != nil {
		return nil, err
	}
	if len(tmpContainers) == 0 || synchronised {
		//we need to check there aren't any on the network
		//todo notify frontend of database sync
		fmt.Println(GetCurrentFunctionName(), " ListContainers caller is ", GetCallerFunctionName())
		return m.listContainersAsync(false)
	}
	var unsortedContainers []Element
	//now convert to the elements
	fmt.Println("listing ", len(tmpContainers))
	for k, v := range tmpContainers {
		tmp := Element{}
		err := json.Unmarshal(v, &tmp)
		if err != nil {
			fmt.Println("warning - could not unmarshal container", k)
			continue
		}
		if tmp.Size, err = m.getContainerSize(tmp.ID, false); err != nil {
			fmt.Println("could no get container size ", err)
			return nil, err
		}
		fmt.Println("checking", tmp.ID, tmp.PendingDeleted)
		if deleted {
			unsortedContainers = append(unsortedContainers, tmp)
		} else if !tmp.PendingDeleted { //don't return deleted containers
			fmt.Println("adding ", tmp.ID)
			unsortedContainers = append(unsortedContainers, tmp)

		} else {
			fmt.Println("not adding ", tmp.ID)
		}
	}
	fmt.Println("ended up with", len(unsortedContainers))

	fmt.Println("finally", len(unsortedContainers))
	return unsortedContainers, nil
}

// DeleteContainer must mark the container in the cache as deleted
// and delete it from neoFS
func (m *Manager) DeleteContainer(id string) ([]Element, error) {
	fmt.Println("deleting container ", id)
	cnrID := cid.ID{}
	if err := cnrID.DecodeString(id); err != nil {
		tmp := UXMessage{
			Title:       "Container Error",
			Type:        "error",
			Description: "Container does not exist " + err.Error(),
		}
		m.MakeToast(NewToastMessage(&tmp))
		return nil, err
	}

	walletAddress, err := m.retrieveWallet()
	if err != nil {
		return []Element{}, err
	}
	pl, err := m.Pool(false)
	if err != nil {
		return []Element{}, err
	}

	iAt, exp, err := gspool.TokenExpiryValue(m.ctx, pl, 100)
	sc := tokens.BuildUnsignedContainerSessionToken(iAt, iAt, exp, cnrID, session.VerbContainerDelete, *m.gateAccount.PublicKey())
	if err := m.TemporarySignContainerTokenWithPrivateKey(sc); err != nil {
		fmt.Errorf("%w", err)
		return nil, err
	}
	var gateSigner neofscrypto.Signer = neofsecdsa.SignerRFC6979(m.gateAccount.PrivateKey().PrivateKey)
	////now mark deleted
	cacheContainer, err := cache.RetrieveContainer(walletAddress, m.selectedNetwork.ID, id)
	if err != nil {
		fmt.Println("error retrieving container??", err)
		return []Element{}, err
	}
	if cacheContainer == nil {
		//there is no container
		fmt.Println("error as no container exists in the cache")
		return []Element{}, errors.New("error as no container exists in the cache")
	}
	tmp := Element{}
	if err := json.Unmarshal(cacheContainer, &tmp); err != nil {
		return []Element{}, err
	}
	tmp.PendingDeleted = true
	del, err := json.Marshal(tmp)
	if err := json.Unmarshal(cacheContainer, &tmp); err != nil {
		return []Element{}, err
	}
	if err := cache.PendContainerDeleted(walletAddress, m.selectedNetwork.ID, id, del); err != nil {
		return []Element{}, err
	}
	m.MakeNotification(NotificationMessage{
		Title:       "Pending container deletion",
		Type:        "info",
		Description: "Container " + tmp.ID + " pending deletion",
	})
	var prm client.PrmContainerDelete
	prm.WithinSession(*sc)
	go func() {
		if err := pl.ContainerDelete(m.ctx, cnrID, gateSigner, prm); err != nil {
			fmt.Println("error deleting container", err)
			m.MakeToast(NewToastMessage(&UXMessage{
				Title:       "Container Error",
				Type:        "error",
				Description: "Container could not be deleted",
			}))
			m.MakeNotification(NotificationMessage{
				Title:       "Pending container deletion",
				Type:        "error",
				Description: "Container " + tmp.ID + " could not be deleted: " + err.Error(),
			})
			////now mark deleted
			cacheContainer, err := cache.RetrieveContainer(walletAddress, m.selectedNetwork.ID, id)
			if err != nil {
				fmt.Println("error retrieving container??", err)
				return
			}
			if cacheContainer == nil {
				//there is no container
				fmt.Println("error as no container exists in the cache")
				return
			}
			tmp := Element{}
			if err := json.Unmarshal(cacheContainer, &tmp); err != nil {
				return
			}
			tmp.PendingDeleted = false
			del, err := json.Marshal(tmp)
			if err := json.Unmarshal(cacheContainer, &tmp); err != nil {
				return
			}
			if err := cache.PendContainerDeleted(walletAddress, m.selectedNetwork.ID, id, del); err != nil {
				return
			}
		} else {
			if err := cache.DeleteContainer(walletAddress, m.selectedNetwork.ID, id); err != nil {
				m.MakeNotification(NotificationMessage{
					Title:       "Container cache deletion",
					Type:        "error",
					Description: "failed to delete container " + id + " from the cache " + err.Error(),
				})
				m.MakeToast(NewToastMessage(&UXMessage{
					Title:       "Container cache deletion",
					Type:        "error",
					Description: "failed to delete container from the cache",
				}))
				return
			}
			m.MakeNotification(NotificationMessage{
				Title:       "Container Deleted",
				Type:        "success",
				Description: "Container " + tmp.ID + " was deleted successfully",
			})
			m.MakeToast(NewToastMessage(&UXMessage{
				Title:       "Container Deleted",
				Type:        "success",
				Description: "Container successfully deleted",
			}))
		}
		m.ContainersChanged()
	}()
	return m.ListContainers(false, true)
}

//ultimately, you want to do this with containers that can be restricted (i.e eaclpublic)

func (m *Manager) RestrictContainer(id string, l string) error {
	tmp := UXMessage{
		Title:       "Sharing pending",
		Type:        "info",
		Description: "Please wait...",
	}
	m.MakeToast(NewToastMessage(&tmp))
	m.MakeNotification(NotificationMessage{
		Title:       "Sharing container started",
		Type:        "info",
		Description: "starting sharing container " + id + " with " + l,
	})
	cnrID := cid.ID{}
	if err := cnrID.DecodeString(id); err != nil {
		tmp := UXMessage{
			Title:       "Sharing Error",
			Type:        "error",
			Description: "Could not find a container " + err.Error(),
		}
		m.MakeToast(NewToastMessage(&tmp))
		return err
	}
	//tmpWallet, err := m.retrieveWallet()
	//if err != nil {
	//	return err
	//}
	pl, err := m.Pool(false)
	if err != nil {
		fmt.Errorf("%w", err)
		return err
	}

	iAt, exp, err := gspool.TokenExpiryValue(m.ctx, pl, 100)
	if err != nil {
		fmt.Errorf("%w", err)
		return err
	}
	sc := tokens.BuildUnsignedContainerSessionToken(iAt, iAt, exp, cnrID, session.VerbContainerPut, *m.gateAccount.PublicKey())
	if err := m.TemporarySignContainerTokenWithPrivateKey(sc); err != nil {
		log.Println("error creating session token to create a container")
		return err
	}
	//for the time being, this is the same key
	specifiedTargetRole := eacl.NewTarget()

	var prm client.PrmContainerSetEACL
	prm.WithinSession(*sc)
	table, err := tokens.AllowGetPut(cnrID, *specifiedTargetRole)
	if err != nil {
		log.Fatal("couldn't create eacl table", err)
	}
	if sc != nil {
		prm.WithinSession(*sc) //todo = what if the sc is nil? Why continue?
	}
	gateSigner := user.NewAutoIDSigner(m.gateAccount.PrivateKey().PrivateKey) //fix me is this correct signer?
	go func() {
		if err := pl.ContainerSetEACL(m.ctx, table, gateSigner, prm); err != nil {
			fmt.Errorf("save eACL via connection pool: %w", err)
			m.MakeNotification(NotificationMessage{
				Title:       "Sharing container Failed",
				Type:        "error",
				Description: "Couldn't share container" + id + " - " + err.Error(),
			})
			tmp := UXMessage{
				Title:       "Sharing container failed",
				Type:        "error",
				Description: "Error sharing container",
			}
			m.MakeToast(NewToastMessage(&tmp))
			return
		}
		m.MakeNotification(NotificationMessage{
			Title:       "Sharing successful",
			Type:        "success",
			Description: "Successfully shared container " + id,
		})
		tmp := UXMessage{
			Title:       "Sharing successful",
			Type:        "success",
			Description: "successfully shared container",
		}
		m.MakeToast(NewToastMessage(&tmp))
	}()
	return nil
}

const (
	attributeName      = "Name"
	attributeTimestamp = "Timestamp"
)

func (m *Manager) CreateContainer(name string, permission string, block bool) error {
	var containerAttributes = make(map[string]string) //todo shift this up to the javascript side
	walletAddress, err := m.retrieveWallet()
	if err != nil {
		return err
	}

	pl, err := m.Pool(false)
	if err != nil {
		return err
	}
	log.Println("creating container with name", name)
	userID := user.ResolveFromECDSAPublicKey(*(*ecdsa.PublicKey)(m.TemporaryUserPublicKey())) //dereference
	placementPolicy := `REP 2 IN X 
	CBF 2
	SELECT 2 FROM * AS X
	`

	policy := netmap.PlacementPolicy{}
	if err := policy.DecodeString(placementPolicy); err != nil {
		fmt.Errorf("failed to build placement policy: %w", err)
		return err
	}

	var cnr container.Container
	cnr.Init()
	cnr.SetPlacementPolicy(policy)
	cnr.SetOwner(userID)

	var customAcl acl.Basic //0x0FFFCFFF
	switch permission {
	case "PRIVATE":
		//todo = decide if this can be updated with EACL tables
		customAcl = acl.PrivateExtended //0x1C8C8CCC -> 478973132
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
	cnr.SetCreationTime(creationTime)

	//this should set user specific attributes and not default attributes. I.e block attributes that are 'reserved
	for k, v := range containerAttributes {
		cnr.SetAttribute(k, v)
	}

	fmt.Println("time check ", creationTime, fmt.Sprint(creationTime.Unix()), strconv.FormatInt(time.Now().Unix(), 10))
	containerAttributes[attributeTimestamp] = strconv.FormatInt(time.Now().Unix(), 10)
	// todo: what is the difference between domain name and container name??
	//var d container.Domain
	//d.SetName("domain-name")
	//container.WriteDomain(&cnr, d)
	cnr.SetName(name)
	containerAttributes[attributeName] = name
	if err := client.SyncContainerWithNetwork(m.ctx, &cnr, pl); err != nil {
		fmt.Errorf("sync container with the network state: %w", err)
		return err
	}
	var prmPut client.PrmContainerPut
	iAt, exp, err := gspool.TokenExpiryValue(m.ctx, pl, 100)
	sc := tokens.BuildUnsignedContainerSessionToken(iAt, iAt, exp, cid.ID{}, session.VerbContainerPut, *m.gateAccount.PublicKey())
	if err := m.TemporarySignContainerTokenWithPrivateKey(sc); err != nil {
		fmt.Errorf("%w", err)
		return err
	}
	if sc != nil {
		prmPut.WithinSession(*sc)
	} else {
		//todo: what about just providing a key or a bearer token?
	}

	fmt.Println("about to put container")
	gateSigner := user.NewAutoIDSigner(m.gateAccount.PrivateKey().PrivateKey) //fix me is this correct signer?
	// send request to save the container
	go func() {
		//todo - do this on a routine so that we don't hang
		idCnr, err := pl.ContainerPut(m.ctx, cnr, gateSigner, prmPut) //see SetWaitParams to change wait times
		if err != nil {
			fmt.Printf("save container via connection pool: %s\r\n", err)
			tmp := UXMessage{
				Title:       "Container Error",
				Type:        "error",
				Description: "Container '" + name + "' failed",
			}
			m.MakeToast(NewToastMessage(&tmp))
			m.MakeNotification(NotificationMessage{
				Title:       "Container Error",
				Type:        "error",
				Description: fmt.Sprintf("Failed to create container %s - %s", name, err.Error()),
				MarkRead:    false,
			})
			return
		}
		fmt.Println("container putted")
		fmt.Println("container created ", idCnr)

		tmp := UXMessage{
			Title:       "Container Created",
			Type:        "success",
			Description: "Container '" + name + "' created",
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
			return
		}
		fmt.Println("creating container and storing in network ", m.selectedNetwork, m.selectedNetwork.ID)
		err = cache.StoreContainer(walletAddress, m.selectedNetwork.ID, idCnr.String(), marshal)
		if err != nil {
			m.MakeNotification(NotificationMessage{
				Title:       "Container Error",
				Type:        "error",
				Description: fmt.Sprintf("Failed to store container %s - %s", name, err.Error()),
				MarkRead:    false,
			})
			return
		}
		m.MakeToast(NewToastMessage(&tmp))
		m.ContainersChanged()
	}()
	tmp := UXMessage{
		Title:       "Creating container...",
		Type:        "info",
		Description: "Container '" + name + "' is currently being created. Please wait...",
	}
	m.MakeToast(NewToastMessage(&tmp))
	m.MakeNotification(NotificationMessage{
		Title:       "Creating container...",
		Type:        "info",
		Description: "Container '" + name + "' is currently being created. Please wait...",
		MarkRead:    false,
	})
	return nil
}
