package database

import (
	"errors"
	"fmt"
	"sync"
)

type MockDB struct {
	network, walletId string
	walletLocation    string
	recentWallets     map[string][]byte
	data              map[string]map[string]map[string]map[string][]byte
	mutex             *sync.Mutex
}

func NewUnregisteredMockDB() *MockDB {
	return &MockDB{
		data:  make(map[string]map[string]map[string]map[string][]byte),
		mutex: &sync.Mutex{},
	}
}
func (m *MockDB) Register(network, address, location string) {
	m.network = network
	m.walletId = address
	m.walletLocation = location
}

func NewMockDB(network, walletId, walletLocation string) *MockDB {
	return &MockDB{
		network:        network,
		walletId:       walletId,
		walletLocation: walletLocation,
		data:           make(map[string]map[string]map[string]map[string][]byte),
		mutex:          &sync.Mutex{},
	}
}

func (m *MockDB) CreateWalletBucket() error {
	// Simulating the creation of recentWallets bucket and adding wallet
	if m.recentWallets == nil {
		m.recentWallets = make(map[string][]byte)
	}
	m.recentWallets[m.walletId] = []byte(m.walletLocation)

	for _, network := range []string{MainnetBucket, TestnetBucket} {
		if m.data[network] == nil {
			m.data[network] = make(map[string]map[string]map[string][]byte)
		}

	}
	//we don't need to create every bucket for every wallet for every network immediately
	//just make sure we have the networks at this stage
	fmt.Printf("database created %+v -- %+v\r\n", m.recentWallets, m.data)
	return nil
}

func (m *MockDB) RecentWallets() (map[string]string, error) {
	wallets := make(map[string]string)
	if m.recentWallets != nil {
		for wallet, walletLocation := range m.recentWallets {
			wallets[wallet] = string(walletLocation)
		}
	}
	return wallets, nil
}

func (m *MockDB) DeleteRecentWallet() error {
	if m.recentWallets != nil {
		delete(m.recentWallets, m.walletId)
	}
	return nil
}

// CRUD

func (m *MockDB) Create(bucket, identifier string, payload []byte) error {
	m.mutex.Lock()
	// Ensure the network bucket exists
	if m.data[m.network] == nil {
		m.data[m.network] = make(map[string]map[string]map[string][]byte)
	}

	// Ensure the wallet bucket exists
	if m.data[m.network][m.walletId] == nil {
		m.data[m.network][m.walletId] = make(map[string]map[string][]byte)
	}

	// Ensure the specific bucket exists
	if m.data[m.network][m.walletLocation][bucket] == nil {
		m.data[m.network][m.walletId][bucket] = make(map[string][]byte)
	}

	// Store the payload

	m.data[m.network][m.walletId][bucket][identifier] = payload
	m.mutex.Unlock()
	return nil
}

func (m *MockDB) Select(bucket, identifier string) ([]byte, error) {
	if m.data[m.network] == nil || m.data[m.network][m.walletId] == nil || m.data[m.network][m.walletId][bucket] == nil {
		//can't exist
		return nil, errors.New(ErrorNotFound)
	}
	payload, ok := m.data[m.network][m.walletId][bucket][identifier]
	if !ok {
		return nil, errors.New(ErrorNotFound)
	}
	return payload, nil
}
func (m *MockDB) SelectAll(bucket string) (map[string][]byte, error) {
	if m.data[m.network] == nil || m.data[m.network][m.walletId] == nil || m.data[m.network][m.walletLocation][bucket] == nil {
		//can't exist
		return nil, errors.New(ErrorNotFound)
	}
	payload, ok := m.data[m.network][m.walletLocation][bucket]
	if !ok {
		return nil, errors.New(ErrorNotFound)
	}
	return payload, nil
}

func (m *MockDB) Update(bucket, identifier string, payload []byte) error {
	return m.Create(bucket, identifier, payload) // Reuse Create for simplicity
}

func (m *MockDB) Pend(bucket, identifier string, payload []byte) error {
	// Implement specific logic for Pend if different from Update
	return m.Create(bucket, identifier, payload)
}

func (m *MockDB) Delete(bucket, id string) error {
	if m.data[m.network] == nil || m.data[m.network][m.walletId] == nil || m.data[m.network][m.walletId][bucket] == nil {
		//can't exist
		return errors.New(ErrorNotFound)
	}
	if _, ok := m.data[m.network][m.walletId][bucket][id]; ok {
		delete(m.data[m.network][m.walletId][bucket], id)
		return nil
	}
	return errors.New(ErrorNotFound)
}

func (m *MockDB) DeleteAll(bucket string) error {
	if m.data[m.network] == nil || m.data[m.network][m.walletId] == nil || m.data[m.network][m.walletLocation][bucket] == nil {
		//can't exist
		return errors.New(ErrorNotFound)
	}
	delete(m.data[m.network][m.walletLocation], bucket)
	return nil
}
