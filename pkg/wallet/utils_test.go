package wallet_test

import (
	"encoding/json"
	gswallet "github.com/amlwwalker/greenfinch.react/pkg/wallet"
	"github.com/nspcc-dev/neo-go/pkg/wallet"
	"github.com/nspcc-dev/neofs-sdk-go/user"
	"github.com/stretchr/testify/assert"
	"log"
	"testing"
)

const testWallet = `
{
    "version": "3.0",
    "accounts": [
        {
            "address": "NXcncJT8jipH7ZkaUQzkb6Dx28w7D1Njd3",
            "key": "6PYLKxdUDKDJiNnvJH54F4RyL1oNariwSyRHEZKp3LY3c7CE6GXpKWyQCn",
            "label": "",
            "contract": {
                "script": "DCECEMKNErwa05rzuh62TzGPZ/ifV6SVJl0U9Te5aTaX9TxBVuezJw==",
                "parameters": [
                    {
                        "name": "parameter0",
                        "type": "Signature"
                    }
                ],
                "deployed": false
            },
            "lock": false,
            "isDefault": false
        }
    ],
    "scrypt": {
        "n": 16384,
        "r": 8,
        "p": 8
    },
    "extra": {
        "Tokens": null
    }
}`

func loadWalletFromString() (wallet.Wallet, error) {
	w := wallet.Wallet{}
	err := json.Unmarshal([]byte(testWallet), &w)
	return w, err
}
func TestOwnerID(t *testing.T) {
	//generate a wallets
	w, err := loadWalletFromString()
	assert.Nil(t, err, "error not nil")
	res, _ := gswallet.PrettyPrint(w)
	log.Printf("%+v\r\n", res)

	fromWallet, err := gswallet.GetCredentialsFromWallet("", "password", &w)
	assert.Nil(t, err, "error not nil")
	userID := user.ID{}
	user.IDFromKey(&userID, fromWallet.PublicKey)
	assert.Nil(t, err, "error not nil")
	assert.Equal(t, "NXcncJT8jipH7ZkaUQzkb6Dx28w7D1Njd3", userID.String(), "ID not equal")
}
