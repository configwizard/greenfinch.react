package database

import "errors"

type MockDB struct {
	recentWallets map[string][]byte
	data          map[string]map[string]map[string]map[string][]byte
}

func NewMockDB() *MockDB {
	return &MockDB{
		data: make(map[string]map[string]map[string]map[string][]byte),
	}
}

func (m *MockDB) CreateWalletBucket(walletId, walletLocation string) error {
	// Simulating the creation of recentWallets bucket and adding wallet
	if m.recentWallets == nil {
		m.recentWallets = make(map[string][]byte)
	}
	m.recentWallets[walletId] = []byte(walletLocation)

	for _, network := range []string{mainnetBucket, testnetBucket} {
		if m.data[network] == nil {
			m.data[network] = make(map[string]map[string]map[string][]byte)
		}

	}
	//we don't need to create every bucket for every wallet for every network immediately
	//just make sure we have the networks at this stage
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

func (m *MockDB) DeleteRecentWallet(walletId string) error {
	if m.recentWallets != nil {
		delete(m.recentWallets, walletId)
	}
	return nil
}

// CRUD

func (m *MockDB) Create(network, walletId, bucket, identifier string, payload []byte) error {
	// Ensure the network bucket exists
	if m.data[network] == nil {
		m.data[network] = make(map[string]map[string]map[string][]byte)
	}

	// Ensure the wallet bucket exists
	if m.data[network][walletId] == nil {
		m.data[network][walletId] = make(map[string]map[string][]byte)
	}

	// Ensure the specific bucket exists
	if m.data[network][walletId][bucket] == nil {
		m.data[network][walletId][bucket] = make(map[string][]byte)
	}

	// Store the payload
	m.data[network][walletId][bucket][identifier] = payload
	return nil
}

func (m *MockDB) Read(network, walletId, bucket, identifier string) ([]byte, error) {
	if m.data[network] == nil || m.data[network][walletId] == nil || m.data[network][walletId][bucket] == nil {
		//can't exist
		return nil, errors.New(ErrorNotFound)
	}
	payload, ok := m.data[network][walletId][bucket][identifier]
	if !ok {
		return nil, errors.New(ErrorNotFound)
	}
	return payload, nil
}
func (m *MockDB) ReadAll(network, walletId, bucket string) (map[string][]byte, error) {
	if m.data[network] == nil || m.data[network][walletId] == nil || m.data[network][walletId][bucket] == nil {
		//can't exist
		return nil, errors.New(ErrorNotFound)
	}
	payload, ok := m.data[network][walletId][bucket]
	if !ok {
		return nil, errors.New(ErrorNotFound)
	}
	return payload, nil
}

func (m *MockDB) Update(network, walletId, bucket, identifier string, payload []byte) error {
	return m.Create(bucket, network, walletId, identifier, payload) // Reuse Create for simplicity
}

func (m *MockDB) Pend(network, walletId, bucket, identifier string, payload []byte) error {
	// Implement specific logic for Pend if different from Update
	return m.Create(bucket, network, walletId, identifier, payload)
}

func (m *MockDB) Delete(network, walletId, bucket, id string) error {
	if m.data[network] == nil || m.data[network][walletId] == nil || m.data[network][walletId][bucket] == nil {
		//can't exist
		return errors.New(ErrorNotFound)
	}
	if _, ok := m.data[network][walletId][bucket][id]; ok {
		delete(m.data[network][walletId][bucket], id)
		return nil
	}
	return errors.New(ErrorNotFound)
}

func (m *MockDB) DeleteAll(network, walletId, bucket string) error {
	if m.data[network] == nil || m.data[network][walletId] == nil || m.data[network][walletId][bucket] == nil {
		//can't exist
		return errors.New(ErrorNotFound)
	}
	delete(m.data[network][walletId], bucket)
	return nil
}
