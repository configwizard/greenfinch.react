package manager

import (
	"context"
	"errors"
	"fmt"
	"math/rand"
	"strings"
	"time"


	"github.com/configwizard/gaspump-api/pkg/client"
	"github.com/configwizard/gaspump-api/pkg/filesystem"
	"github.com/configwizard/gaspump-api/pkg/wallet"
	neofscli "github.com/nspcc-dev/neofs-sdk-go/client"
	obj "github.com/nspcc-dev/neofs-sdk-go/object"
	wal "github.com/nspcc-dev/neo-go/pkg/wallet"
	"github.com/patrickmn/go-cache"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

type ProgressMessage struct {
	Id       int
	Title    string
	Progress int
	Show     bool
	Error    string
}

func NewProgressMessage(p *ProgressMessage) ProgressMessage {
	p.Id = rand.Intn(101-1) + 1
	return *p
}

type ToastMessage struct {
	Id          int
	Title       string
	Type        string
	Description string
}

func NewToastMessage(t *ToastMessage) ToastMessage {
	t.Id = rand.Intn(101-1) + 1
	return *t
}

type Manager struct {
	//walletPath, walletAddr string
	fsCli                  *neofscli.Client
	//key                    *ecdsa.PrivateKey
	c                      *cache.Cache
	ctx                    context.Context
	wallet 				*wal.Wallet
	DEBUG                  bool
}

const (
	CACHE_FILE_SYSTEM = "filesystem"
)

func (m *Manager) UnlockWallet(password string) error {
	return m.wallet.Accounts[0].Decrypt(password, m.wallet.Scrypt)
}
// startup is called at application startup
func (m *Manager) Startup(ctx context.Context) {
	// Perform your setup here
	m.ctx = ctx
	//go m.RetrieveFileSystem()
}

// domReady is called after the front-end dom has been loaded
func (m *Manager) DomReady(ctx context.Context) {
}

func (m *Manager) MakeToast(message ToastMessage) {
	runtime.EventsEmit(m.ctx, "freshtoast", message)
}

func (m *Manager) SetProgressPercentage(progressMessage ProgressMessage) {
	runtime.EventsEmit(m.ctx, "percentageProgress", progressMessage)
}
func (m *Manager) SendSignal(signalName string, signalValue interface{}) {
	fmt.Println("sending signal", signalName)
	runtime.EventsEmit(m.ctx, signalName, signalValue)
}

// shutdown is called at application termination
func (m *Manager) Shutdown(ctx context.Context) {
	// Perform your teardown here
}
func (m *Manager) Search(search string) ([]filesystem.Element, error) {
	tmpFS, found := m.c.Get(CACHE_FILE_SYSTEM)
	if !found {
		return []filesystem.Element{}, errors.New("no filesystem in cache")
	}
	var results []filesystem.Element
	//now search the filesystem for a string comparison
	for _, v := range tmpFS.([]filesystem.Element) {
		if fnAttr, ok := v.Attributes[obj.AttributeFileName]; ok {
			if strings.Contains(fnAttr, search) {
				results = append(results, v)
			}
		}
	}
	return results, nil
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
		//walletPath: walletPath,
		//walletAddr: walletAddr,
		fsCli:      cli,
		//key:        key, //this is holding the private key in memory - not good?
		c:          cache.New(1*time.Minute, 10*time.Minute),
		ctx:        nil,
		DEBUG:      DEBUG,
	}, nil
}

func (m Manager) Client() *neofscli.Client {
	return m.fsCli
}

type Account struct {
	Address string `json:"address"`
	NeoFS   struct {
		Balance   int64  `json:"balance"`
		Precision uint32 `json:"precision"`
	} `json:"neofs"`
	Nep17 map[string]wallet.Nep17Tokens `json:"nep17"'`
}

func (m *Manager) retrieveWallet() (*wal.Wallet, error) {
	if m.wallet == nil {
		tmp := NewToastMessage(&ToastMessage{
			Title:       "Lets get started",
			Type:        "info",
			Description: "Please select a wallet",
		})
		m.MakeToast(tmp)
		return nil, errors.New("no wallet selected")
	}

	return m.wallet, nil
}

func (m *Manager) GetAccountInformation() (Account, error) {
	w, err := m.retrieveWallet()
	if err != nil {
		return Account{}, err
	}
	balances, err := wallet.GetNep17Balances(w.Accounts[0].Address, wallet.RPC_TESTNET)
	//Now the neo fs gas balance
	id, err := wallet.OwnerIDFromPrivateKey(&m.wallet.Accounts[0].PrivateKey().PrivateKey)
	if err != nil {
		return Account{}, err
	}
	result, err := m.fsCli.GetBalance(m.ctx, id)
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
			Balance:   (*result.Amount()).Value(),
			Precision: (*result.Amount()).Precision(),
		}),
	}
	b.Nep17 = balances
	if m.DEBUG {
		DebugSaveJson("GetAccountInformation.json", b)
	}
	return b, nil
}
