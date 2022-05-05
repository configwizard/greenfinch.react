package manager

import (
	"encoding/json"
	"fmt"
	"github.com/amlwwalker/greenfinch.react/pkg/cache"
	client2 "github.com/configwizard/gaspump-api/pkg/client"
	"github.com/configwizard/gaspump-api/pkg/filesystem"
	cid "github.com/nspcc-dev/neofs-sdk-go/container/id"
)

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
	if err := cache.StoreContainer(tmpWallet.Accounts[0].Address, containerID, marshal); err != nil {
		return err
	}
	return nil
}
