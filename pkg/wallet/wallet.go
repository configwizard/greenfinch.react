package wallet

import (
	"context"
	"crypto/ecdsa"
	"errors"
	"fmt"
	"github.com/nspcc-dev/neo-go/cli/flags"
	"github.com/nspcc-dev/neo-go/pkg/core/transaction"
	"github.com/nspcc-dev/neo-go/pkg/crypto/keys"
	"github.com/nspcc-dev/neo-go/pkg/io"
	"github.com/nspcc-dev/neo-go/pkg/neorpc/result"
	client "github.com/nspcc-dev/neo-go/pkg/rpcclient"
	"github.com/nspcc-dev/neo-go/pkg/smartcontract"
	"github.com/nspcc-dev/neo-go/pkg/smartcontract/callflag"
	"github.com/nspcc-dev/neo-go/pkg/smartcontract/trigger"
	"github.com/nspcc-dev/neo-go/pkg/util"
	"github.com/nspcc-dev/neo-go/pkg/vm/emit"
	"github.com/nspcc-dev/neo-go/pkg/wallet"
	"strconv"
	"strings"
	"time"
)

type RPC_NETWORK string
//
//const (
//todo - this should move to config object
 const RPC_WEBSOCKET RPC_NETWORK = "wss://rpc.t5.n3.nspcc.ru:20331/ws"
//	RPC_TESTNET RPC_NETWORK = "https://rpc.t5.n3.nspcc.ru:20331/"
//	RPC_MAINNET RPC_NETWORK = "https://rpc.t5.n3.nspcc.ru:20331/"
//)

func GenerateNewWallet(path string) (*wallet.Wallet, error) {
	acc, err := wallet.NewAccount()
	if err != nil {
		return &wallet.Wallet{}, err
	}
	w, err := wallet.NewWallet(path)
	w.AddAccount(acc)
	return w, err
}

func GenerateEphemeralAccount() (*wallet.Account, error) {
	acc, err := wallet.NewAccount()
	if err != nil {
		return nil, err
	}
	return acc, nil
}
func GenerateNewSecureWallet(path, name, password string) (*wallet.Wallet, error) {
	w, err := wallet.NewWallet(path)
	w.CreateAccount(name, password)
	return w, err
}

func RetrieveWallet(path string) (*wallet.Wallet, error) {
	w, err := wallet.NewWalletFromFile(path)
	if err != nil {
		return nil, fmt.Errorf("can't read the wallets: %walletPath", err)
	}
	return w, nil
}
func GetCredentialsFromWallet(address, password string, w *wallet.Wallet) (ecdsa.PrivateKey, error) {
	return getKeyFromWallet(w, address, password)
}
func GetCredentialsFromPath(path, address, password string) (ecdsa.PrivateKey, error) {
	w, err := wallet.NewWalletFromFile(path)
	if err != nil {
		return ecdsa.PrivateKey{}, fmt.Errorf("can't read the wallets: %walletPath", err)
	}

	return getKeyFromWallet(w, address, password)
}
func GetWalletFromPrivateKey(key ecdsa.PrivateKey) *wallet.Account {
	privKey := keys.PrivateKey{PrivateKey: key}
	return wallet.NewAccountFromPrivateKey(&privKey)
}
func UnlockWallet(path, address, password string) (*wallet.Account, error) {
	w, err := wallet.NewWalletFromFile(path)
	if err != nil {
		return nil, err
	}
	var addr util.Uint160
	if len(address) == 0 {
		addr = w.GetChangeAddress()
	} else {
		addr, err = flags.ParseAddress(address)
		if err != nil {
			return nil, fmt.Errorf("invalid address")
		}
	}

	acc := w.GetAccount(addr)
	err = acc.Decrypt(password, w.Scrypt)
	if err != nil {
		return nil, err
	}
	return acc, nil
}

type Nep17Tokens struct {
	Asset  util.Uint160 `json:"asset"`
	Amount uint64       `json:"amount""`
	Symbol string       `json:"symbol"`
	Info   wallet.Token `json:"meta"`
	Error  error        `json:"error"`
}

