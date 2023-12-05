package database

import (
	"fmt"
	"github.com/boltdb/bolt"
	"log"
	"sync"
)

const (
	MAINNET = "mainnet"
	TESTNET = "testnet"
)
const (
	ErrorNotFound string = "not found"
)

type Store interface {
	Register(network, address, location string)
	CreateWalletBucket() error
	RecentWallets() (map[string]string, error)
	DeleteRecentWallet() error
	Create(bucket, identifier string, payload []byte) error
	Select(bucket, identifier string) ([]byte, error)
	SelectAll(bucket string) (map[string][]byte, error)
	Update(bucket, identifier string, payload []byte) error
	Pend(bucket, identifier string, payload []byte) error //a pend is a special case of an update
	Delete(bucket, identifier string) error
	DeleteAll(bucket string) error
}

func (b Bolt) DeleteAll(bucket, network, walletId string) error {
	return b.DB.Update(func(tx *bolt.Tx) error {
		ub := tx.Bucket([]byte(RecentWallets))
		err := ub.Delete([]byte(walletId))
		return err
	})
}

type Bolt struct {
	*bolt.DB
}

var once sync.Once

const (
	MainnetBucket         = "mainnet"
	TestnetBucket         = "testnet"
	RecentWallets         = "recent_wallets"
	ContainerBucket       = "containers"
	SharedContainerBucket = "shared_container_bucket"
	SharedObjectBucket    = "shared_object_bucket"
	ObjectBucket          = "objects"
	AddressBookBucket     = "address_book"
	NotificationBucket    = "notification"
)

func New(dbPath string) *Bolt {
	var b = &Bolt{}
	once.Do(func() {
		var err error
		b.DB, err = bolt.Open(dbPath, 0600, nil)
		if err != nil {
			log.Fatal(err)
		}
	})
	return b
}

func (b Bolt) CreateWalletBucket(wallet, walletLocation string) error {
	return b.DB.Update(func(tx *bolt.Tx) error {
		recentWallets, err := tx.CreateBucketIfNotExists([]byte(RecentWallets))
		if err != nil {
			return err
		}
		err = recentWallets.Put([]byte(wallet), []byte(walletLocation))
		if err != nil {
			return err
		}
		mainNetBucket, err := tx.CreateBucketIfNotExists([]byte(MainnetBucket))
		if err != nil {
			return err
		}
		createChildBucketsForNetwork(wallet, mainNetBucket)
		if err != nil {
			return err
		}
		testNetBucket, err := tx.CreateBucketIfNotExists([]byte(TestnetBucket))
		if err != nil {
			return err
		}
		return createChildBucketsForNetwork(wallet, testNetBucket)
	})
}

func createChildBucketsForNetwork(wallet string, network *bolt.Bucket) error {
	userBucket, err := network.CreateBucketIfNotExists([]byte(wallet))
	if err != nil {
		return err
	}
	_, err = userBucket.CreateBucketIfNotExists([]byte(ContainerBucket))
	if err != nil {
		return fmt.Errorf("creating bucket failed: %s", err)
	}
	_, err = userBucket.CreateBucketIfNotExists([]byte(SharedContainerBucket))
	if err != nil {
		return fmt.Errorf("creating bucket failed: %s", err)
	}
	_, err = userBucket.CreateBucketIfNotExists([]byte(SharedObjectBucket))
	if err != nil {
		return fmt.Errorf("creating bucket failed: %s", err)
	}
	_, err = userBucket.CreateBucketIfNotExists([]byte(ObjectBucket))
	if err != nil {
		return fmt.Errorf("creating bucket failed: %s", err)
	}
	_, err = userBucket.CreateBucketIfNotExists([]byte(AddressBookBucket))
	if err != nil {
		return fmt.Errorf("creating bucket failed: %s", err)
	}
	_, err = userBucket.CreateBucketIfNotExists([]byte(NotificationBucket))
	if err != nil {
		return fmt.Errorf("creating bucket failed: %s", err)
	}
	return err
}
