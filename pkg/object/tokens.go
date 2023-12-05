package object

import (
	"context"
	"errors"
	"github.com/amlwwalker/greenfinch.react/pkg/config"
	"github.com/amlwwalker/greenfinch.react/pkg/payload"
	"github.com/nspcc-dev/neofs-sdk-go/bearer"
	"github.com/nspcc-dev/neofs-sdk-go/client"
	cid "github.com/nspcc-dev/neofs-sdk-go/container/id"
	"github.com/nspcc-dev/neofs-sdk-go/eacl"
	"github.com/nspcc-dev/neofs-sdk-go/user"
	"time"
)

func ObjectBearerToken(p payload.Parameters, nodes []config.Peer) (bearer.Token, error) {
	var cnrID cid.ID
	if err := cnrID.DecodeString(p.ParentID()); err != nil {
		return bearer.Token{}, err
	}
	gA, err := p.ForUser()
	if err != nil {
		return bearer.Token{}, err
	}
	params, ok := p.(*ObjectParameter)
	if !ok {
		return bearer.Token{}, errors.New("no object parameters")
	}
	var gateSigner user.Signer = user.NewAutoIDSignerRFC6979(gA.PrivateKey().PrivateKey)

	//nodeSelection := config.NewNetworkSelector(nodes)
	var prmDial client.PrmDial
	prmDial.SetTimeout(30 * time.Second)
	prmDial.SetStreamTimeout(30 * time.Second)
	prmDial.SetContext(context.Background()) //do we need fine contorl over this with a timeout?
	sdkCli, err := p.Pool().RawClient()
	if err != nil {
		return bearer.Token{}, err
	}
	//for {
	//	node, err := nodeSelection.GetNext()
	//	if err != nil {
	//		return bearer.Token{}, err
	//	}
	//	prmDial.SetServerURI(node.Address)
	//	//fixme: this may well be very slow and we might want to do it earlier somewhere - ask Roman
	//	if err := sdkCli.Dial(prmDial); err != nil {
	//		fmt.Printf("Error connecting to node %s: %s\n", node.Address, err)
	//		continue
	//	} else {
	//		break
	//	}
	//}
	//var prmDial client.PrmDial
	//
	//prmDial.SetTimeout(60 * time.Second)
	//prmDial.SetStreamTimeout(60 * time.Second)
	//prmDial.SetContext(context.Background())
	//
	//prmCli := client.PrmInit{}
	//cli, err := client.New(prmCli)
	netInfo, err := sdkCli.NetworkInfo(params.ctx, client.PrmNetworkInfo{})
	if err != nil {
		return bearer.Token{}, err
	}
	//config.NewNetworkSelector(utils.networks.)
	//prmDial.SetServerURI(node.Address)
	//prmDial.SetServerURI(node.Address)
	var bearerToken bearer.Token
	bearerToken.ForUser(gateSigner.UserID())
	bearerToken.SetIat(netInfo.CurrentEpoch())
	bearerToken.SetNbf(netInfo.CurrentEpoch())
	bearerToken.SetExp(netInfo.CurrentEpoch() + 100) // or particular exp value
	bearerToken.EACLTable()
	r := eacl.Record{}
	equal := eacl.MatchStringEqual
	equal.DecodeString(cnrID.String())
	r.AddObjectContainerIDFilter(equal, cnrID)
	if p.Operation() == eacl.OperationUnknown {
		return bearer.Token{}, errors.New("need bearer token operation")
	}
	r.SetOperation(p.Operation())
	r.SetAction(eacl.ActionAllow)
	tab := eacl.Table{}
	tab.AddRecord(&r)
	bearerToken.SetEACLTable(tab)

	return bearerToken, nil
}
