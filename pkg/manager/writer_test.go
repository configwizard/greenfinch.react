package manager

import (
	"bytes"
	"context"
	"github.com/google/uuid"
	"github.com/nspcc-dev/neo-go/pkg/crypto/keys"
	"github.com/nspcc-dev/neo-go/pkg/wallet"
	"github.com/nspcc-dev/neofs-sdk-go/bearer"
	"github.com/nspcc-dev/neofs-sdk-go/client"
	"github.com/nspcc-dev/neofs-sdk-go/container"
	"github.com/nspcc-dev/neofs-sdk-go/container/acl"
	cid "github.com/nspcc-dev/neofs-sdk-go/container/id"
	"github.com/nspcc-dev/neofs-sdk-go/netmap"
	"github.com/nspcc-dev/neofs-sdk-go/object"
	"github.com/nspcc-dev/neofs-sdk-go/object/slicer"
	"github.com/nspcc-dev/neofs-sdk-go/session"
	"github.com/nspcc-dev/neofs-sdk-go/user"
	"github.com/nspcc-dev/neofs-sdk-go/waiter"
	"github.com/stretchr/testify/require"
	"log"
	"testing"
	"time"
)

func TemporarySignObjectTokenWithPrivateKey(w *wallet.Wallet, sc *session.Object) error {
	acc := w.Accounts[0]
	var k = acc.PrivateKey()
	return sc.Sign(user.NewAutoIDSigner(k.PrivateKey))
}
func TemporaryRetrieveUserID(w *wallet.Wallet) (user.ID, error) {
	acc := w.Accounts[0]
	var k = acc.PrivateKey()
	usr := user.NewAutoIDSignerRFC6979(k.PrivateKey)
	return usr.UserID(), nil
}
func TemporarySignBearerTokenWithPrivateKey(w wallet.Wallet, bt *bearer.Token) error {
	acc := w.Accounts[0]
	usrSigner := user.NewAutoIDSignerRFC6979(acc.PrivateKey().PrivateKey)
	return bt.Sign(usrSigner) //is this the owner who is giving access priveliges???
}
func TestSlicerRelay(t *testing.T) {
	const endpoint = "grpcs://st1.t5.fs.neo.org:8082"
	const strCnr = "8C6PxKix8BAW8gPpZqigmJwZdmMjHYUbv1pnrGn4bCY9"
	payload := bytes.NewReader([]byte("Hello, world!"))
	ctx := context.Background()

	gateAcc, err := wallet.NewAccount()
	require.NoError(t, err)

	usrWallet, err := wallet.NewWalletFromFile("/Users/alexwalker/dot.wallets/wallet.json")
	require.NoError(t, err)

	usrAcc := usrWallet.Accounts[0]

	err = usrAcc.Decrypt("password", keys.NEP2ScryptParams())
	require.NoError(t, err)
	var gateSigner user.Signer = user.NewAutoIDSignerRFC6979(gateAcc.PrivateKey().PrivateKey)

	userId, _ := TemporaryRetrieveUserID(usrWallet)
	require.NoError(t, err)
	var prmInit client.PrmInit

	c, err := client.New(prmInit)
	require.NoError(t, err)

	var prmDial client.PrmDial
	prmDial.SetTimeout(3 * time.Second)
	prmDial.SetServerURI(endpoint)

	require.NoError(t, c.Dial(prmDial))

	t.Cleanup(func() {
		_ = c.Close()
	})

	var cont container.Container
	cont.Init()
	cont.SetBasicACL(acl.PublicRWExtended)
	cont.SetOwner(userId)
	cont.SetName("containerName")
	cont.SetCreationTime(time.Now())

	var pp netmap.PlacementPolicy
	pp.SetContainerBackupFactor(1)
	var rd netmap.ReplicaDescriptor
	rd.SetNumberOfObjects(1)
	pp.AddReplicas(rd)
	cont.SetPlacementPolicy(pp)

	var prmContPut client.PrmContainerPut

	wait := waiter.NewWaiter(c, 1*time.Second)

	var cnr cid.ID
	require.NoError(t, cnr.DecodeString(strCnr))
	//pr create a new container - but can you use the gateKey?
	usrSigner := user.NewAutoIDSignerRFC6979(usrAcc.PrivateKey().PrivateKey) //just for the container creation
	contID, err := wait.ContainerPut(ctx, cont, usrSigner, prmContPut)
	require.NoError(t, err)

	log.Println("container: ", cnr)

	netInfo, err := c.NetworkInfo(ctx, client.PrmNetworkInfo{})
	require.NoError(t, err)
	//if you use a bearer i imagine it's something similar to this
	//var bearerToken bearer.Token //.Object
	//bearerToken.ForUser(gateSigner.UserID())
	//bearerToken.SetIat(netInfo.CurrentEpoch())
	//bearerToken.SetNbf(netInfo.CurrentEpoch())
	//bearerToken.SetExp(netInfo.CurrentEpoch() + 100) // or particular exp value
	////bearerToken.BindContainer(contID)
	//bearerToken.EACLTable()
	//r := eacl.Record{}
	//equal := eacl.MatchStringEqual
	//equal.DecodeString(contID.String())
	//r.AddObjectContainerIDFilter(equal, contID)
	//r.SetOperation(eacl.OperationPut)
	//r.SetAction(eacl.ActionAllow)
	//tab := eacl.Table{}
	//tab.AddRecord(&r)
	//bearerToken.SetEACLTable(tab)
	//
	var sessionToken session.Object
	sessionToken.SetAuthKey(gateSigner.Public())
	sessionToken.SetID(uuid.New())
	sessionToken.SetIat(netInfo.CurrentEpoch())
	sessionToken.SetNbf(netInfo.CurrentEpoch())
	sessionToken.SetExp(netInfo.CurrentEpoch() + 100) // or particular exp value
	sessionToken.BindContainer(contID)
	sessionToken.ForVerb(session.VerbObjectPut)

	require.NoError(t, TemporarySignObjectTokenWithPrivateKey(usrWallet, &sessionToken))

	_slicer, err := slicer.New(ctx, c, gateSigner, contID, userId, &sessionToken)

	attr := object.Attribute{}
	attr.SetKey(object.AttributeFileName)
	attr.SetValue("alex-testing-something")

	id, err := _slicer.Put(ctx, payload, []object.Attribute{attr})
	require.NoError(t, err)
	log.Println("object: ", id)
}
