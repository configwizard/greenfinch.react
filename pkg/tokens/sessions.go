package tokens

import (
	"context"
	"github.com/google/uuid"
	"github.com/nspcc-dev/neo-go/pkg/crypto/keys"
	"github.com/nspcc-dev/neofs-sdk-go/client"
	cid "github.com/nspcc-dev/neofs-sdk-go/container/id"
	neofsecdsa "github.com/nspcc-dev/neofs-sdk-go/crypto/ecdsa"
	"github.com/nspcc-dev/neofs-sdk-go/session"
)

// CalculateEpochsForTime takes the number of seconds into the future you want the epoch for
// and estimates it based on the current average time per epoch
func CalculateEpochsForTime(ctx context.Context, cli *client.Client, durationInSeconds int64) uint64 {
	ni, err := cli.NetworkInfo(ctx, client.PrmNetworkInfo{})
	if err != nil {
		return 0
	}

	ms := ni.Info().MsPerBlock()
	durationInEpochs := durationInSeconds / (ms / 1000) //in seconds
	return uint64(durationInEpochs)                     // (estimate)
}

func BuildObjectSessionToken(key *keys.PrivateKey, lIat, lNbf, lExp uint64, verb session.ObjectVerb, cnrID cid.ID, gateKey keys.PublicKey) (*session.Object, error) {

	tok := new(session.Object)
	tok.ForVerb(verb)

	tok.SetID(uuid.New())
	tok.SetAuthKey((*neofsecdsa.PublicKey)(&gateKey)) //todo: the gate key will work on behalf ot the user's wallet so never to expose their private key anywhere

	tok.SetIat(lIat) //is there a way to dynamically get these at runtime see CalculateEpochsForTime commented above. Can this be done?
	tok.SetNbf(lNbf)
	tok.SetExp(lExp)
	tok.BindContainer(cnrID)
	return tok, tok.Sign(key.PrivateKey) //todo - this will all need signing by wallet connect when the time comes
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
	tok.Sign(key.PrivateKey)
	return tok, tok.Sign(key.PrivateKey)
}
