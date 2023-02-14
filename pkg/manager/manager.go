package manager

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"github.com/amlwwalker/greenfinch.react/pkg/cache"
	"github.com/amlwwalker/greenfinch.react/pkg/config"
	gspool "github.com/amlwwalker/greenfinch.react/pkg/pool"
	"github.com/amlwwalker/greenfinch.react/pkg/wallet"
	"github.com/blang/semver/v4"
	"github.com/google/uuid"
	"github.com/nspcc-dev/neofs-sdk-go/pool"
	"github.com/nspcc-dev/neofs-sdk-go/user"
	"io/ioutil"
	"log"
	"math/rand"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"

	wal "github.com/nspcc-dev/neo-go/pkg/wallet"
	//"github.com/patrickmn/go-cache"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)


//const explorerUrl = "https://testnet.explorer.onegate.space/transactionInfo"
const explorerUrl = "https://dora.coz.io/transaction/neo3/testnet"
type NotificationMessage struct {
	Id          string
	User		string //who is this message for so we can store it in the database
	Title       string
	Type        string
	Action string
	Description string
	CreatedAt string
	MarkRead     bool
}

func NewNotificationMessage(p *NotificationMessage) NotificationMessage {
	uuid, _ := uuid.NewUUID()
	p.Id = uuid.String()//rand.Intn(10001-1) + 1
	p.CreatedAt = strconv.FormatInt(time.Now().Unix(), 10)
	//store it in the database against the current user
	return *p
}

type ProgressMessage struct {
	Id       int
	Title    string
	Progress int
	Show     bool
	Error    string
}

func NewProgressMessage(p *ProgressMessage) ProgressMessage {
	p.Id = rand.Intn(101-1) + 1
	return *p
}

type UXMessage struct {
	Id          int
	Title       string
	Type        string
	Description string
	Closure     bool
}

func NewToastMessage(t *UXMessage) UXMessage {
	t.Id = rand.Intn(101-1) + 1
	return *t
}

type Manager struct {
	configLocation         string
	walletPath, walletAddr string
	gateAccount wal.Account
	pool                   *pool.Pool
	//fsCli                  *neofscli.Client
	//key                    *ecdsa.PrivateKey
	version string
	//c                      *cache.Cache
	ctx            context.Context
	Wallet         *wal.Wallet
	password       string //warning this is not a good idea
	DEBUG          bool
	disableCaching bool
}

const (
	CACHE_FILE_SYSTEM = "filesystem"
)

func (m *Manager) UnlockWallet() error {
	return m.Wallet.Accounts[0].Decrypt(m.password, m.Wallet.Scrypt)
}

// startup is called at application startup
func (m *Manager) Startup(ctx context.Context) {
	// Perform your setup here
	m.ctx = ctx
	//go m.RetrieveFileSystem()
}

// domReady is called after the front-end dom has been loaded
func (m *Manager) DomReady(ctx context.Context) {
	m.checkForVersion()
	if m.Wallet == nil {
		tmp := NewToastMessage(&UXMessage{
			Title:       "Get started",
			Type:        "info",
			Description: "Please load a wallet to starting using Greenfinch",
		})
		m.MakeToast(tmp)
		runtime.EventsEmit(m.ctx, "select_wallet", true)
	}
}

func (m *Manager) GetVersion() string {
	return m.version
}
func (m *Manager) checkForVersion() {
	//version
	go func() {
		time.Sleep(1 * time.Second) //lets make sure we are ready to show the version issue
		//if v1 is older than v2, then compare returns -1
		//http://localhost:8000/version.json
		resp, err := http.Get("https://greenfinch.app/version.json")
		if err != nil {
			log.Println("err retrieving version", err)
		} else {
			var metadata struct {
				RemoteVersion string `json:"binary_version"`
			}
			body, err := ioutil.ReadAll(resp.Body)
			if err != nil {
				log.Println("Error retrieving remote version body", err)
			}
			fmt.Println("version check received", string(body))
			json.Unmarshal(body, &metadata)
			remoteVersion, _ := semver.Make(metadata.RemoteVersion)
			fmt.Println("parsing ", m.version)
			tmpVersion := m.version
			if strings.HasPrefix(m.version, "v") {
				tmpVersion = strings.TrimPrefix(m.version, "v")
			}
			v, err := semver.Parse(tmpVersion)
			if err != nil {
				log.Println("error with versioning. Not Semantic", err)
				tmp := NewToastMessage(&UXMessage{
					Title:       "Checking for update",
					Type:        "warning",
					Description: "Error with versioning " + err.Error() + " " + m.version + " - " + tmpVersion,
				})
				m.MakeToast(tmp)
				return
			}

			log.Printf("version %s", v)
			if v.Compare(remoteVersion) < 0 {
				tmp := NewToastMessage(&UXMessage{
					Title:       "Update Available",
					Type:        "info",
					Description: "Please visit greenfinch.app to download version " + remoteVersion.String(),
				})
				m.MakeToast(tmp)
			}
			fmt.Println("version comparison", v.Compare(remoteVersion))
		}
	}()
}
func (m *Manager) MakeToast(message UXMessage) {
	runtime.EventsEmit(m.ctx, "freshtoast", message)
}

