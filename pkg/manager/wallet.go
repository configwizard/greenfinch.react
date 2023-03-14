package manager

import (
	"context"
	"errors"
	"fmt"
	"github.com/amlwwalker/greenfinch.react/pkg/cache"
	"github.com/amlwwalker/greenfinch.react/pkg/wallet"
	"github.com/nspcc-dev/neo-go/pkg/crypto/keys"
	"github.com/nspcc-dev/neo-go/pkg/encoding/address"
	"github.com/nspcc-dev/neo-go/pkg/rpcclient"
	"github.com/nspcc-dev/neo-go/pkg/rpcclient/actor"
	"github.com/nspcc-dev/neo-go/pkg/rpcclient/gas"
	"github.com/nspcc-dev/neo-go/pkg/rpcclient/nep17"
	wal "github.com/nspcc-dev/neo-go/pkg/wallet"
	"github.com/wailsapp/wails/v2/pkg/runtime"
	"math"
	"math/big"
	"os"
	"path"
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
	defer m.LockWallet()

	c, err := rpcclient.New(context.Background(), m.selectedNetwork.RpcNodes[0], rpcclient.Options{})

	if err != nil {
		return "", err
	}
	a, err := actor.NewSimple(c, m.wallet.Accounts[0])
	if err != nil {
		return "", err
	}
	n17 := nep17.New(a, gas.Hash)

	tgtAcc, err := address.StringToUint160(recipient)
	if err != nil {
		return "", err
	}
	txid, u, err := n17.Transfer(a.Sender(), tgtAcc, big.NewInt(int64(amount)), nil)
	if err != nil {
		return "", err
	}
	go func() {
		//re-use token expiration function to set the vub
		stateResponse, err := a.Wait(txid, u, err)
		if err != nil {
			m.MakeNotification(NotificationMessage{
				Title:       "Transaction failed",
				Type:        "error",
				Description: fmt.Sprintf("tranasction %s failed due to %s", txid, err),
				MarkRead:    false,
			})
			tmp := UXMessage{
				Title:       "Transaction failed",
				Type:        "error",
				Description: "transaction failed",
			}
			m.MakeToast(NewToastMessage(&tmp))
			return
		}
		runtime.EventsEmit(m.ctx, "fresh_wallet", nil)
		fmt.Printf("events %s %+v\r\n", txid, stateResponse.Events)
		fmt.Printf("stack %s %+v\r\n", txid, stateResponse.Stack)
		fmt.Printf("fault %s exception %+v\r\n", txid, stateResponse.FaultException)
		fmt.Printf("vm state %s %+v\r\n", txid, stateResponse.VMState)
		m.MakeNotification(NotificationMessage{
			Title:       "Transaction succeeded",
			Action: 	 "qr-code",
			Type:        "success",
			Description: fmt.Sprintf("tranasction %s successful", stateResponse.Container.StringLE()),
			MarkRead:    false,
		})
		tmp := UXMessage{
			Title:       "Transaction succeeded",
			Type:        "success",
			Description: "transaction succeeded",
		}
		m.MakeToast(NewToastMessage(&tmp))
	}()
	m.MakeNotification(NotificationMessage{
		Title:       "Transaction started",
		Action: 	"qr-code",
		Type:        "info",
		Description: fmt.Sprintf(path.Join(explorerUrl, "0x%s"), txid.StringLE()),
		MarkRead:    false,
	})
	tmp := UXMessage{
		Title:       "Transaction started",
		Type:        "info",
		Description: "transaction has started",
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
	fmt.Printf("key %+v\r\n", key)
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
		Title:       "Success creating wallet from 	WIF: " + w.Accounts[0].Address,
		Type:        "success",
		Description: "You will need to transfer the wallet some gas",
	}
	m.MakeToast(NewToastMessage(&tmp))

	runtime.EventsEmit(m.ctx, "fresh_wallet", w.Accounts[0])
	runtime.EventsEmit(m.ctx, "select_wallet", false)
	return nil
}
func (m *Manager) NewWallet(password string) error {
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
		return err
	}
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

	//todo - was this to get it to force update the client? Should we do the same for the pool?
	//if _, err = m.Client(); err != nil {
	//	tmp := UXMessage{
	//		Title:       "Error retrieving client",
	//		Type:        "error",
	//		Description: err.Error(),
	//	}
	//	m.MakeToast(NewToastMessage(&tmp))
	//	fmt.Println("error retrieving client: ", err)
	//	return err
	//}
	vanityWallet, err := m.GetAccountInformation()
	if err != nil {
		tmp := UXMessage{
			Title:       "Error opening wallet",
			Type:        "error",
			Description: err.Error(),
		}
		m.MakeToast(NewToastMessage(&tmp))
		return err
	}
	fmt.Printf("setting vanity wallet %+v\r\n", vanityWallet)
	runtime.EventsEmit(m.ctx, "fresh_wallet", vanityWallet)
	runtime.EventsEmit(m.ctx, "select_wallet", false)
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

