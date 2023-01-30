package wallet_test

import (
	"encoding/hex"
	"fmt"
	"github.com/amlwwalker/greenfinch.react/pkg/wallet"
	"github.com/stretchr/testify/assert"
	"testing"
)

func TestWalletGenerateNew(t *testing.T) {
	w, err := wallet.GenerateNewWallet("/tmp/wallets.rawContent.go")
	assert.Nil(t, err, "error not nil")
	assert.NotNil(t, w.Accounts[0], "no account")
	assert.NotEqualf(t, "", w.Accounts[0].Address, "no address")
}

func TestWalletSecureGenerateNew(t *testing.T) {
	path := "/tmp/wallets.rawContent.go"
	password := "password"
	w, err := wallet.GenerateNewSecureWallet(path, "", password)
	fmt.Print(wallet.PrettyPrint(w))
	assert.Nil(t, err, "error not nil")
	assert.NotNil(t, w.Accounts[0], "no account")
	assert.NotEqualf(t, "", w.Accounts[0].Address, "no address")

	creds, err := wallet.GetCredentialsFromPath(path, w.Accounts[0].Address, password)
	assert.Nil(t, err, "error not nil")
	assert.NotEqual(t, nil, creds)
	creds, err = wallet.GetCredentialsFromWallet("", "password", w)
	assert.Nil(t, err, "error not nil")
	assert.NotEqual(t, nil, creds)
}

func TestGenerateWallet(t *testing.T) {
	w, _ := wallet.GenerateNewWallet("/tmp/wallets.rawContent.go")
	bytePublicKey := hex.EncodeToString(w.Accounts[0].PrivateKey().PublicKey().Bytes())
	fmt.Println("test key hex:", bytePublicKey)
}
