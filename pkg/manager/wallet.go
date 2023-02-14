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

	"github.com/nspcc-dev/neo-go/pkg/rpcclient"
	wal "github.com/nspcc-dev/neo-go/pkg/wallet"
	"github.com/wailsapp/wails/v2/pkg/runtime"
	"math"
	"os"
)

func (m *Manager) RecentWallets() (map[string]string, error) {
	return cache.RecentWallets()
}

func (m *Manager) TransferToken(recipient string, amount float64) (string, error) {
	if m.Wallet == nil {
		return "", errors.New("no wallet selected")
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

	c, err := rpcclient.New(context.Background(), string(wallet.RPC_TESTNET), rpcclient.Options{})

	if err != nil {
		return "", err
	}
	a, err := actor.NewSimple(c, m.Wallet.Accounts[0])
	if err != nil {
		return "", err
	}
	n17 := nep17.New(a, gas.Hash)

	tgtAcc, err := address.StringToUint160(recipient)
	if err != nil {
		return "", err
	}
	txid, _, err := n17.Transfer(a.Sender(), tgtAcc, big.NewInt(int64(amount)), nil)
	if err != nil {
		fmt.Println("error from transferring token function!")
		tmp := UXMessage{
			Title:       "Transfer failed",
			Type:        "error",
			Description: err.Error(),
		}
		m.MakeToast(NewToastMessage(&tmp))
		return "", err
	}
	///0x00b423ecc65fe04573b3c3d972497913ee247c476a7db95d8575cf74cf1b5039
	m.MakeNotification(NotificationMessage{
		Title:       "Transaction started",
		Action: 	"qr-code",
		Type:        "success",
		Description: fmt.Sprintf(path.Join(explorerUrl, "0x%s"), txid.StringLE()),
		MarkRead:    false,
	})
	m.MakeToast(NewToastMessage(&UXMessage{
		Title:       "Transfer started",
		Type:        "success",
		Description: "Wait for transaction to complete",
	}))

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
	token, err := m.TransferToken("NZAUkYbJ1Cb2HrNmwZ1pg9xYHBhm2FgtKV", amount)
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
	m.Wallet = w
	if err := cache.CreateWalletBucket(m.Wallet.Accounts[0].Address, filepath); err != nil {
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
	//if _, err = m.Client(); err != nil {
	//	fmt.Println("error retrieving client: ", err)
	//	return err
	//}
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
			Description: err.Error(),
		}
		m.MakeToast(NewToastMessage(&tmp))
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
		return err
	}
	m.password = password
	m.Wallet = w

	if err := cache.CreateWalletBucket(m.Wallet.Accounts[0].Address, filepath); err != nil {
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