func GetNep17Balances(walletAddress string, network RPC_NETWORK) (map[string]Nep17Tokens, error) {
	ctx := context.Background()
	// use endpoint addresses of public RPC nodes, e.g. from https://dora.coz.io/monitor
	cli, err := client.New(ctx, string(network), client.Options{
		RequestTimeout: 60 * time.Second,
	})
	if err != nil {
		return map[string]Nep17Tokens{}, err
	}
	err = cli.Init()

	if err != nil {
		return map[string]Nep17Tokens{}, err
	}
	recipient, err := StringToUint160(walletAddress)
	if err != nil {
		return map[string]Nep17Tokens{}, err
	}
	balances, err := cli.GetNEP17Balances(recipient)
	if err != nil {
		fmt.Println("could not retrieve balances ", err)
		return map[string]Nep17Tokens{}, err
	}
	tokens := make(map[string]Nep17Tokens)
	for _, v := range balances.Balances {
		tokInfo := Nep17Tokens{}
		symbol, err := cli.NEP17Symbol(v.Asset)
		if err != nil {
			tokInfo.Error = err
			continue
		}
		tokInfo.Symbol = symbol
		fmt.Println(v.Asset, v.Asset)
		number, err := strconv.ParseUint(v.Amount, 10, 64)
		if err != nil {
			tokInfo.Error = err
			continue
		}
		tokInfo.Amount = number

		info, err := cli.NEP17TokenInfo(v.Asset)
		if err != nil {
			tokInfo.Error = err
			continue
		}
		tokInfo.Info = *info
		tokens[symbol] = tokInfo
	}

	return tokens, nil
}
//
////TransferToken transfer Nep17 token to another wallets, for instance use address here https://testcdn.fs.neo.org/doc/integrations/endpoints/
////simple example https://gist.github.com/alexvanin/4f22937b99990243a60b7abf68d7458c
//func TransferToken(a *wallet.Account, amount int64, walletTo string, token util.Uint160, network RPC_NETWORK) (string, error) {
//	ctx := context.Background()
//	// use endpoint addresses of public RPC nodes, e.g. from https://dora.coz.io/monitor
//	cli, err := client.New(ctx, string(network), client.Options{})
//	if err != nil {
//		fmt.Println("couldn't create client", err)
//		return "", err
//	}
//	err = cli.Init()
//	if err != nil {
//		fmt.Println("couldn't init client", err)
//		return "", err
//	}
//	recipient, err := StringToUint160(walletTo)
//	if err != nil {
//		fmt.Println("couldn't stringtoUint160 client", err)
//		return "", err
//	}
//
//	txHash, err := cli.TransferNEP17(a, recipient, token, amount, 0, nil, nil)
//	if err != nil {
//		fmt.Println("couldn't TransferNEP17 client", err)
//	}
//	le := txHash.StringLE()
//	return le, err
//}

//todo ...
func GenerateMultiSignWalletFromSigners() {
	//	https://github.com/nspcc-dev/neo-go/blob/fdf80dbdc56d5f634908a5f0eb5ada2d9c7565af/docs/notary.md
	//useful read https://github.com/nspcc-dev/neo-go/blob/d5e11e0a75403fc56f48f23c13d25597a5d5f5a5/pkg/wallet/account_test.go#L91
	//https://medium.com/neoresearch/understanding-multisig-on-neo-df9c9c1403b1
	//https://github.com/nspcc-dev/neo-go/blob/d5e11e0a75403fc56f48f23c13d25597a5d5f5a5/pkg/wallet/account.go#L196-L197

	//example public keys
	//hexs := []string{
	//	//insert your key here
	//	"02b3622bf4017bdfe317c58aed5f4c753f206b7db896046fa7d774bbc4bf7f8dc2",
	//	"02103a7f7dd016558597f7960d27c516a4394fd968b9e65155eb4b013e4040406e",
	//	"02a7bc55fe8684e0119768d104ba30795bdcc86619e864add26156723ed185cd62",
	//	"03d90c07df63e690ce77912e10ab51acc944b66860237b608c4f8f8309e71ee699",
	//}
	//make sure YOUR public key is the first one so you can pay for the transaction
}
func GetPeers(ntwk RPC_NETWORK) ([]result.Peer, error) {
	ctx := context.Background()
	// use endpoint addresses of public RPC nodes, e.g. from https://dora.coz.io/monitor
	cli, err := client.New(ctx, string(ntwk), client.Options{})
	if err != nil {
		return []result.Peer{}, err
	}

	err = cli.Init()
	peers, err := cli.GetPeers()
	return peers.Connected, err
}

func ConvertScriptHashToAddressString(scriptHash string) (util.Uint160, string, error) {
	//contractScriptHash := "185ec84c2694684f1dbd2852c27f004d969653d5"
	scriptHash = strings.TrimPrefix(scriptHash, "0x")
	contractAddress, err := util.Uint160DecodeStringLE(scriptHash)
	if err != nil {
		return util.Uint160{}, "", fmt.Errorf("can't convert script hash %w\n", err)
	}
	return contractAddress, Uint160ToString(contractAddress), nil

}

