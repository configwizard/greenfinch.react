package tokens

import (
	"github.com/google/uuid"
	"github.com/nspcc-dev/neo-go/pkg/crypto/keys"
	"github.com/nspcc-dev/neofs-sdk-go/client"
	cid "github.com/nspcc-dev/neofs-sdk-go/container/id"
	neofsecdsa "github.com/nspcc-dev/neofs-sdk-go/crypto/ecdsa"
	"github.com/nspcc-dev/neofs-sdk-go/session"
	"github.com/nspcc-dev/neofs-sdk-go/user"
)

// CalculateEpochsForTime takes the number of seconds into the future you want the epoch for
// and estimates it based on the current average time per epoch
//func CalculateEpochsForTime(ctx context.Context, cli *client.Client, durationInSeconds int64) uint64 {
//	ni, err := cli.NetworkInfo(ctx, client.PrmNetworkInfo{})
//	if err != nil {
//		return 0
//	}
//
//	ms := ni.Info().MsPerBlock()
//	durationInEpochs := durationInSeconds / (ms / 1000) //in seconds
//	return uint64(durationInEpochs)                     // (estimate)
//}

func BuildObjectSessionToken(key *keys.PrivateKey, lIat, lNbf, lExp uint64, verb session.ObjectVerb, cnrID cid.ID, gateSession *client.ResSessionCreate) (*session.Object, error) {

	tok := new(session.Object)
	tok.ForVerb(verb)
	var idSession uuid.UUID
	if err := idSession.UnmarshalBinary(gateSession.ID()); err != nil {
		return nil, err
	}
	// decode session public key
	var keySession neofsecdsa.PublicKey
	if err := keySession.Decode(gateSession.PublicKey()); err != nil {
		return nil, err
	}
	//tok.SetAuthKey((*neofsecdsa.PublicKey)(&gateKey)) //todo - who is this? I thought sessions could only be used by the owner? Who is key and who is gatekey?
	tok.SetAuthKey(&keySession)
	tok.SetID(idSession)
	tok.SetIat(lIat) //is there a way to dynamically get these at runtime see CalculateEpochsForTime commented above. Can this be done?
	tok.SetNbf(lNbf)
	tok.SetExp(lExp)
	tok.BindContainer(cnrID)

	usrSigner := user.NewAutoIDSigner(key.PrivateKey)
	return tok, tok.Sign(usrSigner)
}

func BuildUnsignedObjectSessionToken(lIat, lNbf, lExp uint64, verb session.ObjectVerb, cnrID cid.ID, resSession *client.ResSessionCreate) (*session.Object, error) {

	tok := new(session.Object)
	tok.ForVerb(verb)
	var idSession uuid.UUID
	if err := idSession.UnmarshalBinary(resSession.ID()); err != nil {
		return nil, err
	}
	// decode session public key
	var keySession neofsecdsa.PublicKey
	if err := keySession.Decode(resSession.PublicKey()); err != nil {
		return nil, err
	}
	tok.SetAuthKey(&keySession)
	tok.SetID(idSession)
	tok.SetIat(lIat) //is there a way to dynamically get these at runtime see CalculateEpochsForTime commented above. Can this be done?
	tok.SetNbf(lNbf)
	tok.SetExp(lExp)
	tok.BindContainer(cnrID)
	return tok, nil
}
func BuildUnsignedContainerSessionToken(lIat, lNbf, lExp uint64, cnrID cid.ID, verb session.ContainerVerb, gateKey keys.PublicKey) *session.Container {
	tok := new(session.Container)
	tok.ForVerb(verb)
	tok.AppliedTo(cnrID)
	tok.SetID(uuid.New())
	tok.SetAuthKey((*neofsecdsa.PublicKey)(&gateKey))
	tok.SetIat(lIat)
	tok.SetNbf(lNbf)
	tok.SetExp(lExp)
	return tok
}

func BuildContainerSessionToken(key *keys.PrivateKey, lIat, lNbf, lExp uint64, cnrID cid.ID, verb session.ContainerVerb, gateKey keys.PublicKey) (*session.Container, error) {

	tok := new(session.Container)
	tok.ForVerb(verb)
	tok.AppliedTo(cnrID)
	tok.SetID(uuid.New())
	tok.SetAuthKey((*neofsecdsa.PublicKey)(&gateKey))
	tok.SetIat(lIat)
	tok.SetNbf(lNbf)
	tok.SetExp(lExp)

	usrSigner := user.NewAutoIDSigner(key.PrivateKey)
	return tok, tok.Sign(usrSigner)
}
