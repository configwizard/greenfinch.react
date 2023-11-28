package tokens

import (
	"crypto/ecdsa"
	"encoding/hex"
	"errors"
	"fmt"
	"github.com/amlwwalker/greenfinch.react/pkg/payload"
	"github.com/amlwwalker/greenfinch.react/pkg/utils"
	"github.com/nspcc-dev/neo-go/pkg/crypto/keys"
	"github.com/nspcc-dev/neo-go/pkg/wallet"
	"github.com/nspcc-dev/neofs-api-go/v2/acl"
	"github.com/nspcc-dev/neofs-api-go/v2/refs"
	"github.com/nspcc-dev/neofs-sdk-go/bearer"
	cid "github.com/nspcc-dev/neofs-sdk-go/container/id"
	neofscrypto "github.com/nspcc-dev/neofs-sdk-go/crypto"
	neofsecdsa "github.com/nspcc-dev/neofs-sdk-go/crypto/ecdsa"
	"github.com/nspcc-dev/neofs-sdk-go/eacl"
	"github.com/nspcc-dev/neofs-sdk-go/session"
	"github.com/nspcc-dev/neofs-sdk-go/user"
)

type Token interface {
	InvalidAt(epoch uint64) bool
	Sign(issuerAddress string, p payload.Payload) error
	SignedData() []byte
}

type PrivateKeyToken struct {
	BearerToken *bearer.Token
	Wallet      *wallet.Wallet
}

func (m PrivateKeyToken) InvalidAt(epoch uint64) bool {
	return false
}
func (m PrivateKeyToken) Sign(issuerAddress string, signedPayload payload.Payload) error {
	//this is the same as below however we receive something that can become a signature directly
	//fixme: types of signing should not be part of the controller
	if m.Wallet == nil {
		return errors.New(utils.ErrorNoSession)
	}
	signature := refs.Signature{}
	signature.SetSign(signedPayload.OutgoingData)
	signature.SetScheme(refs.ECDSA_RFC6979_SHA256)
	signature.SetKey(m.Wallet.Accounts[0].PublicKey().Bytes())

	var b acl.BearerToken
	m.BearerToken.WriteToV2(&b) //convert the token to a v2 type
	b.SetSignature(&signature)  //so that we can sgn it
	//then read it back into a 'new' type
	if err := m.BearerToken.ReadFromV2(b); err != nil {
		fmt.Println("tried reading ", err)
		return err
	}
	return nil
}

func (m PrivateKeyToken) SignedData() []byte {
	return make([]byte, 0)
}

type PrivateKeyTokenManager struct {
	BearerTokens map[string]Token //Will be loaded from database if we want to keep sessions across closures.
	W            wallet.Account
	HaveToken    bool
}

func (t PrivateKeyTokenManager) AddBearerToken(address string, cnrID string, b Token) {
	t.BearerTokens[fmt.Sprintf("%s.%s", address, cnrID)] = b

}
func (t PrivateKeyTokenManager) NewBearerToken(table eacl.Table, lIat, lNbf, lExp uint64, temporaryKey *keys.PublicKey) (Token, error) {
	temporaryUser := user.ResolveFromECDSAPublicKey(*(*ecdsa.PublicKey)(temporaryKey))
	var bearerToken bearer.Token
	bearerToken.SetEACLTable(table)
	bearerToken.ForUser(temporaryUser) //temporarily give this key rights to the actions in the table.
	bearerToken.SetExp(lExp)
	bearerToken.SetIat(lIat)
	bearerToken.SetNbf(lNbf)
	return PrivateKeyToken{BearerToken: &bearerToken}, nil
}
func (t PrivateKeyTokenManager) FindBearerToken(address string, id cid.ID, epoch uint64, operation eacl.Operation) (Token, error) {

	if tok, ok := t.BearerTokens[fmt.Sprintf("%s.%s", address, id)]; !ok || tok.InvalidAt(1) {
		return PrivateKeyToken{}, errors.New(utils.ErrorNoToken)
	} else {
		tok, ok := tok.(PrivateKeyToken)
		if !ok {
			return nil, errors.New(utils.ErrorNoToken)
		}
		bearerToken := tok.BearerToken
		// we now need to check the rules the token needs to have
		if !bearerToken.AssertContainer(id) {
			return PrivateKeyToken{}, errors.New(utils.ErrorNoToken)
		}
		if tok.InvalidAt(epoch) { //fix me unnecessary
			return tok, errors.New(utils.ErrorNoToken)
		}
		records := bearerToken.EACLTable().Records()
		for _, v := range records {
			if v.Operation() == operation && v.Action() == eacl.ActionAllow {
				return tok, nil
			}
		}
	}
	return PrivateKeyToken{}, errors.New(utils.ErrorNoToken)
}

