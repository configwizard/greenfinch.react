package manager

import (
	"context"
	"errors"
	"fmt"
	"github.com/amlwwalker/greenfinch.react/pkg/cache"
	"github.com/amlwwalker/greenfinch.react/pkg/wallet"
	"github.com/nspcc-dev/neo-go/pkg/encoding/address"
	"github.com/nspcc-dev/neo-go/pkg/rpcclient/actor"
	"github.com/nspcc-dev/neo-go/pkg/rpcclient/gas"
	"github.com/nspcc-dev/neo-go/pkg/rpcclient/nep17"
	"math/big"
	"path"
	"path/filepath"

	"github.com/nspcc-dev/neo-go/pkg/rpcclient"
	wal "github.com/nspcc-dev/neo-go/pkg/wallet"
	"github.com/wailsapp/wails/v2/pkg/runtime"
	"math"
	"os"
)

func (m *Manager) RecentWallets() (map[string]string, error) {
	recentWallets, err := cache.RecentWallets()
	if err != nil {
		return recentWallets, err
	}
	for k, v := range recentWallets {
		recentWallets[k] = filepath.Base(v)
	}
	for k, v := range recentWallets {
		fmt.Println("recent wallets ", k, v, recentWallets[k])
	}
	return recentWallets, nil
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
		Description: "You will need to transfer the wallet some gas. Then you will need to transfer to NeoFS. Your wallet",
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
