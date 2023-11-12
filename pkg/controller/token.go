package controller

//
//import (
//	"crypto/ecdsa"
//	"errors"
//	"fmt"
//	"github.com/amlwwalker/greenfinch.react/pkg/tokens"
//	"github.com/amlwwalker/greenfinch.react/pkg/utils"
//	"github.com/nspcc-dev/neo-go/pkg/crypto/keys"
//	"github.com/nspcc-dev/neo-go/pkg/wallet"
//	"github.com/nspcc-dev/neofs-sdk-go/bearer"
//	cid "github.com/nspcc-dev/neofs-sdk-go/container/id"
//	neofscrypto "github.com/nspcc-dev/neofs-sdk-go/crypto"
//	"github.com/nspcc-dev/neofs-sdk-go/eacl"
//	"github.com/nspcc-dev/neofs-sdk-go/user"
//)
//
//type Token interface {
//	InvalidAt(epoch uint64) bool
//	Sign() error
//}
//
//type BearerToken struct {
//	BearerToken *bearer.Token
//}
//
//func (b BearerToken) Sign() error {
//	if b.BearerToken == nil {
//		return errors.New(ErrorNoToken)
//	}
//	var signer neofscrypto.Signer
//	return b.BearerToken.Sign(signer)
//}
//func (b BearerToken) InvalidAt(epoch uint64) bool {
//	return true
//}
//
//// TokenManager is responsible for keeping track of all valid sessions so not to need to resign every time
//// for now just bearer tokens, for object actions, containers use sessions and will sign for each action
//// listing containers does not need a token
//type TokenManager struct {
//	BearerTokens map[string]bearer.Token //Will be loaded from database if we want to keep sessions across closures.
//	EphemeralAccount wallet.Account
//}
//	gateSigner := user.NewAutoIDSignerRFC6979(ephemeralAccount.PrivateKey().PrivateKey)
//}
//
//func (t *TokenManager) New() (TokenManager, error) {
//	ephemeralAccount, err := wallet.NewAccount()
//	if err != nil {
//		return TokenManager{}, err
//	}
//	return TokenManager{BearerTokens: make(map[string]bearer.Token), EphemeralAccount: *ephemeralAccount}, nil
//}
//
//func (t *TokenManager) AddBearerToken(address string, id cid.ID, b bearer.Token) {
//	t.BearerTokens[fmt.Sprintf("%s.%s", address, id)] = b
//}
//
//// FindBearerToken should see if we have a valid token to do the job. If not create a new one.
//func (t *TokenManager) FindBearerToken(address string, id cid.ID, epoch uint64, operation eacl.Operation) (bearer.Token, error) {
//	if tok, ok := t.BearerTokens[address]; ok && tok.InvalidAt(1) {
//		// we now need to check the rules the token needs to have
//		if !tok.AssertContainer(id) {
//			return tok, errors.New(utils.ErrorNoToken)
//		}
//		if tok.InvalidAt(epoch) {
//			return tok, errors.New(utils.ErrorNoToken)
//		}
//		records := tok.EACLTable().Records()
//		for _, v := range records {
//			if v.Operation() == operation && v.Action() == eacl.ActionAllow {
//				return tok, nil
//			}
//		}
//		return tok, errors.New(utils.ErrorNoToken)
//	}
//	return bearer.Token{}, errors.New(utils.ErrorNoToken)
//}
//
//// NewBearerToken - if we don't have a valid bearer token, we'll need to create a new one.
//func (t *TokenManager) NewBearerToken(table *eacl.Table, lIat, lNbf, lExp uint64, temporaryKey *keys.PublicKey) (bearer.Token, error) {
//	temporaryUser := user.ResolveFromECDSAPublicKey(*(*ecdsa.PublicKey)(temporaryKey))
//	var bearerToken bearer.Token
//
//	bearerToken.SetEACLTable(*table)
//	bearerToken.ForUser(temporaryUser) //temporarily give this key rights to the actions in the table.
//	bearerToken.SetExp(lExp)
//	bearerToken.SetIat(lIat)
//	bearerToken.SetNbf(lNbf)
//	return bearerToken, nil
//}
