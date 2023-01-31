package pool

import (
	"context"
	"crypto/ecdsa"
	"github.com/amlwwalker/greenfinch.react/pkg/config"
	"github.com/nspcc-dev/neofs-sdk-go/pool"
	"time"
)

func fetchPeers() []pool.NodeParam {
	var nodes []pool.NodeParam
	//where can i get the nodes from??
	return nodes
}

/*
questions:
1. do i need to provide the URLs for connections in the pool
2. Whats the difference between a pool and a client and which should I use?
3. Can a pool be created without knowing the private key (wallet connect)?
	- if not, do I think use a client? I cant work out how to make the requests (put/get/delte) on a client
*/
func GetPool(ctx context.Context, key ecdsa.PrivateKey, peers map[string]config.Peer) (*pool.Pool, error) {
	var prm pool.InitParameters

	for _, peer := range peers {
		prm.AddNode(pool.NewNodeParam(peer.Priority, peer.Address, float64(peer.Weight)))
	}

	prm.SetNodeDialTimeout(1 * time.Minute)
	prm.SetNodeStreamTimeout(1 * time.Minute)
	prm.SetHealthcheckTimeout(1 * time.Minute)
	prm.SetClientRebalanceInterval(1 * time.Minute)
	prm.SetErrorThreshold(1)
	prm.SetKey(&key)
	//todo does this need setting or does this have a default?
	//prm.SetSessionExpirationDuration(10)
	p, err := pool.NewPool(prm)
	if err != nil {
		return p, err
	}

	if err = p.Dial(ctx); err != nil {
		return p, err
	}

	return p, nil
}

func TokenExpiryValue(ctx context.Context, pl *pool.Pool, roughEpochs uint64) (uint64, uint64, error) {
	info, err := pl.NetworkInfo(ctx)
	if err != nil {
		return 0, 0, err
	}
	currentEpoch := info.CurrentEpoch()
	expire := currentEpoch + roughEpochs // valid for 10 epochs (~ 10 hours)
	return currentEpoch, expire, nil
}
