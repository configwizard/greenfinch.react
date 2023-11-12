package database

import (
	"fmt"
	"github.com/boltdb/bolt"
	"log"
	"sync"
)

const (
	ErrorNotFound string = "not found"
)

type Store interface {
	CreateWalletBucket(bucket, wallet, walletLocation string) error
	RecentWallets(bucket string) (map[string]string, error)
	DeleteRecentWallet(bucket, walletId string) error
	Create(network, walletId, bucket, identifier string, payload []byte) error
	Read(network, walletId, bucket, identifier string) ([]byte, error)
	ReadAll(network, walletId, bucket string) (map[string][]byte, error)
	Update(network, walletId, bucket, identifier string, payload []byte) error
	Pend(network, walletId, bucket, identifier string, payload []byte) error //a pend is a special case of an update
	Delete(network, walletId, bucket, identifier string) error
	DeleteAll(network, walletId, bucket string) error
}

func (b Bolt) DeleteAll(bucket, network, walletId string) error {
	return b.DB.Update(func(tx *bolt.Tx) error {
		ub := tx.Bucket([]byte(recentWallets))
		err := ub.Delete([]byte(walletId))
		return err
	})
}

type Bolt struct {
	*bolt.DB
}

var once sync.Once

const (
	mainnetBucket         = "mainnet"
	testnetBucket         = "testnet"
	recentWallets         = "recent_wallets"
	containerBucket       = "containers"
	sharedContainerBucket = "shared_container_bucket"
	sharedObjectBucket    = "shared_object_bucket"
	objectBucket          = "objects"
	addressBookBucket     = "address_book"
	notificationBucket    = "notification"
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
		recentWallets, err := tx.CreateBucketIfNotExists([]byte(recentWallets))
		if err != nil {
			return err
		}
		err = recentWallets.Put([]byte(wallet), []byte(walletLocation))
		if err != nil {
			return err
		}
		mainNetBucket, err := tx.CreateBucketIfNotExists([]byte(mainnetBucket))
		if err != nil {
			return err
		}
		createChildBucketsForNetwork(wallet, mainNetBucket)
		if err != nil {
			return err
		}
		testNetBucket, err := tx.CreateBucketIfNotExists([]byte(testnetBucket))
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
	_, err = userBucket.CreateBucketIfNotExists([]byte(containerBucket))
	if err != nil {
		return fmt.Errorf("creating bucket failed: %s", err)
	}
	_, err = userBucket.CreateBucketIfNotExists([]byte(sharedContainerBucket))
	if err != nil {
		return fmt.Errorf("creating bucket failed: %s", err)
	}
	_, err = userBucket.CreateBucketIfNotExists([]byte(sharedObjectBucket))
	if err != nil {
		return fmt.Errorf("creating bucket failed: %s", err)
	}
	_, err = userBucket.CreateBucketIfNotExists([]byte(objectBucket))
	if err != nil {
		return fmt.Errorf("creating bucket failed: %s", err)
	}
	_, err = userBucket.CreateBucketIfNotExists([]byte(addressBookBucket))
	if err != nil {
		return fmt.Errorf("creating bucket failed: %s", err)
	}
	_, err = userBucket.CreateBucketIfNotExists([]byte(notificationBucket))
	if err != nil {
		return fmt.Errorf("creating bucket failed: %s", err)
	}
	return err
}
