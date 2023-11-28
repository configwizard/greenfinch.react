package config

import (
	"errors"
	"fmt"
	"github.com/spf13/viper"
	"log"
)

type Config struct {
	Peers map[string]Peer `yaml:"peers"`
}

type Peer struct {
	Address  string `yaml:"address"`
	Priority int    `yaml:"priority"`
	Weight   int    `yaml:"weight"`
}

// fixme - move me to a utils or node manager
type NodeSelection struct {
	Nodes   []Peer
	current int
}

func (s *NodeSelection) GetNext() (Peer, error) {
	if s.current == len(s.Nodes)-1 {
		return Peer{}, errors.New("Could not connect to any nodes, please try later")
	}
	node := s.Nodes[s.current]
	s.current = s.current + 1 // % len(s.Nodes) unless we want truly round robin connections...
	return node, nil
}

func NewNetworkSelector(nodes []Peer) NodeSelection {
	nodeSelection := NodeSelection{
		Nodes:   nodes,
		current: 0,
	}
	return nodeSelection
}

func ReadConfig(name, path string) (Config, error) {

	viper.SetConfigName(name)   // name of config file (without extension)
	viper.SetConfigType("yaml") // REQUIRED if the config file does not have the extension in the name
	//viper.AddConfigPath("/etc/appname/")   // path to look for the config file in
	//viper.AddConfigPath("$HOME/.appname")  // call multiple times to add many search paths
	viper.AddConfigPath(path) // optionally look for config in the working directory
	if err := viper.ReadInConfig(); err != nil {
		if _, ok := err.(viper.ConfigFileNotFoundError); ok {
			// Config file not found; ignore error if desired
			//log.Fatal("could not find the config file specified ", err)
			return Config{}, err.(viper.ConfigFileNotFoundError)
		} else {
			// Config file was found but another error was produced
			log.Fatal("error reading config file ", err)
			return Config{}, err
		}
	}
	conf := &Config{}
	if err := viper.Unmarshal(conf); err != nil {
		fmt.Printf("unable to decode into config struct, %v", err)
		return Config{}, err
	}
	for k, v := range conf.Peers {
		fmt.Println(k, v)
	}

	return *conf, nil
}