func (m Manager) Notifications() ([]NotificationMessage, error){
	if m.Wallet == nil {
		return nil, errors.New("no wallet loaded")
	}
	notificationBytes, err := cache.RetrieveNotifications(m.Wallet.Accounts[0].Address)
	if err != nil {
		return nil, err
	}
	var notifications []NotificationMessage
	for _, n := range notificationBytes {
		var notification NotificationMessage
		if err := json.Unmarshal(n, &notification); err == nil {
			notifications = append(notifications, notification)
		} else {
			fmt.Println("error unmarshalling notification ", err)
		}
	}
	return notifications, nil
}

func (m Manager) MarkAllNotificationsRead() error {
	address := m.Wallet.Accounts[0].Address
	if err := cache.DeleteNotications(address); err != nil {
		return err
	}
	return nil
}
func (m Manager) MarkNotificationRead(uuid string) error {
	address := m.Wallet.Accounts[0].Address
	fmt.Println("deleting notification ", uuid)
	if err := cache.DeleteNotification(address, uuid); err != nil {
		return err
	}
	return nil
}
func (m *Manager) MakeNotification(message NotificationMessage) {
	if m.Wallet == nil {
		fmt.Println("no wallet found")
		return //no wallet yet to connect notifications with
	}
	message.User = m.Wallet.Accounts[0].Address
	message = NewNotificationMessage(&message)
	marshal, err := json.Marshal(message)
	if err != nil {
		fmt.Println("error marshalling notification", err)
	}
	err = cache.UpsertNotification(message.User, message.Id, marshal)
	if err != nil {
		fmt.Println("error upserting notifiation")
	}
	fmt.Println("notification message ", message)
	runtime.EventsEmit(m.ctx, "freshnotification", message)
}

func (m *Manager) SetProgressPercentage(progressMessage ProgressMessage) {
	runtime.EventsEmit(m.ctx, "percentageProgress", progressMessage)
}
func (m *Manager) SendSignal(signalName string, signalValue interface{}) {
	fmt.Println("sending signal", signalName)
	runtime.EventsEmit(m.ctx, signalName, signalValue)
}

// shutdown is called at application termination
func (m *Manager) Shutdown(ctx context.Context) {
	// Perform your teardown here
}

//func (m *Manager) Search(search string) ([]filesystem.Element, error) {
//	tmpFS, found := m.c.Get(CACHE_FILE_SYSTEM)
//	if !found {
//		return []filesystem.Element{}, errors.New("no filesystem in cache")
//	}
//	var results []filesystem.Element
//	//now search the filesystem for a string comparison
//	for _, v := range tmpFS.([]filesystem.Element) {
//		if fnAttr, ok := v.Attributes[obj.AttributeFileName]; ok {
//			if strings.Contains(fnAttr, search) {
//				results = append(results, v)
//			}
//		}
//	}
//	return results, nil
//}
func NewFileSystemManager(version string, dbLocation string, DEBUG bool) (*Manager, error) {

	//move config location to database for development if not set?
	wd, err := os.Getwd()
	if err != nil {
		return nil, err
	}
	cache.DB(dbLocation)
	//we need an ephemeral key for the application to use for tokens that is not the user's key. The user's key should 'never' be used directly to make an action
	ephemeralAccount, err := wallet.GenerateEphemeralAccount()
	if err != nil {
		return nil, err
	}
	str, err := wallet.PrettyPrint(*ephemeralAccount)
	fmt.Println(str)
	if err != nil {
		log.Fatal(err)
	}
	return &Manager{
		configLocation: wd,
		gateAccount: *ephemeralAccount, //used to make requests to RPC endpoints and works on behalf of the user so never to expose their key anywhere
		//walletPath: walletPath,
		//walletAddr: walletAddr,
		version: version,
		pool:    nil,
		//key:        key, //this is holding the private key in memory - not good?
		//c:          cache.New(1*time.Minute, 10*time.Minute),
		ctx:   nil,
		DEBUG: DEBUG,
	}, nil
}

