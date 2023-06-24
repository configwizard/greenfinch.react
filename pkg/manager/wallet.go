package manager

import (
	"context"
	"errors"
	"fmt"
	"github.com/amlwwalker/greenfinch.react/pkg/cache"
	"github.com/amlwwalker/greenfinch.react/pkg/wallet"
	"github.com/nspcc-dev/neo-go/pkg/core/block"
	"github.com/nspcc-dev/neo-go/pkg/core/state"
	"github.com/nspcc-dev/neo-go/pkg/crypto/keys"
	"github.com/nspcc-dev/neo-go/pkg/encoding/address"
	"github.com/nspcc-dev/neo-go/pkg/neorpc"
	"github.com/nspcc-dev/neo-go/pkg/rpcclient"
	"github.com/nspcc-dev/neo-go/pkg/rpcclient/actor"
	"github.com/nspcc-dev/neo-go/pkg/rpcclient/gas"
	"github.com/nspcc-dev/neo-go/pkg/rpcclient/nep17"
	"math/big"
	"sync"

	//"github.com/nspcc-dev/neo-go/pkg/rpcclient"
	wal "github.com/nspcc-dev/neo-go/pkg/wallet"
	"github.com/wailsapp/wails/v2/pkg/runtime"
	"math"
	//"math/big"
	"os"
	"path/filepath"
)

type cleanedWallet struct {
	Path string
	Name string
}
func (m *Manager) DeleteRecentWallet(walletId string) error {
	return cache.DeleteRecentWallet(walletId)
}
func (m *Manager) RecentWallets() (map[string]cleanedWallet, error) {
	recentWallets, err := cache.RecentWallets()
	if err != nil {
		return map[string]cleanedWallet{}, err //wallet address => filepath[shortName]
	}
	cleanWallets := make(map[string]cleanedWallet)
	for k, v := range recentWallets {
		cleaned := cleanedWallet{
			Path: v,
			Name: filepath.Base(v),
		}
		cleanWallets[k] = cleaned
	}
	fmt.Print("cleaned wallets ", cleanWallets)
	return cleanWallets, nil
}

func (m *Manager) TransferToken(recipient string, amount float64) (string, error) {
	if m.wallet == nil {
		return "", errors.New("no wallet provided")
	}
	if err := m.UnlockWallet(); err != nil {
		tmp := UXMessage{
			Title:       "Error unlocking wallet",
			Type:        "error",
			Description: err.Error(),
		}
		m.MakeToast(NewToastMessage(&tmp))
		return "", err
	}
	//defer m.LockWallet()

	//c, err := rpcclient.New(context.Background(), m.selectedNetwork.RpcNodes[0], rpcclient.Options{})
	c2, err := rpcclient.NewWS(context.Background(), string(wallet.RPC_WEBSOCKET), rpcclient.Options{})

	if err != nil {
		fmt.Println("error creating ws ", err)
		return "", err
	}

	st := "HALT"
	id, err := c2.SubscribeForTransactionExecutions(&st)
	if err != nil {
		return "", err
	}

	wg := sync.WaitGroup{}
	wg.Add(1)
	go func() {
		defer wg.Done()
		tr := <- c2.Notifications
		switch tr.Type {
			case neorpc.BlockEventID:
				notification := tr.Value.(block.Block)
				fmt.Printf("BlockEventID %+v - %s\r\n", notification, id)
			case neorpc.TransactionEventID:
				//is this where i can confirm a transaction has been attached to the blockchain?
				notification := tr.Value.(rpcclient.Notification)
				fmt.Printf("TransactionEventID %+v - %s\r\n", notification, id)
				//c2.Unsubscribe(id)
			case neorpc.NotificationEventID:
				notification := tr.Value.(rpcclient.Notification)
				fmt.Printf("NotificationEventID %+v - %s\r\n", notification, id)
			case neorpc.ExecutionEventID:
				notification := tr.Value.(*state.AppExecResult)
				fmt.Printf("ExecutionEventID %+v - %s\r\n", notification, id)
		}
	}()

	//c, err := rpcclient.New(context.Background(), string(wallet.RPC_TESTNET), rpcclient.Options{})

	//c2, err := rpcclient.NewWS(context.Background(), string(wallet.RPC_WEBSOCKET), rpcclient.Options{})

	if err != nil {
		tmp := UXMessage{
			Title:       "Transaction failed",
			Type:        "error",
			Description: err.Error(),
		}
		m.MakeToast(NewToastMessage(&tmp))
		return "", err
	}
	a, err := actor.NewSimple(c2, m.wallet.Accounts[0])
	if err != nil {
		tmp := UXMessage{
			Title:       "Transaction failed",
			Type:        "error",
			Description: err.Error(),
		}
		m.MakeToast(NewToastMessage(&tmp))
		return "", err
	}
	n17 := nep17.New(a, gas.Hash)

	tgtAcc, err := address.StringToUint160(recipient)
	if err != nil {
		tmp := UXMessage{
			Title:       "Transaction failed",
			Type:        "error",
			Description: err.Error(),
		}
		m.MakeToast(NewToastMessage(&tmp))
		return "", err
	}
	txid, u, err := n17.Transfer(a.Sender(), tgtAcc, big.NewInt(int64(amount)), nil)
	if err != nil {
		tmp := UXMessage{
			Title:       "Transaction failed",
			Type:        "error",
			Description: err.Error(),
		}
		m.MakeToast(NewToastMessage(&tmp))
		return "", err
	}
	var url string = testNetExplorerUrl
	if m.selectedNetwork.ID == "mainnet" {
		url = mainnetExplorerUrl
	}
	go func() {
		//re-use token expiration function to set the vub
		stateResponse, err := a.Wait(txid, u, err)
		if err != nil {
			m.MakeNotification(NotificationMessage{
				Title:       "Transaction failed",
				Type:        "error",
				Description: fmt.Sprintf("The transaction %s failed, due to %s", txid, err),
				MarkRead:    false,
			})
			tmp := UXMessage{
				Title:       "Transaction failed",
				Type:        "error",
				Description: "The transaction failed.",
			}
			m.MakeToast(NewToastMessage(&tmp))
			return
		}
		runtime.EventsEmit(m.ctx, "fresh_wallet", nil)
		fmt.Printf("events %s %+v\r\n", txid, stateResponse.Events)
		fmt.Printf("stack %s %+v\r\n", txid, stateResponse.Stack)
		fmt.Printf("fault %s exception %+v\r\n", txid, stateResponse.FaultException)
		fmt.Printf("vm state %s %+v\r\n", txid, stateResponse.VMState)
		meta :=  make(map[string]string)
		meta["url"] = url
		meta["txid"] = stateResponse.Container.StringLE()
		m.MakeNotification(NotificationMessage{
			Title:       "Transaction successful",
			Action: 	 "qr-code",
			Type:        "success",
			Meta: meta,
			Description: fmt.Sprintf("The transaction %s was successful", stateResponse.Container.StringLE()),
			MarkRead:    false,
		})
		tmp := UXMessage{
			Title:       "Transaction successful",
			Type:        "success",
			Description: "Transaction successful",
		}
		m.MakeToast(NewToastMessage(&tmp))
	}()

	meta :=  make(map[string]string)
	meta["url"] = url
	meta["txid"] = txid.StringLE()
	m.MakeNotification(NotificationMessage{
		Title:       "Transaction started...",
		Action: 	"qr-code",
		Type:        "info",
		Meta: meta,
		Description: fmt.Sprintf("The transaction %s has started", txid.StringLE()),
		MarkRead:    false,
	})
	tmp := UXMessage{
		Title:       "Transaction started...",
		Type:        "info",
		Description: "The transaction has started.",
	}
	m.MakeToast(NewToastMessage(&tmp))
	fmt.Println("txid ", txid.StringLE())
	return txid.StringLE(), err
}

