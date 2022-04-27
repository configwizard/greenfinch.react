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
		db.Update(func(tx *bolt.Tx) error {
			_, err := tx.CreateBucketIfNotExists([]byte("containers"))
			if err != nil {
				return fmt.Errorf("creating bucket failed: %s", err)
			}
			_, err = tx.CreateBucketIfNotExists([]byte("objects"))
			if err != nil {
				return fmt.Errorf("creating bucket failed: %s", err)
			}
			return nil
		})
	})
	return db
}

func GracefulShutdown() {
	db.Close()
}
