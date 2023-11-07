package manager

import (
	"context"
	"crypto/ecdsa"
	"crypto/elliptic"
	"encoding/base64"
	"encoding/hex"
	"encoding/json"
	"errors"
	"fmt"
	"github.com/amlwwalker/greenfinch.react/pkg/cache"
	gspool "github.com/amlwwalker/greenfinch.react/pkg/pool"
	"github.com/amlwwalker/greenfinch.react/pkg/wallet"
	"github.com/atotto/clipboard"
	"github.com/blang/semver/v4"
	"github.com/google/uuid"
	"github.com/nspcc-dev/neo-go/pkg/crypto/keys"
	"github.com/nspcc-dev/neofs-api-go/v2/refs"
	v2session "github.com/nspcc-dev/neofs-api-go/v2/session"
	"github.com/nspcc-dev/neofs-sdk-go/bearer"
	"github.com/nspcc-dev/neofs-sdk-go/client"
	neofsecdsa "github.com/nspcc-dev/neofs-sdk-go/crypto/ecdsa"
	"github.com/nspcc-dev/neofs-sdk-go/pool"
	"github.com/nspcc-dev/neofs-sdk-go/session"
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

const testNetExplorerUrl = "https://dora.coz.io/transaction/neo3/testnet"
const mainnetExplorerUrl = "https://dora.coz.io/transaction/neo3/mainnet"

const payloadChecksumHeader = "payload_checksum"

type NotificationMessage struct {
	Id          string
	User        string //who is this message for so we can store it in the database
	Title       string
	Type        string
	Action      string
	Description string
	Meta        map[string]string
	CreatedAt   string
	MarkRead    bool
}

func NewNotificationMessage(p *NotificationMessage) NotificationMessage {
	uuid, _ := uuid.NewUUID()
	p.Id = uuid.String() //rand.Intn(10001-1) + 1
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
	gateAccount            wal.Account
	pool                   *pool.Pool
	selectedNetwork        NetworkData
	//fsCli                  *neofscli.Client
	//key                    *ecdsa.PrivateKey
	version string
	//c                      *cache.Cache
	ctx                                  context.Context
	wallet                               *wal.Wallet
	password                             string //warning this is not a good idea
	DEBUG                                bool
	enableCaching                        bool
	cancelServerContext                  context.CancelFunc
	uploadCancelFunc, downloadCancelFunc context.CancelFunc
	cancelUploadCtx, cancelDownloadCtx   context.Context

	//testing
	HexString, SaltString string
	variableListener      chan struct{}
}

const (
	CACHE_FILE_SYSTEM = "filesystem"
)

func (m *Manager) UnlockWallet() error {
	return m.wallet.Accounts[0].Decrypt(m.password, m.wallet.Scrypt)
}
func (m *Manager) LockWallet() {
	m.wallet.Accounts[0].Close()
}
func (m *Manager) RetrieveWIF() (string, error) {
	if err := m.UnlockWallet(); err != nil {
		return "", err
	}
	key := keys.PrivateKey{PrivateKey: m.wallet.Accounts[0].PrivateKey().PrivateKey}
	clipboard.WriteAll(key.WIF())
	return "", nil
}

// startup is called at application startup
func (m *Manager) Startup(ctx context.Context) {
	// Perform your setup here
	m.ctx = ctx
	if _, err := m.Pool(true); err != nil {
		log.Fatal("can't create pool", err)
	}
	m.variableListener = make(chan struct{})
	//go m.RetrieveFileSystem()
}

// domReady is called after the front-end dom has been loaded
func (m *Manager) DomReady(ctx context.Context) {
	m.checkForVersion()
	if m.wallet == nil {
		tmp := NewToastMessage(&UXMessage{
			Title:       "Get started",
			Type:        "info",
			Description: "Please load a wallet to start using Greenfinch",
		})
		m.MakeToast(tmp)
		runtime.EventsEmit(m.ctx, "select_wallet", true)
	}

	if _, err := m.SetSelectedNetwork("mainnet"); err != nil {
		log.Fatal("could not select network ", err)
	}
}
func (m Manager) Notifications() ([]NotificationMessage, error) {
	if m.wallet == nil {
		return nil, errors.New("no wallet selected")
	}
	notificationBytes, err := cache.RetrieveNotifications(m.wallet.Accounts[0].Address, m.selectedNetwork.ID)
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
	if m.wallet == nil {
		return errors.New("no wallet selected")
	}
	address := m.wallet.Accounts[0].Address
	if err := cache.DeleteNotications(address, m.selectedNetwork.ID); err != nil {
		return err
	}
	return nil
}
func (m Manager) MarkNotificationRead(uuid string) error {
	if m.wallet == nil {
		return errors.New("no wallet selected")
	}
	address := m.wallet.Accounts[0].Address
	fmt.Println("deleting notification ", uuid)
	if err := cache.DeleteNotification(address, m.selectedNetwork.ID, uuid); err != nil {
		return err
	}
	return nil
}
func (m *Manager) MakeNotification(message NotificationMessage) {
	if message.Meta == nil {
		message.Meta = make(map[string]string)
	}
	if m.wallet == nil {
		fmt.Println("no wallet found")
		return //no wallet yet to connect notifications with
	}
	message.User = m.wallet.Accounts[0].Address
	message = NewNotificationMessage(&message)
	marshal, err := json.Marshal(message)
	if err != nil {
		fmt.Println("error marshalling notification", err)
	}
	err = cache.UpsertNotification(message.User, m.selectedNetwork.ID, message.Id, marshal)
	if err != nil {
		fmt.Println("error upserting notification")
	}
	fmt.Println("notification message ", message)
	runtime.EventsEmit(m.ctx, "freshnotification", message)
}

// return the network addresses for the selected network
func (m *Manager) SetSelectedNetwork(network string) (NetworkData, error) {
	var ok bool
	fmt.Println("received network ", network)
	m.selectedNetwork, ok = networks[Network(network)]
	if !ok {
		return NetworkData{}, errors.New("no network with that name")
	}
	fmt.Println("selected network is network ", m.selectedNetwork)
	//here, everything should be reset, new pool etc, any clients referencing should now get from the managers networkData object.
	m.NetworkChangeNotification() //update the front end of network change
	if m.wallet != nil {
		m.pool = nil //reload the pool for the new network
		if _, err := m.Pool(false); err != nil {
			return NetworkData{}, err
		}
	}

	return m.selectedNetwork, nil
}

func (m *Manager) EnableCache(enable bool) error {
	m.enableCaching = enable
	return nil
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
		resp, err := http.Get("https://api.github.com/repos/configwizard/greenfinch.react/releases/latest")
		if err != nil {
			log.Println("err retrieving version", err)
		} else {
			var metadata struct {
				RemoteVersion string `json:"tag_name"`
			}
			body, err := ioutil.ReadAll(resp.Body)
			if err != nil {
				log.Println("Error retrieving remote version body", err)
			}
			if err := json.Unmarshal(body, &metadata); err != nil {
				fmt.Println("unmarshalling error ", err)
				return
			}
			fmt.Println("metadata ", metadata)
			trimmedRemoteVersion := strings.TrimPrefix(metadata.RemoteVersion, "v")
			remoteVersion, _ := semver.Make(trimmedRemoteVersion)
			fmt.Println("remote version ", remoteVersion)
			fmt.Println("parsing ", m.version)
			trimmedLocalVersion := strings.TrimPrefix(m.version, "v")
			v, err := semver.Parse(trimmedLocalVersion)
			if err != nil {
				log.Println("error with versioning. Not Semantic", err)
				tmp := NewToastMessage(&UXMessage{
					Title:       "Checking for update",
					Type:        "warning",
					Description: "Error with versioning " + err.Error() + " - " + m.version + " - " + trimmedLocalVersion,
				})
				m.MakeToast(tmp)
				return
			}

			log.Printf("version %+v comparing to %s - %d \r\n", v, remoteVersion, v.Compare(remoteVersion))
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

func (m *Manager) ContainersChanged() {
	runtime.EventsEmit(m.ctx, "containerschanged", nil)
}
func (m *Manager) NetworkChangeNotification() {
	runtime.EventsEmit(m.ctx, "networkchanged", m.selectedNetwork)
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

func (m Manager) TemporaryUserPublicKey() *keys.PublicKey {
	return m.wallet.Accounts[0].PublicKey()
}
func (m Manager) TemporaryUserPublicKeySolution() ecdsa.PublicKey {
	return ecdsa.PublicKey{
		Curve: m.wallet.Accounts[0].PublicKey().Curve,
		X:     m.wallet.Accounts[0].PublicKey().X,
		Y:     m.wallet.Accounts[0].PublicKey().Y,
	}
}
func (m Manager) TemporaryRetrieveUserWalletAddress() (string, error) {
	return m.wallet.Accounts[0].Address, nil
}
func (m Manager) TemporaryRetrieveUserID() (user.ID, error) {
	var k = m.wallet.Accounts[0].PrivateKey()
	usr := user.NewAutoIDSigner(k.PrivateKey)
	return usr.UserID(), nil
}
func (m Manager) TemporarySignContainerTokenWithPrivateKey(sc *session.Container) error {
	var k = m.wallet.Accounts[0].PrivateKey()
	return sc.Sign(user.NewAutoIDSigner(k.PrivateKey))
}
func (m Manager) TemporarySignObjectTokenWithPrivateKey(sc *session.Object) error {
	var k = m.wallet.Accounts[0].PrivateKey()
	return sc.Sign(user.NewAutoIDSigner(k.PrivateKey))
}
func (m Manager) TemporarySignBearerTokenWithPrivateKey(bt *bearer.Token) error {
	var k = m.wallet.Accounts[0].PrivateKey()
	var e neofsecdsa.Signer
	e = (neofsecdsa.Signer)(k.PrivateKey)
	return bt.Sign(e) //is this the owner who is giving access priveliges???
}

func (m *Manager) SetVariable(hex, salt string) {
	m.HexString = hex
	m.SaltString = salt
	fmt.Println("setting to ", m.HexString, m.SaltString)

	close(m.variableListener)
}

func (m *Manager) SignWithGoVerifyWithWC(sessionToken *session.Object) []byte {
	b, _ := m.SignWithWC(sessionToken)
	return b
}
func (m *Manager) SignWithWC(sessionToken *session.Object) ([]byte, error) {

	fmt.Println("sending token for signing")
	var k = m.wallet.Accounts[0].PrivateKey()
	var e neofsecdsa.SignerWalletConnect
	e = (neofsecdsa.SignerWalletConnect)(k.PrivateKey)
	userID := user.ResolveFromECDSAPublicKey(*(*ecdsa.PublicKey)(k.PublicKey())) //dereference
	sessionToken.SetIssuer(userID)
	var s v2session.Token
	sessionToken.WriteToV2(&s)
	binaryData := s.GetBody().StableMarshal(nil)
	b64 := make([]byte, base64.StdEncoding.EncodedLen(len(binaryData)))
	base64.StdEncoding.Encode(b64, binaryData)
	//runtime.EventsEmit(m.ctx, "new_signature", binaryData) //sending to front end for WC signing
	goSign, err := e.Sign(binaryData)
	if err != nil {
		fmt.Println("error signing ", err)
		return nil, err
	}
	var Tmp = struct {
		Signature []byte
		Data      []byte
	}{
		Signature: goSign,
		Data:      b64,
	}
	fmt.Println("sending ", Tmp)
	runtime.EventsEmit(m.ctx, "verify_signature", Tmp) //sending to front end for WC signing

	return goSign, nil
	//b64 := make([]byte, base64.StdEncoding.EncodedLen(len(binaryData)))
	//base64.StdEncoding.Encode(b64, binaryData)
	fmt.Println("signing base64 stuff ", string(b64))
	fmt.Printf("gosign %+v\r\n", goSign)

	<-m.variableListener
	fmt.Println("undecoded ", m.HexString)
	decodedHex, err := hex.DecodeString(m.HexString)
	if err != nil {
		fmt.Println("error decoding hex signature", err)
		return nil, err
	}
	decodedSalt, err := hex.DecodeString(m.SaltString)
	if err != nil {
		fmt.Println("error decoding hex signature", err)
		return nil, err
	}
	receivedSignature := append(decodedHex[:], decodedSalt[:]...)
	fmt.Printf("sign %+v\r\n", receivedSignature)
	fmt.Println("length ", len(decodedHex), len(decodedSalt))
	fmt.Println("verification ", e.Public().Verify(binaryData, append(decodedHex, decodedSalt...)))
	//just for comparison....
	signature := refs.Signature{}
	signature.SetSign(receivedSignature)
	signature.SetScheme(refs.ECDSA_RFC6979_SHA256_WALLET_CONNECT)
	signature.SetKey(k.PublicKey().Bytes())
	s.SetSignature(&signature)
	if err := sessionToken.ReadFromV2(s); err != nil {
		fmt.Println("tried reading ", err)
		return nil, err
	}
	fmt.Println("verify sig ", sessionToken.VerifySignature())
	return nil, nil
}
func NewFileSystemManager(version string, dbLocation string, DEBUG bool) (*Manager, error) {

	//move config location to database for development if not set?
	wd, err := os.Getwd()
	if err != nil {
		return nil, err
	}
	cache.DB(dbLocation)
	//we need an ephemeral key for the application to use for tokens that is not the user's key. The user's key should 'never' be used directly to make an action
	ephemeralAccount, err := wal.NewAccount()
	if err != nil {
		return nil, err
	}
	str, err := wallet.PrettyPrint(*ephemeralAccount)
	fmt.Println(str)
	if err != nil {
		log.Fatal(err)
	}
	m := &Manager{
		configLocation:  wd,
		gateAccount:     *ephemeralAccount,            //used to make requests to RPC endpoints and works on behalf of the user so never to expose their key anywhere
		selectedNetwork: networks[Network("mainnet")], //this should be set/stored in the database when the user selects it and once they have logged in update it.
		version:         version,
		enableCaching:   true,
		pool:            nil,
		ctx:             nil,
		DEBUG:           DEBUG,
	}

	return m, nil
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
			Description: err.Error(),
		}
		m.MakeToast(NewToastMessage(&tmp))
		return err
	}
	m.wallet = w
	err = m.wallet.Accounts[0].Decrypt(password, w.Scrypt)
	if err != nil {
		return err
	}
	m.ctx = context.Background()
	_, err = m.Pool(false)
	return err
}

// todo we will want to have things dependent on the wallet controlled elsewhere with singletons and no other way of getting the value
// todo remove the need to pass the private key to the api (usually for getOwnerID - however this should be passed into the backend
func (m *Manager) Pool(forceRenew bool) (*pool.Pool, error) {
	//force renew is required between wallet changes otherwise the wallet is connected to a pool from a different wallet
	//if m.wallet == nil { //i wonder if the pool can be the ephemeral wallet so we can make these requests quickly
	//	return nil, errors.New("no wallet selected yet")
	//}
	if forceRenew || m.pool == nil {
		//config, err := config.ReadConfig("cfg", m.configLocation)
		//if err != nil {
		//	fmt.Println("error reading config ", err)
		//	return nil, err
		//}
		//todo: this should be wallet connect pool

		pl, err := gspool.GetPool(m.ctx, m.gateAccount.PrivateKey().PrivateKey, m.selectedNetwork.StorageNodes)
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

func (m *Manager) EnableLocalServer(enable bool) {
	if m.wallet == nil {
		return
	}
	if enable {
		ctxWithCancel, cancel := context.WithCancel(m.ctx)
		m.cancelServerContext = cancel
		go m.SetupServer(ctxWithCancel)
	} else {
		m.cancelServerContext()
	}
}
func (m *Manager) retrieveWallet() (string, error) {
	if m.wallet == nil {
		return "", NotFound
	}
	return m.wallet.Accounts[0].Address, nil
}
func (m *Manager) GetAccountInformation() (Account, error) {
	fmt.Println(GetCurrentFunctionName(), " caller is ", GetCallerFunctionName())
	if m.wallet == nil {
		return Account{}, errors.New("no wallet loaded")
	}
	//fixme?? why did this cause a crash on a transaction??
	if len(m.wallet.Accounts) <= 0 {
		return Account{}, errors.New("no accounts in wallet")
	}
	if m.wallet.Accounts[0].PrivateKey() == nil {
		return Account{}, errors.New("no private key")
	}
	w, err := m.retrieveWallet()
	if err != nil {
		//if !errors.Is(err, NotFound) {
		//	return Account{m.retrieveWallet()}, err
		//}
		runtime.EventsEmit(m.ctx, "select_wallet", true)
		return Account{}, nil
	}
	balances, err := wallet.GetNep17Balances(w, wallet.RPC_NETWORK(m.selectedNetwork.RpcNodes[0]))
	if err != nil {
		return Account{}, err
	}
	fmt.Printf("retrieved balances %+v\r\n", balances)

	fmt.Println("getting account information ", m.pool)
	pl, err := m.Pool(true)
	if err != nil {
		fmt.Println("error retrieving pool. ", err)
		m.MakeNotification(NotificationMessage{
			Title:       "Error retrieving pool",
			Type:        "error",
			Description: err.Error(),
			MarkRead:    false,
		})
		return Account{}, errors.New("error connecting to node " + err.Error())
	}
	fmt.Println("getting account information ", m.pool)
	userID := user.ResolveFromECDSAPublicKey(*(*ecdsa.PublicKey)(m.TemporaryUserPublicKey()))
	blGet := client.PrmBalanceGet{}
	blGet.SetAccount(userID)

	fmt.Println("waiting to retrieve result")
	res, err := pl.BalanceGet(context.Background(), blGet)
	if err != nil {
		fmt.Errorf("error retrieving balance %w", err)
		m.MakeNotification(NotificationMessage{
			Title:       "Connecting to NeoFS error",
			Type:        "error",
			Description: "Connecting to NeoFS failed attempting to retrieve balance. There seems to be an issue" + err.Error(),
			MarkRead:    false,
		})
		tmp := UXMessage{
			Title:       "Connecting to NeoFS error",
			Type:        "error",
			Description: "See notifications for more information",
		}
		m.MakeToast(NewToastMessage(&tmp))
		return Account{}, err
	}

	k := m.TemporaryUserPublicKeySolution()
	var b = Account{
		Address:   w,
		PublicKey: hex.EncodeToString(elliptic.MarshalCompressed(elliptic.P256(), k.X, k.Y)),
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
