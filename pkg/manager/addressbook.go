package manager

import (
	"encoding/json"
	"errors"
	"fmt"
	"github.com/amlwwalker/greenfinch.react/pkg/cache"
	"github.com/amlwwalker/greenfinch.react/pkg/wallet"
	"github.com/wailsapp/wails/v2/pkg/runtime"
	"os"
)

type contact struct {
	FirstName     string `json:"firstName""`
	LastName      string `json:"lastName"`
	WalletAddress string `json:"walletAddress"`
	PublicKey     string `json:"publicKey"`
}

func (m *Manager) RetrieveContacts() ([]contact, error) {
	if m.wallet == nil {
		return []contact{}, errors.New("no wallet loaded")
	}
	w := m.wallet.Accounts[0].Address
	res, err := cache.RetrieveContacts(w)
	if err != nil {
		return []contact{}, err
	}
	var c []contact
	for _, v := range res {
		var tmp contact
		err := json.Unmarshal(v, &tmp)
		if err != nil {
			continue
		}
		c = append(c, tmp)
	}
	return c, nil
}

func (m *Manager) RetrieveContactByWalletAddress(walletAddress string) (contact, error) {
	if m.wallet == nil {
		return contact{}, errors.New("no wallet loaded")
	}
	w := m.wallet.Accounts[0].Address
	byt, err := cache.RetrieveContact(w, walletAddress)
	var c contact
	if err != nil {
		return c, err
	}
	if err := json.Unmarshal(byt, &c); err != nil {
		return c, err
	}
	return c, nil
}

func (m *Manager) ImportContactCard() (contact, error) {
	homeDir, err := os.UserHomeDir()

	filepath, err := runtime.OpenFileDialog(m.ctx, runtime.OpenDialogOptions{
		DefaultDirectory:           homeDir,
		Title:                      "Choose a file to upload",
		Filters:                    nil,
		ShowHiddenFiles:            false,
		ResolvesAliases:            true,
		TreatPackagesAsDirectories: false,
	})
	if err != nil {
		return contact{}, err
	}
	if filepath == "" {
		fmt.Println("no upload filepath. Bailing out")
		return contact{}, err
	}
	dat, err := os.ReadFile(filepath)
	if err != nil {
		return contact{}, err
	}
	var c contact
	if err := json.Unmarshal(dat, &c); err != nil {
		return contact{}, err
	}
	if err := cache.StoreContact(m.wallet.Accounts[0].Address, c.WalletAddress, dat); err != nil {
		return contact{}, err
	}
	return c, nil
}
func (m *Manager) ExportOwnContactCard(firstname, lastname string) (contact, error){
	c := contact{
		//todo get the user to complete their details
		FirstName: firstname,
		LastName: lastname,
		WalletAddress: m.wallet.Accounts[0].Address,
		PublicKey:     wallet.ByteArrayToString(m.wallet.Accounts[0].PrivateKey().PublicKey().Bytes()),
	}
	return m.ExportContactCard(c)
}

func (m *Manager) ExportContactCard(c contact) (contact, error) {
	homeDir, err := os.UserHomeDir()
	filepath, err := runtime.SaveFileDialog(m.ctx, runtime.SaveDialogOptions{
		DefaultDirectory:           homeDir,
		Title:                      "Choose where to save contact to",
		Filters:                    nil,
		ShowHiddenFiles:            false,
		CanCreateDirectories:       false,
		TreatPackagesAsDirectories: false,
	})
	if err != nil {
		return contact{}, err
	}
	if filepath == "" {
		fmt.Println("no upload filepath. Bailing out")
		return contact{}, err
	}

	marshaledContact, err := json.Marshal(c)
	if err != nil {
		return contact{}, err
	}

	if err := os.WriteFile(filepath, marshaledContact, 0644); err != nil {
		return contact{}, err
	}
	return c, nil
}
func (m *Manager) AddContact(firstName, lastName, walletAddress, publicKey string) ([]contact, error) {
	if m.wallet == nil {
		return []contact{}, errors.New("no wallet loaded")
	}
	w := m.wallet.Accounts[0].Address
	c := contact{
		FirstName:     firstName,
		LastName:      lastName,
		WalletAddress: walletAddress,
		PublicKey:     publicKey,
	}
	byt, err := json.Marshal(c)
	if err != nil {
		return []contact{}, err
	}
	if err := cache.StoreContact(w, walletAddress, byt); err != nil {
		return []contact{}, err
	}
	return m.RetrieveContacts()
}

func (m *Manager) DeleteContact(walletAddress string) ([]contact, error) {
	if m.wallet == nil {
		return []contact{}, errors.New("no wallet loaded")
	}
	w := m.wallet.Accounts[0].Address
	err := cache.DeleteContact(w, walletAddress)
	if err != nil {
		return []contact{}, err
	}
	m.MakeToast(NewToastMessage(&UXMessage{
		Title:       "Contact deleted",
		Type:        "success",
		Description: "Deleted " + walletAddress,
		Closure:     false,
	}))
	return m.RetrieveContacts()
}