//todo - terrible name if this is to topup NeoFS Gas
func (m *Manager) TopUpNeoWallet(amount float64) (string, error) {
	if amount == 0 {
		amount = 1_00_000_000 // 1 GAS
	} else {
		amount = math.Floor(amount * math.Pow(10, 8))
	}
	token, err := m.TransferToken(m.selectedNetwork.Address, amount)
	if err != nil {
		fmt.Println("transfer token error ", err)
	}
	return token, err
}
func (m *Manager) NewWalletFromWIF(password, wif, filepath string) error {
	key, err := keys.NewPrivateKeyFromWIF(wif)
	if err != nil {
		return err
	}
	privKey := keys.PrivateKey{PrivateKey: key.PrivateKey}
	a := wal.NewAccountFromPrivateKey(&privKey)
	w, err := wal.NewWallet(filepath) // < -- this saves an empty file
	if err != nil {
		return err
	}
	w.AddAccount(a)

	if err := a.Encrypt(password, w.Scrypt); err != nil {
		return err
	}
	if err := w.Save(); err != nil {
		return err
	}
	tmp := UXMessage{
		Title:       "Success creating wallet",
		Type:        "success",
		Description: "To use it, load it from file",
	}
	m.MakeToast(NewToastMessage(&tmp))

	//runtime.EventsEmit(m.ctx, "fresh_wallet", w.Accounts[0])
	//runtime.EventsEmit(m.ctx, "select_wallet", false)
	return nil
}
func (m *Manager) NewWallet(password, filepath string) error {
	if filepath == "" {
		fmt.Println("no filepath. Bailing out")
		return nil
	}
	w, err := wallet.GenerateNewSecureWallet(filepath, "", password)
	if err != nil {
		tmp := UXMessage{
			Title:       "Error creating wallet",
			Type:        "error",
			Description: err.Error(),
		}
		m.MakeToast(NewToastMessage(&tmp))
		return err
	}
	m.password = password
	m.wallet = w
	if err := cache.CreateWalletBucket(m.wallet.Accounts[0].Address, filepath); err != nil {
		tmp := UXMessage{
			Title:       "Error setting wallet database",
			Type:        "error",
			Description: err.Error(),
		}
		m.MakeToast(NewToastMessage(&tmp))
		return err
	}
	tmp := UXMessage{
		Title:       "Success creating wallet: " + w.Accounts[0].Address,
		Type:        "success",
		Description: "You will need to transfer the wallet some gas",
	}
	m.MakeToast(NewToastMessage(&tmp))

	runtime.EventsEmit(m.ctx, "fresh_wallet", w.Accounts[0])
	runtime.EventsEmit(m.ctx, "select_wallet", false)

	return nil
}