func (t PrivateKeyTokenManager) GateKey() wallet.Account {
	return t.W
}

type ObjectSessionToken struct {
	SessionToken *session.Object
}

func (s ObjectSessionToken) InvalidAt(epoch uint64) bool {
	return s.SessionToken.InvalidAt(epoch)
}

func (s ObjectSessionToken) SignedData() []byte {
	return s.SessionToken.SignedData()
}

func (s ObjectSessionToken) Sign(issuerAddress string, p payload.Payload) error {
	if s.SessionToken == nil {
		return errors.New(utils.ErrorNoToken)
	}
	var issuer user.ID
	err := issuer.DecodeString(issuerAddress)
	if err != nil {
		return err
	}
	if p.Signature == nil {
		return errors.New(utils.ErrorNoSignature)
	}
	bSig, err := hex.DecodeString(p.Signature.HexSignature)
	if err != nil {
		fmt.Println("error decoding hex signature", err)
		return err
	}
	salt, err := hex.DecodeString(p.Signature.HexSalt)
	if err != nil {
		fmt.Println("error decoding hex signature", err)
		return err
	}

	bPubKey, err := hex.DecodeString(p.Signature.HexPublicKey)
	if err != nil {
		return err
	}
	var pubKey neofsecdsa.PublicKeyWalletConnect
	err = pubKey.Decode(bPubKey)
	if err != nil {
		return err
	}
	staticSigner := neofscrypto.NewStaticSigner(neofscrypto.ECDSA_WALLETCONNECT, append(bSig, salt...), &pubKey)
	err = s.SessionToken.Sign(user.NewSigner(staticSigner, issuer))
	if err != nil {
		return err
	}
	if !s.SessionToken.VerifySignature() {
		return errors.New(utils.ErrorNoSignature)
	}
	return nil
}

type BearerToken struct {
	BearerToken *bearer.Token
}

func (b BearerToken) Sign(issuerAddress string, p payload.Payload) error {
	if b.BearerToken == nil {
		return errors.New(utils.ErrorNoToken)
	}
	var issuer user.ID
	err := issuer.DecodeString(issuerAddress)
	if err != nil {
		return err
	}
	if p.Signature == nil {
		return errors.New(utils.ErrorNoSignature)
	}
	bSig, err := hex.DecodeString(p.Signature.HexSignature)
	if err != nil {
		fmt.Println("error decoding hex signature", err)
		return err
	}
	salt, err := hex.DecodeString(p.Signature.HexSalt)
	if err != nil {
		fmt.Println("error decoding hex signature", err)
		return err
	}

	bPubKey, err := hex.DecodeString(p.Signature.HexPublicKey)
	if err != nil {
		return err
	}
	var pubKey neofsecdsa.PublicKeyWalletConnect
	err = pubKey.Decode(bPubKey)
	if err != nil {
		return err
	}
	staticSigner := neofscrypto.NewStaticSigner(neofscrypto.ECDSA_WALLETCONNECT, append(bSig, salt...), &pubKey)
	err = b.BearerToken.Sign(user.NewSigner(staticSigner, issuer))
	if err != nil {
		return err
	}
	if !b.BearerToken.VerifySignature() {
		return errors.New(utils.ErrorNoSignature)
	}
	return nil
}
func (b BearerToken) InvalidAt(epoch uint64) bool {
	return b.BearerToken.InvalidAt(epoch)
}

func (b BearerToken) SignedData() []byte {
	return b.BearerToken.SignedData()
}

// WalletConnectTokenManager is responsible for keeping track of all valid sessions so not to need to resign every time
// for now just bearer tokens, for object actions, containers use sessions and will sign for each action
// listing containers does not need a token
type WalletConnectTokenManager struct {
	BearerTokens map[string]Token //Will be loaded from database if we want to keep sessions across closures.
	W            wallet.Account
}

func (t *WalletConnectTokenManager) New() (WalletConnectTokenManager, error) {
	ephemeralAccount, err := wallet.NewAccount()
	if err != nil {
		return WalletConnectTokenManager{}, err
	}
	return WalletConnectTokenManager{BearerTokens: make(map[string]Token), W: *ephemeralAccount}, nil
}

func (t WalletConnectTokenManager) GateKey() wallet.Account {
	return t.W
}

