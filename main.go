package main

import (
	"changeme/pkg/manager"
	"changeme/pkg/mocker"
	"embed"
	"flag"
	"fmt"
	"github.com/amlwwalker/gaspump-api/pkg/wallet"
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
	walletAddr = flag.String("address", "", "wallet address [optional]")
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
	default:
		if *walletPath == "" {
			*walletPath = "./wallets/wallet.json"
		}
		log.Println("starting gaspump. Using wallet at", *walletPath)
	}
//https://http.testnet.fs.neo.org/CONTAINER_ID/OBJECT_ID
	//createContainerOnStart
	manager, err := manager.NewFileSystemManager(*walletPath, *walletAddr, *walletPassword, true)
	if err != nil {
		log.Fatal("can't create a manager", err)
	}
	balance, err := manager.GetAccountInformation()
	if err != nil {
		fmt.Println("error retrieving neo fs balance", err)
	} else {
		fmt.Printf("balance: %d, precision %d\r\n", balance)
	}
	mocker := mocker.Mocker{} //mocker for frontend

	// Create application with options
	err = wails.Run(&options.App{
		Title:  "Gas Pump",
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
			&mocker,
		},
		// Windows platform specific options
		Windows: &windows.Options{
			WebviewIsTransparent: false,
			WindowIsTranslucent:  false,
			DisableWindowIcon:    false,
		},
		Mac: &mac.Options{
			TitleBar:             mac.TitleBarHiddenInset(),
			WebviewIsTransparent: true,
			WindowIsTranslucent:  true,
			About: &mac.AboutInfo{
				Title:   "ReactJS Template",
				Message: "Part of the Wails projects",
				Icon:    icon,
			},
		},
	})

	if err != nil {
		log.Fatal(err)
	}
}
