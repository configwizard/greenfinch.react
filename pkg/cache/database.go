package cache

import (
	"errors"
	"fmt"
	"github.com/boltdb/bolt"
	"log"
	"sync"
)

var once sync.Once
var db *bolt.DB

const recentWallets = "recent_wallets"
const mainnetBucket = "mainnet"
const testnetBucket = "testnet"

func DB(dbPath string) *bolt.DB {
	once.Do(func() {
		var err error
		db, err = bolt.Open(dbPath, 0600, nil)
		if err != nil {
			log.Fatal(err)
		}
	})
	return db
}

func CreateWalletBucket(wallet, walletLocation string) error {
	return db.Update(func(tx *bolt.Tx) error {
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

func RecentWallets() (map[string]string, error) {
	wallets := make(map[string]string)
	err := db.View(func(tx *bolt.Tx) error {
		ub := tx.Bucket([]byte(recentWallets))
		if ub == nil {
			return errors.New("no bucket for recent wallets")
		}
		c := ub.Cursor()
		for k, v := c.First(); k != nil; k, v = c.Next() {
			wallets[string(k)] = string(v)
		}
		return nil
	})
	return wallets, err
}
func DeleteRecentWallet(walletId string) error {
	return db.Update(func(tx *bolt.Tx) error {
		ub := tx.Bucket([]byte(recentWallets))
		err := ub.Delete([]byte(walletId))
		return err
	})
}

func GracefulShutdown() {
	db.Close()
}