// CreateTransactionFromFunctionCall creates a transaction to call a function on a smart contract) that still requires executing
// Before this is ready for sending
// Consider using https://pkg.go.dev/github.com/nspcc-dev/neo-go/pkg/rpc/client#Client.CreateTxFromScript as an alternative
func CreateTransactionFromFunctionCall(contractScriptHash string, operation string, network RPC_NETWORK, acc *wallet.Account, params []smartcontract.Parameter) (util.Uint256, *transaction.Transaction, error) {
	ctx := context.Background()
	// use endpoint addresses of public RPC nodes, e.g. from https://dora.coz.io/monitor
	cli, err := client.New(ctx, string(network), client.Options{})
	if err != nil {
		return util.Uint256{}, &transaction.Transaction{}, fmt.Errorf("can't create client %w\n", err)
	}
	err = cli.Init()

	script := io.NewBufBinWriter()

	contractAddress, _, err := ConvertScriptHashToAddressString(contractScriptHash)
	if err != nil {
		return util.Uint256{}, &transaction.Transaction{}, err
	}
	account, err := StringToUint160(acc.Address)
	if err != nil {
		return util.Uint256{}, &transaction.Transaction{}, err
	}

	var args []interface{}
	for _, v := range params {
		args = append(args, v.Value)
	}

	//callflag.All could be restricted? Should it be passed in?
	//operation e.g "symbol" - smart contract function to call.
	emit.AppCall(script.BinWriter, contractAddress, operation, callflag.All, args...) //call the function (dry run)
	tx := transaction.New(script.Bytes(), 0)

	var signers []transaction.Signer
	signer := transaction.Signer{
		Account:          account, //the wallet that is allowed to execute the transaction
		Scopes:           transaction.CalledByEntry,
		AllowedContracts: nil, //not meaningful in the case of CalledByEntry
		AllowedGroups:    nil,
	}
	signers = append(signers, signer)
	tx.Signers = signers            //do i need to do this?
	witness := transaction.Witness{ //when/where do we set witnesses?
		InvocationScript:   script.Bytes(),
		VerificationScript: acc.GetVerificationScript(),
	}
	tx.Scripts = []transaction.Witness{witness}

	testInvoke, err := cli.InvokeFunction(contractAddress, operation, params, signers)
	if err != nil {
		return util.Uint256{}, nil, fmt.Errorf("error invoking [test] function %w\r\n", err)
	}
	validUntilBlock, err := cli.CalculateValidUntilBlock()
	if err != nil {
		fmt.Println("valid until failed", err)
		return util.Uint256{}, nil, fmt.Errorf("error invoking validUntilBlock function %w\r\n", err)
	}
	tx.ValidUntilBlock = validUntilBlock
	fmt.Printf("tstTX %d - %s - %v\r\n", testInvoke.GasConsumed, testInvoke.FaultException, testInvoke.Transaction)
	systemFee := testInvoke.GasConsumed            //gas consumed invoking contract
	networkFee, err := cli.CalculateNetworkFee(tx) //calculating network networkFee
	if err != nil {
		return util.Uint256{}, nil, fmt.Errorf("error calculatng network fee %w\r\n", err)
	}
	tx.SystemFee = systemFee
	fmt.Printf("gas consumed (system fee) %d, (network fee) %d, invoking function\r\n", systemFee, networkFee)
	//adding network networkFee and gasConsumed to transaction with the wallet account paying
	err = cli.AddNetworkFee(tx, networkFee, acc)
	if err != nil {
		return util.Uint256{}, nil, fmt.Errorf("error adding network fee %w\r\n", err)
	}
	magic, err := cli.GetNetwork()
	if err != nil {
		return util.Uint256{}, nil, fmt.Errorf("error retreiving network magic %w\r\n", err)
	}
	err = acc.SignTx(magic, tx)
	if err != nil {
		return util.Uint256{}, nil, fmt.Errorf("error signing transaction %w\r\n", err)
	}
	//and when you are ready you can invoke it
	rawTransaction, err := cli.SendRawTransaction(tx)

	if err != nil {
		return util.Uint256{}, nil, fmt.Errorf("error sending raw transaction %w\r\n", err)
	}

	fmt.Printf("sent transaction %+v - ID %s\r\n", rawTransaction, rawTransaction.StringLE())
	return rawTransaction, tx, nil //return the signed transaction
}

func GetLogForTransaction(network RPC_NETWORK, transactionID util.Uint256) (*result.ApplicationLog, error) {
	ctx := context.Background()
	// use endpoint addresses of public RPC nodes, e.g. from https://dora.coz.io/monitor
	cli, err := client.New(ctx, string(network), client.Options{})
	if err != nil {
		return &result.ApplicationLog{}, fmt.Errorf("can't create client %w\n", err)
	}
	err = cli.Init()
	trig := trigger.All
	log, err := cli.GetApplicationLog(transactionID, &trig)
	return log, err
}

// getKeyFromWallet fetches private key from neo-go wallets structure
func getKeyFromWallet(w *wallet.Wallet, addrStr, password string) (ecdsa.PrivateKey, error) {
	var (
		addr util.Uint160
		err  error
	)

	if addrStr == "" {
		addr = w.GetChangeAddress()
	} else {
		addr, err = flags.ParseAddress(addrStr)
		if err != nil {
			return ecdsa.PrivateKey{}, fmt.Errorf("invalid wallets address %s: %w", addrStr, err)
		}
	}

	acc := w.GetAccount(addr)
	if acc == nil {
		return ecdsa.PrivateKey{}, fmt.Errorf("invalid wallets address %s: %w", addrStr, err)
	}

	if err := acc.Decrypt(password, keys.NEP2ScryptParams()); err != nil {
		return ecdsa.PrivateKey{}, errors.New("[decrypt] invalid password - " + err.Error())

	}

	return acc.PrivateKey().PrivateKey, nil
}
