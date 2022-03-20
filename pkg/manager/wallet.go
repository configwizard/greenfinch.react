package manager

import (
	"fmt"
	"github.com/configwizard/gaspump-api/pkg/wallet"
	"github.com/nspcc-dev/neo-go/pkg/core/native/nativenames"
	walletClient "github.com/nspcc-dev/neo-go/pkg/rpc/client"
	wal "github.com/nspcc-dev/neo-go/pkg/wallet"
	"github.com/wailsapp/wails/v2/pkg/runtime"
	"math"
	"os"
)

func (m *Manager) TopUpNeoWallet(amount float64) (string, error){
	if amount == 0 {
		amount = 1_00_000_000 // 1 GAS
	} else {
		amount = math.Floor(amount * math.Pow(10, 8))
	}
	w, err := m.retrieveWallet()
	if err != nil {
		return "", err
	}
	w.Accounts[0].Decrypt("password", w.Scrypt) //todo this line must go. Wallet must be decrypted at source - possibly with timeout for new password requirement
	cli, err := walletClient.New(m.ctx, string(wallet.RPC_TESTNET), walletClient.Options{})
	if err != nil {
		return "", err
	}
	err = cli.Init()
	if err != nil {
		return "", err
	}

	gasToken, err := cli.GetNativeContractHash(nativenames.Gas)
	if err != nil {
		return "", err
	}
	//send 1 GAS (precision 8) to NeoFS wallet
	//neoFSWallet := ""
	token, err := wallet.TransferToken(w.Accounts[0], int64(amount), "NadZ8YfvkddivcFFkztZgfwxZyKf1acpRF", gasToken, wallet.RPC_TESTNET)
	if err != nil {
		tmp := ToastMessage{
			Title:       "Transfer failed",
			Type:        "error",
			Description: err.Error(),
		}
		m.MakeToast(NewToastMessage(&tmp))
		return "", err
	}
	tmp := ToastMessage{
		Title:       "Transfer successful",
		Type:        "success",
		Description: "TxID: " + token,
	}
	m.MakeToast(NewToastMessage(&tmp))
	return token, nil
}
func (m *Manager) NewWallet(password string) error {
	homeDir, err := os.UserHomeDir()
	fmt.Println("saving to ", )
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
	w, err := wallet.GenerateNewSecureWallet(filepath, "", password)
	if err != nil {
		tmp := ToastMessage{
			Title:       "Error creating wallet",
			Type:        "error",
			Description: err.Error(),
		}
		m.MakeToast(NewToastMessage(&tmp))
		return err
	}
	m.wallet = w
	if err := m.UnlockWallet(password); err != nil {
		tmp := ToastMessage{
			Title:       "Error unlocking wallet",
			Type:        "error",
			Description: err.Error(),
		}
		m.MakeToast(NewToastMessage(&tmp))
		return err
	}
	tmp := ToastMessage{
		Title:       "Success creating wallet: " + w.Accounts[0].Address,
		Type:        "success",
		Description: "You will need to transfer the wallet some gas. Then you will need to transfer to NeoFS. Your wallet",
	}
	m.MakeToast(NewToastMessage(&tmp))
	runtime.EventsEmit(m.ctx, "fresh-wallet", nil)
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
		tmp := ToastMessage{
			Title:       "Error finding wallet",
			Type:        "error",
			Description: err.Error(),
		}
		m.MakeToast(NewToastMessage(&tmp))
		return err
	}
	w, err := wal.NewWalletFromFile(filepath)
	if err != nil {
		tmp := ToastMessage{
			Title:       "Error reading wallet",
			Type:        "error",
			Description: err.Error(),
		}
		m.MakeToast(NewToastMessage(&tmp))
		return err
	}
	err = w.Accounts[0].Decrypt(password, w.Scrypt)
	if err != nil {
		tmp := ToastMessage{
			Title:       "Error unlocking wallet",
			Type:        "error",
			Description: err.Error(),
		}
		m.MakeToast(NewToastMessage(&tmp))
		return err
	}
	m.wallet = w
	tmp := ToastMessage{
		Title:       "Success reading wallet",
		Type:        "success",
		Description: "Using wallet "  + w.Accounts[0].Address,
	}
	m.MakeToast(NewToastMessage(&tmp))
	runtime.EventsEmit(m.ctx, "fresh-wallet", nil)
	return nil
}