func (t WalletConnectTokenManager) AddBearerToken(address, cnrID string, b Token) {
	t.BearerTokens[fmt.Sprintf("%s.%s", address, cnrID)] = b
}

// FindBearerToken should see if we have a valid token to do the job. If not create a new one.
func (t WalletConnectTokenManager) FindBearerToken(address string, id cid.ID, epoch uint64, operation eacl.Operation) (Token, error) {
	if tok, ok := t.BearerTokens[fmt.Sprintf("%s.%s", address, id)]; ok && tok.InvalidAt(1) {
		tok, ok := tok.(BearerToken)
		if !ok {
			return nil, errors.New("no beaer token")
		}
		bearerToken := tok.BearerToken
		// we now need to check the rules the token needs to have
		if !bearerToken.AssertContainer(id) {
			return BearerToken{}, errors.New(utils.ErrorNoToken)
		}
		if tok.InvalidAt(epoch) {
			return tok, errors.New(utils.ErrorNoToken)
		}
		records := bearerToken.EACLTable().Records()
		for _, v := range records {
			if v.Operation() == operation && v.Action() == eacl.ActionAllow {
				return tok, nil
			}
		}
		return BearerToken{}, errors.New(utils.ErrorNoToken)
	}
	return BearerToken{}, errors.New(utils.ErrorNoToken)
}

func (t *WalletConnectTokenManager) WrapToken(token bearer.Token) Token {
	return BearerToken{&token}
}

// NewBearerToken - if we don't have a valid bearer token, we'll need to create a new one.
func (t WalletConnectTokenManager) NewBearerToken(table eacl.Table, lIat, lNbf, lExp uint64, temporaryKey *keys.PublicKey) (Token, error) {
	temporaryUser := user.ResolveFromECDSAPublicKey(*(*ecdsa.PublicKey)(temporaryKey))
	var bearerToken bearer.Token
	bearerToken.SetEACLTable(table)
	bearerToken.ForUser(temporaryUser) //temporarily give this key rights to the actions in the table.
	bearerToken.SetExp(lExp)
	bearerToken.SetIat(lIat)
	bearerToken.SetNbf(lNbf)
	return BearerToken{&bearerToken}, nil
}

//
//func (t *WalletConnectTokenManager) AddBearerTokenByOperation(address string, operation eacl.Operation, bt *bearer.Token) {
//	t.BearerTokens[fmt.Sprintf("%s.%d", address, operation)] = BearerToken{BearerToken: bt}
//}

func GeneratePermissionsTable(cid cid.ID, toWhom eacl.Target) eacl.Table {
	table := eacl.Table{}

	headAllowRecord := eacl.NewRecord()
	headAllowRecord.SetOperation(eacl.OperationHead)
	headAllowRecord.SetAction(eacl.ActionAllow)
	headAllowRecord.SetTargets(toWhom)

	rangeAllowRecord := eacl.NewRecord()
	rangeAllowRecord.SetOperation(eacl.OperationRange)
	rangeAllowRecord.SetAction(eacl.ActionAllow)
	rangeAllowRecord.SetTargets(toWhom)

	searchAllowRecord := eacl.NewRecord()
	searchAllowRecord.SetOperation(eacl.OperationSearch)
	searchAllowRecord.SetAction(eacl.ActionAllow)
	searchAllowRecord.SetTargets(toWhom)

	getAllowRecord := eacl.NewRecord()
	getAllowRecord.SetOperation(eacl.OperationGet)
	getAllowRecord.SetAction(eacl.ActionAllow)
	getAllowRecord.SetTargets(toWhom)

	putAllowRecord := eacl.NewRecord()
	putAllowRecord.SetOperation(eacl.OperationPut)
	putAllowRecord.SetAction(eacl.ActionAllow)
	putAllowRecord.SetTargets(toWhom)

	deleteAllowRecord := eacl.NewRecord()
	deleteAllowRecord.SetOperation(eacl.OperationDelete)
	deleteAllowRecord.SetAction(eacl.ActionAllow)
	deleteAllowRecord.SetTargets(toWhom)

	table.SetCID(cid)
	table.AddRecord(getAllowRecord)
	table.AddRecord(headAllowRecord)
	table.AddRecord(putAllowRecord)
	table.AddRecord(deleteAllowRecord)
	//now handle all the records for other users
	for op := eacl.OperationGet; op <= eacl.OperationRangeHash; op++ {
		record := eacl.NewRecord()
		record.SetOperation(op)
		record.SetAction(eacl.ActionDeny)
		eacl.AddFormedTarget(record, eacl.RoleOthers)
		table.AddRecord(record)
	}
	return table
}
