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
	fsCli                  *neofscli.Client
	key                    *ecdsa.PrivateKey
	ctx context.Context
	DEBUG bool
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

func NewFileSystemManager(walletPath, walletAddr, password string, DEBUG bool) (*Manager, error) {
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
		fsCli:      cli,
		key:        key, //this is holding the private key in memory - not good?
		ctx:        context.Background(),
		DEBUG: DEBUG,
	}, nil
}

func (m Manager) Client() *neofscli.Client {
	return m.fsCli
}
type Account struct{
	Address string `json:"address"`
	NeoFS struct{
		Balance   int64 `json:"balance"`
		Precision uint32 `json:"precision"`
	} `json:"neofs"`
	Nep17 map[string]wallet.Nep17Tokens `json:"nep17"'`

}
func (m *Manager) GetAccountInformation() (Account, error) {


	w, err := wallet.RetrieveWallet(m.walletPath)
	if err != nil {
		return Account{}, err
	}
	balances, err := wallet.GetNep17Balances(w.Accounts[0].Address, wallet.RPC_TESTNET)
	//Now the neo fs gas balance
	id, err := wallet.OwnerIDFromPrivateKey(m.key)
	if err != nil {
		return Account{}, err
	}
	ctx := context.Background()
	result, err := m.fsCli.GetBalance(ctx, id)
	if err != nil {
		return Account{}, err
	}
	//now create an account object
	var b = Account{
		Address: w.Accounts[0].Address,
		NeoFS: struct {
			Balance   int64  `json:"balance"`
			Precision uint32 `json:"precision"`
		}(struct {
			Balance   int64
			Precision uint32
		}{
			Balance: (*result.Amount()).Value(),
			Precision: (*result.Amount()).Precision(),
		}),
	}
	b.Nep17 = balances
	if m.DEBUG {
		DebugSaveJson("GetAccountInformation.json", b)
	}
	return b, nil
}