func (m *Manager) LoadWalletWithPath(password, filepath string) error {
	w, err := wal.NewWalletFromFile(filepath)
	if err != nil {
		tmp := UXMessage{
			Title:       "Error reading wallet",
			Type:        "error",
			Description: "Greenfinch could not open your wallet",
		}
		m.MakeToast(NewToastMessage(&tmp))
		m.MakeNotification(NotificationMessage{
			Title:       "Error reading wallet",
			Type:        "error",
			Description: "Error " + err.Error(),
		})
		return err
	}
	err = w.Accounts[0].Decrypt(password, w.Scrypt)
	if err != nil {
		tmp := UXMessage{
			Title:       "Error unlocking wallet",
			Type:        "error",
			Description: err.Error(),
		}
		m.MakeToast(NewToastMessage(&tmp))
		m.MakeNotification(NotificationMessage{
			Title:       "Error unlocking wallet",
			Type:        "error",
			Description: "Error " + err.Error(),
		})
		return err
	}
	m.password = password
	m.wallet = w

	if err := cache.CreateWalletBucket(m.wallet.Accounts[0].Address, filepath); err != nil {
		tmp := UXMessage{
			Title:       "Error setting wallet database",
			Type:        "error",
			Description: err.Error(),
		}
		m.MakeToast(NewToastMessage(&tmp))
		return err
	}
	tmp := UXMessage{
		Title:       "Success reading wallet",
		Type:        "success",
		Description: "Using wallet: " + w.Accounts[0].Address,
	}
	m.MakeToast(NewToastMessage(&tmp))

	go func() {
		vanityWallet, err := m.GetAccountInformation()
		if err != nil {
			tmp := UXMessage{
				Title:       "Error opening wallet",
				Type:        "error",
				Description: err.Error(),
			}
			m.MakeToast(NewToastMessage(&tmp))
		}
		fmt.Printf("setting vanity wallet %+v\r\n", vanityWallet)
		runtime.EventsEmit(m.ctx, "fresh_wallet", vanityWallet)
		runtime.EventsEmit(m.ctx, "select_wallet", false)
	}()

	return nil
}
func (m *Manager) LoadWallet(password string) error {
	homeDir, err := os.UserHomeDir()
	filepath, err := runtime.OpenFileDialog(m.ctx, runtime.OpenDialogOptions{
		DefaultDirectory:           homeDir,
		Title:                      "Choose a wallet",
		Filters:                    nil,
		ShowHiddenFiles:            false,
		CanCreateDirectories:       false,
		ResolvesAliases:            true,
		TreatPackagesAsDirectories: false,
	})
	if err != nil {
		tmp := UXMessage{
			Title:       "Error finding wallet",
			Type:        "error",
			Description: err.Error(),
		}
		m.MakeToast(NewToastMessage(&tmp))
		return err
	}
	return m.LoadWalletWithPath(password, filepath)
}

//firstly call this to get a filepath
//then once the filepath is returned to the frontend, call the modal to get a password
//then finally from the frontend call return m.LoadWalletWithPath(password, filepath)
//wallet loaded.
func (m *Manager) LoadWalletWithoutPassword() (string, error) {
	homeDir, err := os.UserHomeDir()
	filepath, err := runtime.OpenFileDialog(m.ctx, runtime.OpenDialogOptions{
		DefaultDirectory:           homeDir,
		Title:                      "Choose a wallet",
		Filters:                    nil,
		ShowHiddenFiles:            false,
		CanCreateDirectories:       false,
		ResolvesAliases:            true,
		TreatPackagesAsDirectories: false,
	})
	if err != nil {
		tmp := UXMessage{
			Title:       "Error finding wallet",
			Type:        "error",
			Description: err.Error(),
		}
		m.MakeToast(NewToastMessage(&tmp))
		return "", err
	}
	return filepath, nil
}
//firstly call this to get a filepath
//then once the filepath is returned to the frontend, call the modal to get a password
//then finally from the frontend call return m.LoadWalletWithPath(password, filepath)
//wallet loaded.
func (m *Manager) SaveWalletWithoutPassword() (string, error) {
	homeDir, err := os.UserHomeDir()
	fmt.Println("saving to ")
	filepath, err := runtime.SaveFileDialog(m.ctx, runtime.SaveDialogOptions{
		DefaultDirectory:           homeDir,
		DefaultFilename:            "wallet.json",
		Title:                      "Choose where to save file to",
		Filters:                    nil,
		ShowHiddenFiles:            false,
		CanCreateDirectories:       true,
		TreatPackagesAsDirectories: false,
	})
	if err != nil {
		return "", err
	}
	if filepath == "" {
		fmt.Println("no filepath. Bailing out")
		return "", nil
	}
	return filepath, nil
}

