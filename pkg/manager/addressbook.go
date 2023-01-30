package manager

import (
	"encoding/json"
	"errors"
	"github.com/amlwwalker/greenfinch.react/pkg/cache"
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
	return m.RetrieveContacts()
}
