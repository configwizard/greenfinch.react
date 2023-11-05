package tokens

import (
	"crypto/ecdsa"
	"fmt"
	"github.com/nspcc-dev/neo-go/pkg/crypto/keys"
	"github.com/nspcc-dev/neofs-sdk-go/bearer"
	neofsecdsa "github.com/nspcc-dev/neofs-sdk-go/crypto/ecdsa"
	"github.com/nspcc-dev/neofs-sdk-go/eacl"
	"github.com/nspcc-dev/neofs-sdk-go/user"
)

// see here if you want to convert a time to an epoch https://github.com/nspcc-dev/neofs-s3-gw/blob/master/internal/neofs/neofs.go

func BuildUnsignedBearerToken(table *eacl.Table, lIat, lNbf, lExp uint64, gateKey *keys.PublicKey) (*bearer.Token, error) {
	gateID := user.ResolveFromECDSAPublicKey(*(*ecdsa.PublicKey)(gateKey)) //dereference
	var bearerToken bearer.Token

	bearerToken.SetEACLTable(*table)
	bearerToken.ForUser(gateID)
	bearerToken.SetExp(lExp)
	bearerToken.SetIat(lIat)
	bearerToken.SetNbf(lNbf)
	return &bearerToken, nil
}

func BuildBearerToken(key *keys.PrivateKey, table *eacl.Table, lIat, lNbf, lExp uint64, gateKey *keys.PublicKey) (*bearer.Token, error) {
	gateID := user.ResolveFromECDSAPublicKey(*(*ecdsa.PublicKey)(gateKey)) //dereference

	var bearerToken bearer.Token
	//i understand this will restrict everything to the 'other' accounts
	for _, r := range restrictedRecordsForOthers() {
		table.AddRecord(r)
	}

	bearerToken.SetEACLTable(*table)
	bearerToken.ForUser(gateID)
	bearerToken.SetExp(lExp)
	bearerToken.SetIat(lIat)
	bearerToken.SetNbf(lNbf)
	var e neofsecdsa.Signer
	e = (neofsecdsa.Signer)(key.PrivateKey)
	err := bearerToken.Sign(e) //is this the owner who is giving access priveliges???
	if err != nil {
		return nil, fmt.Errorf("sign bearer token: %w", err)
	}
	return &bearerToken, nil
}
