package main

import (
	"context"
	"embed"
	"flag"
	"fmt"
	"github.com/amlwwalker/gaspump.react/pkg/manager"
	"github.com/configwizard/gaspump-api/pkg/wallet"
	"github.com/nspcc-dev/neo-go/pkg/core/native/nativenames"
	client2 "github.com/nspcc-dev/neo-go/pkg/rpc/client"
	"log"
	"os"

	"github.com/wailsapp/wails/v2/pkg/options/mac"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/logger"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/windows"
)

//go:embed frontend/build
var assets embed.FS

//go:embed build/appicon.png
var icon []byte

const usage = `NeoFS Account requests
Creating a new wallet. Note defaults to searching for ./wallets/wallet.json
$ ./build/bin/GasPump.app/Contents/MacOS/GasPump -wallet=./wallets/wallet.json new
`

var (
	walletPassword = flag.String("password", "password", "set password for new wallet")
	walletName = flag.String("name", "", "set name for new wallet")
	walletPath = flag.String("wallet", "", "path to JSON wallet file")
	walletAddr = flag.String("address", "", "wallet address")
	transferAmount = flag.Int64("amount", 1_00_000_000, "amount to transfer (precision is 8) default 1 GAS")
	//not used:
	createContainerOnStart = flag.Bool("container", false, "should create a container on start")
)

func main() {
	flag.Usage = func() {
		_, _ = fmt.Fprintf(os.Stderr, usage)
		flag.PrintDefaults()
	}
	flag.Parse()

	switch flag.Arg(0) {
	case "new":
		//creating a new wallet and exiting
		log.Println("walletPath", walletPath, *walletPath)
		if walletPath == nil || *walletPath == "" {
			log.Fatal("no wallet path provided")
		}
		newWallet, err := wallet.GenerateNewSecureWallet(*walletPath, *walletName, *walletPassword)
		if err != nil {
			log.Fatal("error generating wallet", err)
		}
		res, err := wallet.PrettyPrint(*newWallet)
		if err != nil {
			log.Fatal(err)
		}
		log.Printf("created new wallet: %s\r\n %+v\r\n", newWallet.Accounts[0].Address, res)
		os.Exit(0)
	case "transfer":
		if walletPath == nil || *walletPath == "" {
			log.Fatal("no wallet path provided")
		}
		if transferAmount == nil || *transferAmount == 0 {
			log.Fatal("amount must be greater than 0")
		}

		ctx := context.Background()
		cli, err := client2.New(ctx, string(wallet.RPC_TESTNET), client2.Options{})
		if err != nil {
			log.Fatal(err)
		}
		err = cli.Init()
		if err != nil {
			log.Fatal(err)
		}
		unlockedWallet, err := wallet.UnlockWallet(*walletPath, "", "password")
		if err != nil {
			log.Fatal(err)
		}
		gasToken, err := cli.GetNativeContractHash(nativenames.Gas)
		if err != nil {
			log.Fatal(err)
		}
		transactionID, err := wallet.TransferToken(unlockedWallet, *transferAmount, *walletAddr, gasToken, wallet.RPC_TESTNET)
		if err != nil {
			log.Fatal(err)
		}
		start := uint64(0)
		stop := uint64(1600094189000)
		limit := int(10)
		page := int(1)
		uint160, err := wallet.StringToUint160(unlockedWallet.Address)
		if err != nil {
			return
		}
		transfers, err := cli.GetNEP17Transfers(uint160, &start, &stop, &limit, &page)
		fmt.Printf("error %s\ntransfers %+v\n", err, transfers)
		//stringTx := wallet.Uint160ToString(transactionID)
		log.Println("transaction made txID ", transactionID)
		os.Exit(0)
	//default:
	//	if *walletPath == "" {
	//		*walletPath = "./wallets/wallet.json"
	//	}
	//	log.Println("starting gaspump. Using wallet at", *walletPath)
	}
//https://http.testnet.fs.neo.org/CONTAINER_ID/OBJECT_ID
	//createContainerOnStart
	manager, err := manager.NewFileSystemManager(false)
	if err != nil {
		log.Fatal("can't create a manager", err)
	}
	//balance, err := manager.GetAccountInformation()
	//if err != nil {
	//	fmt.Println("error retrieving neo fs balance", err)
	//} else {
	//	fmt.Printf("balance: %d, precision %d\r\n", balance.NeoFS.Balance, balance.NeoFS.Precision)
	//}
	//mocker := mocker.Mocker{BasePath: path.Join("frontend", "src")} //mocker for frontend

	//manager.PopToast()
	// Create application with options
	err = wails.Run(&options.App{
		// Title:  "Greenfinch",
		Width:  1024,
		Height: 768,
		// MinWidth:          720,
		// MinHeight:         570,
		// MaxWidth:          1280,
		// MaxHeight:         740,
		DisableResize:     false,
		Fullscreen:        false,
		Frameless:         false,
		StartHidden:       false,
		HideWindowOnClose: false,
		RGBA:              &options.RGBA{255, 255, 255, 255},
		Assets:            assets,
		LogLevel:          logger.DEBUG,
		OnStartup:         manager.Startup, //todo update these to the manager scripts
		OnDomReady:        manager.DomReady,
		OnShutdown:        manager.Shutdown,
		Bind: []interface{}{
			manager,
			//&mocker,
		},
		// Windows platform specific options
		Windows: &windows.Options{
			WebviewIsTransparent: false,
			WindowIsTranslucent:  false,
			DisableWindowIcon:    false,
		},
		Mac: &mac.Options{
			TitleBar: &mac.TitleBar{
				TitlebarAppearsTransparent: false,
				HideTitle:                  false,
				HideTitleBar:               false,
				FullSizeContent:            false,
				UseToolbar:                 false,
				HideToolbarSeparator:       true,
			},
			//TitleBar:             mac.TitleBarHiddenInset(),
			WebviewIsTransparent: false,
			WindowIsTranslucent:  false,
			About: &mac.AboutInfo{
				Title:   "Greenfinch",
				Message: "Decentralised file storage.",
				Icon:    icon,
			},
		},
	})

	if err != nil {
		log.Fatal(err)
	}
}
