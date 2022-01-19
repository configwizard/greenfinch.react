package manager

import (
	"context"
	"crypto/ecdsa"
	"github.com/amlwwalker/gaspump-api/pkg/client"
	"github.com/amlwwalker/gaspump-api/pkg/wallet"
	neofscli "github.com/nspcc-dev/neofs-sdk-go/client"
)

type Manager struct {
	walletPath, walletAddr string
	cli *neofscli.Client
	key *ecdsa.PrivateKey
	ctx context.Context
}

// startup is called at application startup
func (m *Manager) Startup(ctx context.Context) {
	// Perform your setup here
	m.ctx = ctx
}

// domReady is called after the front-end dom has been loaded
func (m *Manager) DomReady(ctx context.Context) {
	// Add your action here
}

// shutdown is called at application termination
func (m *Manager) Shutdown(ctx context.Context) {
	// Perform your teardown here
}

func NewFileSystemManager(walletPath, walletAddr, password string) (*Manager, error) {
	// First obtain client credentials: private key of request owner
	key, err := wallet.GetCredentialsFromPath(walletPath, walletAddr, password)
	if err != nil {
		return &Manager{}, err
	}
	cli, err := client.NewClient(key, client.TESTNET)
	if err != nil {
		return &Manager{}, err
	}

	return &Manager{
		walletPath: walletPath,
		walletAddr: walletAddr,
		cli: cli,
		key: key,
		ctx: context.Background(),
	}, nil
}

func (m Manager) Client() *neofscli.Client {
	return m.cli
}
type Balance struct{
	Balance   int64
	Precision uint32
}
func (m *Manager) GetNeoFSBalance() (Balance, error) {

	id, err := wallet.OwnerIDFromPrivateKey(m.key)
	if err != nil {
		return Balance{}, err
	}
	ctx := context.Background()
	result, err := m.cli.GetBalance(ctx, id)
	if err != nil {
		return Balance{}, err
	}
	var b = Balance{
		(*result.Amount()).Value(),
		(*result.Amount()).Precision(),
	}
	return b, nil
}