func (m *Manager) SetWalletDebugging(walletPath, password string) error {
	m.walletPath = walletPath
	w, err := wal.NewWalletFromFile(walletPath)
	if err != nil {
		m.MakeNotification(NotificationMessage{
			Title:       "Error reading wallet",
			Type:        "error",
			Description: fmt.Sprintf("Reading wallet failing %s", err.Error()),
			MarkRead:    false,
		})
		tmp := UXMessage{
			Title:       "Error reading wallet",
			Type:        "error",
			Description: "failing to read wallet",
		}
		m.MakeToast(NewToastMessage(&tmp))
		return err
	}
	m.Wallet = w
	err = m.Wallet.Accounts[0].Decrypt(password, w.Scrypt)
	if err != nil {
		return err
	}
	m.ctx = context.Background()
	_, err = m.Pool()
	return err
}

// todo we will want to have things dependent on the wallet controlled elsewhere with singletons and no other way of getting the value
// todo remove the need to pass the private key to the api (usually for getOwnerID - however this should be passed into the backend
func (m *Manager) Pool() (*pool.Pool, error) {
	if m.pool == nil {
		config, err := config.ReadConfig("cfg", m.configLocation)
		if err != nil {
			m.MakeNotification(NotificationMessage{
				Title:       "Error reading pool config",
				Type:        "error",
				Description: fmt.Sprintf("Reading pool config failing %s", err.Error()),
				MarkRead:    false,
			})
			return nil, err
		}
		//todo: this should be wallet connect pool
		pl, err := gspool.GetPool(m.ctx, m.Wallet.Accounts[0].PrivateKey().PrivateKey, config.Peers)
		if err != nil {
			fmt.Println("error getting pool with key ", err)
			return nil, err
		}
		m.pool = pl
	}
	return m.pool, nil
}

type Account struct {
	Address   string `json:"address"`
	PublicKey string `json:"publicKey"`
	NeoFS     struct {
		Balance   int64  `json:"balance"`
		Precision uint32 `json:"precision"`
	} `json:"neofs"`
	Nep17 map[string]wallet.Nep17Tokens `json:"nep17"'`
}

var NotFound = errors.New("wallet not found")

func (m *Manager) retrieveWallet() (*wal.Wallet, error) {
	if m.Wallet == nil {
		//tmp := NewToastMessage(&UXMessage{
		//	Title:       "Lets get started",
		//	Type:        "info",
		//	Description: "Please select a wallet",
		//})
		//m.MakeToast(tmp)

		return nil, NotFound
	}
	return m.Wallet, nil
}

func (m *Manager) GetAccountInformation() (Account, error) {
	fmt.Println(GetCurrentFunctionName(), " caller is ", GetCallerFunctionName())
	w, err := m.retrieveWallet()
	if err != nil {
		//if !errors.Is(err, NotFound) {
		//	return Account{}, err
		//}
		runtime.EventsEmit(m.ctx, "select_wallet", true)
		return Account{}, nil
	}
	balances, err := wallet.GetNep17Balances(w.Accounts[0].Address, wallet.RPC_TESTNET)
	if err != nil {
		return Account{}, err
	}
	fmt.Printf("retrieved balances %+v\r\n", balances)

	fmt.Println("getting account information ", m.pool)
	pl, err := m.Pool()
	if err != nil {
		return Account{}, err
	}
	//get := neofscli.PrmBalanceGet{}
	//get.SetAccount(*id)

	userID := user.ID{}
	user.IDFromKey(&userID, m.Wallet.Accounts[0].PrivateKey().PrivateKey.PublicKey)
	blGet := pool.PrmBalanceGet{}
	blGet.SetAccount(userID)

	fmt.Println("waiting to retrieve result")
	res, err := pl.Balance(context.Background(), blGet)
	if err != nil {
		fmt.Errorf("error %w", err)
	}

	//result, err := pl.BalanceGet(m.ctx, get)
	//if err != nil {
	//	return Account{}, err
	//}
	//now create an account object
	var b = Account{
		Address:   w.Accounts[0].Address,
		PublicKey: wallet.ByteArrayToString(m.Wallet.Accounts[0].PrivateKey().PublicKey().Bytes()),
		NeoFS: struct {
			Balance   int64  `json:"balance"`
			Precision uint32 `json:"precision"`
		}(struct {
			Balance   int64
			Precision uint32
		}{
			Balance:   res.Value(),
			Precision: res.Precision(),
		}),
	}
	b.Nep17 = balances
	if _, ok := b.Nep17["GAS"]; !ok {
		b.Nep17["GAS"] = wallet.Nep17Tokens{}
	}
	if _, ok := b.Nep17["NEO"]; !ok {
		b.Nep17["NEO"] = wallet.Nep17Tokens{}
	}
	if m.DEBUG {
		DebugSaveJson("GetAccountInformation.json", b)
	}
	return b, nil
}

