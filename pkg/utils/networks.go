package utils

import (
	"errors"
	"github.com/amlwwalker/greenfinch.react/pkg/config"
	"golang.org/x/exp/maps"
)

type Network string

const MainNet Network = "mainnet"
const TestNet Network = "testnet"

type NetworkData struct {
	Name         string
	ID           string
	Address      string
	SidechainRPC []string
	StorageNodes map[string]config.Peer
	RpcNodes     []string
}
type NodeSelection struct {
	Nodes   []config.Peer
	current int
}

func (s *NodeSelection) getNext() (config.Peer, error) {
	if s.current == len(s.Nodes)-1 {
		return config.Peer{}, errors.New("Could not connect to any nodes, please try later")
	}
	node := s.Nodes[s.current]
	s.current = s.current + 1 // % len(s.Nodes) unless we want truly round robin connections...
	return node, nil
}

func NewNetworkSelector(nodes []config.Peer) NodeSelection {
	nodeSelection := NodeSelection{
		Nodes:   nodes,
		current: 0,
	}
	return nodeSelection
}
func RetrieveStoragePeers(n Network) []config.Peer {
	return maps.Values(networks[n].StorageNodes)
}

var networks = map[Network]NetworkData{
	"mainnet": {
		Name:    "Main Net",
		ID:      "mainnet",
		Address: "NNxVrKjLsRkWsmGgmuNXLcMswtxTGaNQLk",
		SidechainRPC: []string{
			"https://rpc1.morph.fs.neo.org:40341",
			"https://rpc2.morph.fs.neo.org:40341",
			"https://rpc3.morph.fs.neo.org:40341",
			"https://rpc4.morph.fs.neo.org:40341",
			"https://rpc5.morph.fs.neo.org:40341",
			"https://rpc6.morph.fs.neo.org:40341",
			"https://rpc7.morph.fs.neo.org:40341",
		},
		StorageNodes: map[string]config.Peer{
			"0": {
				Address:  "grpcs://st1.storage.fs.neo.org:8082",
				Priority: 1,
				Weight:   1,
			},
			"1": {
				Address:  "grpcs://st2.storage.fs.neo.org:8082",
				Priority: 2,
				Weight:   1,
			},
			"2": {
				Address:  "grpcs://st3.storage.fs.neo.org:8082",
				Priority: 3,
				Weight:   1,
			},
			"3": {
				Address:  "grpcs://st4.storage.fs.neo.org:8082",
				Priority: 4,
				Weight:   1,
			},
		},
		RpcNodes: []string{
			"https://rpc10.n3.nspcc.ru:10331",
		},
	},
	"testnet": {
		Name:    "Test Net",
		ID:      "testnet",
		Address: "NZAUkYbJ1Cb2HrNmwZ1pg9xYHBhm2FgtKV",
		SidechainRPC: []string{
			"https://rpc1.morph.t5.fs.neo.org:51331",
			"https://rpc2.morph.t5.fs.neo.org:51331",
			"https://rpc3.morph.t5.fs.neo.org:51331",
			"https://rpc4.morph.t5.fs.neo.org:51331",
			"https://rpc5.morph.t5.fs.neo.org:51331",
			"https://rpc6.morph.t5.fs.neo.org:51331",
			"https://rpc7.morph.t5.fs.neo.org:51331",
		},
		StorageNodes: map[string]config.Peer{
			"0": {
				Address:  "grpcs://st1.t5.fs.neo.org:8080",
				Priority: 1,
				Weight:   1,
			},
			"1": {
				Address:  "grpcs://st2.t5.fs.neo.org:8080",
				Priority: 2,
				Weight:   1,
			},
			"2": {
				Address:  "grpcs://st3.t5.fs.neo.org:8080",
				Priority: 3,
				Weight:   1,
			},
			"3": {
				Address:  "grpcs://st4.t5.fs.neo.org:8080",
				Priority: 4,
				Weight:   1,
			},
		},
		RpcNodes: []string{
			"https://rpc.t5.n3.nspcc.ru:20331",
		},
	},
}
