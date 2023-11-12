package manager

import (
	"crypto/ecdsa"
	"encoding/hex"
	"fmt"
	"github.com/google/uuid"
	wal "github.com/nspcc-dev/neo-go/pkg/wallet"
	cid "github.com/nspcc-dev/neofs-sdk-go/container/id"
	neofscrypto "github.com/nspcc-dev/neofs-sdk-go/crypto"
	neofsecdsa "github.com/nspcc-dev/neofs-sdk-go/crypto/ecdsa"
	"github.com/nspcc-dev/neofs-sdk-go/session"
	"github.com/nspcc-dev/neofs-sdk-go/user"
	"testing"
)

// const originalMessage = "Hello, world!"
const hexSignature = "6eb490f17f30c3e85f032ff47247499efe5cb0ce94dab5e31647612e361053574c96d584d3c185fb8474207e8f649d856b4d60b573a195d5e67e621a2b4c7f87"
const hexPubKey = "0382fcb005ae7652401fbe1d6345f77110f98db7122927df0f3faf3b62d1094071"
const hexSalt = "3da1f339213180ed4c46a12b6bd57eb6"
const hexSignedMessage = "" +
	"010001f0" + // fixed scheme prefix
	"34" + // length of salted message in bytes: 2x16 bytes for hex salt + 20 bytes for base64-encoded hello world = 52 (0x34)
	"3364613166333339323133313830656434633436613132623662643537656236" + // hex-encoded salt
	"534756736247387349486476636d786b49513d3d" + // message to sign (base64-encoded hello world)
	"0000" // fixed scheme suffix

var signedData []byte
var ephemeralAccount *wal.Account

func TestVerification(t *testing.T) {
	gateSigner := user.NewAutoIDSignerRFC6979(ephemeralAccount.PrivateKey().PrivateKey)

	var sessionToken session.Object

	cnr := cid.ID{}
	sessionToken.SetAuthKey(gateSigner.Public()) //gateSigner.Public()
	sessionToken.SetID(uuid.New())
	sessionToken.SetIat(0)
	sessionToken.SetNbf(0)
	sessionToken.SetExp(0) // or particular exp value
	sessionToken.BindContainer(cnr)
	sessionToken.ForVerb(session.VerbObjectPut)
	// decode public key from HEX
	bPubKey, err := hex.DecodeString(hexPubKey)
	if err != nil {
		t.Fatal(err)
	}

	var pubKey neofsecdsa.PublicKeyWalletConnect
	if err != nil {
		t.Fatal(err)
	}
	pubKey.Decode(bPubKey)

	//issuer := user.ResolveFromECDSAPublicKey((ecdsa.PublicKey)(pubKey)) //dereference
	//sessionToken.SetIssuer(issuer)
	//signedData := sessionToken.SignedData()
	//b64Data := make([]byte, base64.StdEncoding.EncodedLen(len(signedData)))
	//base64.StdEncoding.Encode(b64Data, signedData)
	bSig, err := hex.DecodeString(hexSignature)
	if err != nil {
		fmt.Println("error decoding hex signature", err)
		t.Fatal(err)
	}
	salt, err := hex.DecodeString(hexSalt)
	if err != nil {
		fmt.Println("error decoding hex signature", err)
		t.Fatal(err)
	}
	fmt.Println("verification ", pubKey.Verify(signedData, append(bSig, salt...)))

	staticSigner := neofscrypto.NewStaticSigner(neofscrypto.ECDSA_WALLETCONNECT, append(bSig, salt...), &pubKey)

	issuer := user.ResolveFromECDSAPublicKey((ecdsa.PublicKey)(pubKey)) //dereference
	err = sessionToken.Sign(user.NewSigner(staticSigner, issuer))
	if err != nil {
		t.Fatal(err)
	}
	fmt.Println("verify sig ", sessionToken.VerifySignature())
}

func TestCreateSignablePayload(t *testing.T) {
	var err error
	ephemeralAccount, err := wal.NewAccount()
	if err != nil {
		t.Fatal("failed to create wallet - ", err)
	}
	gateSigner := user.NewAutoIDSignerRFC6979(ephemeralAccount.PrivateKey().PrivateKey)

	var sessionToken session.Object

	cnr := cid.ID{}
	sessionToken.SetAuthKey(gateSigner.Public()) //gateSigner.Public()
	sessionToken.SetID(uuid.New())
	sessionToken.SetIat(0)
	sessionToken.SetNbf(0)
	sessionToken.SetExp(0) // or particular exp value
	sessionToken.BindContainer(cnr)
	sessionToken.ForVerb(session.VerbObjectPut)

	// decode public key from the WC response
	bPubKey, err := hex.DecodeString(hexPubKey)
	if err != nil {
		t.Fatal(err)
	}
	var pubKey neofsecdsa.PublicKeyWalletConnect
	err = pubKey.Decode(bPubKey)
	if err != nil {
		t.Fatal(err)
	}
	issuer := user.ResolveFromECDSAPublicKey((ecdsa.PublicKey)(pubKey)) //dereference
	sessionToken.SetIssuer(issuer)
	signableData := sessionToken.SignedData()

	fmt.Println("signable data ", hex.EncodeToString(signableData))
}
