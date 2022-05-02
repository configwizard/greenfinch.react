package cache
import (
	"fmt"
	"github.com/boltdb/bolt"
	"log"
	"sync"
)

var once sync.Once
var db *bolt.DB

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

func CreateWalletBucket(wallet string) error {
	return db.Update(func(tx *bolt.Tx) error {
		userBucket, err := tx.CreateBucketIfNotExists([]byte(wallet))
		if err != nil {
			return err
		}
		_, err = userBucket.CreateBucketIfNotExists([]byte("containers"))
		if err != nil {
			return fmt.Errorf("creating bucket failed: %s", err)
		}
		_, err = userBucket.CreateBucketIfNotExists([]byte("objects"))
		if err != nil {
			return fmt.Errorf("creating bucket failed: %s", err)
		}
		_, err = userBucket.CreateBucketIfNotExists([]byte("address_book"))
		if err != nil {
			return fmt.Errorf("creating bucket failed: %s", err)
		}
		return nil
		return err
	})
}

func GracefulShutdown() {
	db.Close()
}
