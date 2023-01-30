package wallet

import (
	"crypto/ecdsa"
	"crypto/elliptic"
	"encoding/hex"
	"encoding/json"
	"errors"
	"github.com/nspcc-dev/neo-go/pkg/core/native/nativenames"
	"github.com/nspcc-dev/neo-go/pkg/encoding/base58"
	client "github.com/nspcc-dev/neo-go/pkg/rpcclient"
	"github.com/nspcc-dev/neo-go/pkg/util"
	"math/big"
)

const (
	// NEO2Prefix is the first byte of address for NEO2.
	NEO2Prefix byte = 0x17
	// NEO3Prefix is the first byte of address for NEO3.
	NEO3Prefix byte = 0x35
)

// Prefix is the byte used to prepend to addresses when encoding them, it can
// be changed and defaults to 53 (0x35), the standard NEO prefix.
var Prefix = NEO3Prefix

//func OwnerIDFromPrivateKey(key *ecdsa.PrivateKey) (*owner.ID, error) {
//	return OwnerIDFromPublicKey(&key.PublicKey)
//}
//
//func OwnerIDFromPublicKey(key *ecdsa.PublicKey) (*owner.ID, error) {
//	return owner.NewIDFromPublicKey(key), nil
//}

func PrettyPrint(data interface{}) (string, error) {
	val, err := json.MarshalIndent(data, "", "    ")
	if err != nil {
		return "", err
	}
	return string(val), nil
}

func GasToken(cli client.Client) (util.Uint160, error) {
	gasToken, err := cli.GetNativeContractHash(nativenames.Gas)
	return gasToken, err
}

//converting addresses
//https://github.com/nspcc-dev/neo-go/blob/613a23cc3f6c303882a81b61f3baec39b7e84597/pkg/encoding/address/address.go

// Uint160ToString returns the "NEO address" from the given Uint160.
func Uint160ToString(u util.Uint160) string {
	// Dont forget to prepend the Address version 0x17 (23) A
	b := append([]byte{Prefix}, u.BytesBE()...)
	return base58.CheckEncode(b)
}

// StringToUint160 attempts to decode the given NEO address string
// into an Uint160.
func StringToUint160(s string) (u util.Uint160, err error) {
	b, err := base58.CheckDecode(s)
	if err != nil {
		return u, err
	}
	if b[0] != Prefix {
		return u, errors.New("wrong address prefix")
	}
	return util.Uint160DecodeBytesBE(b[1:21])
}

func BytesFromPublicKey(pub *ecdsa.PublicKey) []byte {
	if pub == nil || pub.X == nil || pub.Y == nil {
		return nil
	}
	publicKeyByteArray := elliptic.Marshal(pub, pub.X, pub.Y)
	return publicKeyByteArray
}
func ByteArrayToString(byteArray []byte) string {
	return hex.EncodeToString(byteArray)
}

func PrivateKeyFromHexString(hexString string) (*ecdsa.PrivateKey, error) {
	pk := new(ecdsa.PrivateKey)
	pk.D, _ = new(big.Int).SetString(hexString, 16)
	pk.PublicKey.Curve = elliptic.P256()
	pk.PublicKey.X, pk.PublicKey.Y = pk.PublicKey.Curve.ScalarBaseMult(pk.D.Bytes())
	return pk, nil
}
