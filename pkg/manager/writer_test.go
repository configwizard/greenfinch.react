package manager

import (
	"context"
	"github.com/google/uuid"
	"github.com/nspcc-dev/neo-go/pkg/crypto/keys"
	"github.com/nspcc-dev/neo-go/pkg/wallet"
	"github.com/nspcc-dev/neofs-sdk-go/client"
	cid "github.com/nspcc-dev/neofs-sdk-go/container/id"
	neofscrypto "github.com/nspcc-dev/neofs-sdk-go/crypto"
	neofsecdsa "github.com/nspcc-dev/neofs-sdk-go/crypto/ecdsa"
	"github.com/nspcc-dev/neofs-sdk-go/object"
	"github.com/nspcc-dev/neofs-sdk-go/object/slicer"
	"github.com/nspcc-dev/neofs-sdk-go/session"
	"github.com/stretchr/testify/require"
	"log"
	"strings"
	"testing"
	"time"
)

func TestSlicerRelay(t *testing.T) {
	const endpoint = "grpcs://st4.t5.fs.neo.org:8080"
	const strCnr = "8C6PxKix8BAW8gPpZqigmJwZdmMjHYUbv1pnrGn4bCY9"
	payload := strings.NewReader("Hello, world!")
	ctx := context.Background()

	gateAcc, err := wallet.NewAccount()
	require.NoError(t, err)

	usrWallet, err := wallet.NewWalletFromFile("/Users/alex.walker/go/src/github.com/amlwwalker/greenfinch.react/wallets/wallet.json")
	require.NoError(t, err)

	usrAcc := usrWallet.Accounts[0]

	err = usrAcc.Decrypt("password", keys.NEP2ScryptParams())
	require.NoError(t, err)

	var gateSigner neofscrypto.Signer = neofsecdsa.SignerRFC6979(gateAcc.PrivateKey().PrivateKey)
	var usrSigner neofscrypto.Signer = neofsecdsa.Signer(usrAcc.PrivateKey().PrivateKey)

	var cnr cid.ID
	require.NoError(t, cnr.DecodeString(strCnr))

	var prmInit client.PrmInit

	c, err := client.New(prmInit)
	require.NoError(t, err)

	var prmDial client.PrmDial
	prmDial.SetTimeout(1 * time.Minute)
	prmDial.SetServerURI(endpoint)

	require.NoError(t, c.Dial(prmDial))

	t.Cleanup(func() {
		_ = c.Close()
	})

	netInfo, err := c.NetworkInfo(ctx, client.PrmNetworkInfo{})
	require.NoError(t, err)

	var opts slicer.Options
	opts.SetObjectPayloadLimit(netInfo.MaxObjectSize())
	opts.SetCurrentNeoFSEpoch(netInfo.CurrentEpoch())
	if !netInfo.HomomorphicHashingDisabled() {
		opts.CalculateHomomorphicChecksum()
	}

	var sessionToken session.Object
	sessionToken.SetAuthKey(gateSigner.Public())
	sessionToken.SetID(uuid.New())
	sessionToken.SetIat(netInfo.CurrentEpoch())
	sessionToken.SetNbf(netInfo.CurrentEpoch())
	sessionToken.SetExp(netInfo.CurrentEpoch() + 100) // or particular exp value
	sessionToken.BindContainer(cnr)
	sessionToken.ForVerb(session.VerbObjectPut)

	require.NoError(t, sessionToken.Sign(usrSigner))

	objWriter := &objectWriter{
		context: ctx,
		client:  c,
		session: &sessionToken,
	}

	_slicer := slicer.NewSession(gateSigner, cnr, sessionToken, objWriter, opts)

	id, err := _slicer.Slice(payload, object.AttributeFileName, "alex-testing-something")
	require.NoError(t, err)
	log.Println("object:", id)
}