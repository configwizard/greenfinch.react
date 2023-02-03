package cache

import (
	"fmt"
	"github.com/boltdb/bolt"
)

const sharedContainerBucket = "shared_container_bucket"

func StoreSharedContainer(wallet, id string, container []byte) error {
	return db.Update(func(tx *bolt.Tx) error {
		ub := tx.Bucket([]byte(wallet))
		b := ub.Bucket([]byte(sharedContainerBucket))
		err := b.Put([]byte(id), container)
		return err
	})
}

func RetrieveSharedContainer(wallet, id string) ([]byte, error) {
	var container []byte
	err := db.View(func(tx *bolt.Tx) error {
		ub := tx.Bucket([]byte(wallet))
		b := ub.Bucket([]byte(sharedContainerBucket))
		container = b.Get([]byte(id))
		return nil
	})
	return container, err
}

func PendSharedContainerDeleted(wallet, id string, container []byte) error {
	return db.Update(func(tx *bolt.Tx) error {
		ub := tx.Bucket([]byte(wallet))
		b := ub.Bucket([]byte(sharedContainerBucket))
		err := b.Put([]byte(id), container)
		return err
	})
}
func DeleteSharedContainer(wallet, id string) error {
	return db.Update(func(tx *bolt.Tx) error {
		ub := tx.Bucket([]byte(wallet))
		b := ub.Bucket([]byte(sharedContainerBucket))
		err := b.Delete([]byte(id))
		return err
	})
}
func RetrieveSharedContainers(wallet string) (map[string][]byte, error) {
	fmt.Println("searching for wallet", wallet)
	containers := make(map[string][]byte)
	err := db.View(func(tx *bolt.Tx) error {
		ub := tx.Bucket([]byte(wallet))
		fmt.Printf("ub is %+v\r\n", ub)
		b := ub.Bucket([]byte(sharedContainerBucket))
		c := b.Cursor()

		for k, v := c.First(); k != nil; k, v = c.Next() {
			fmt.Printf("key=%s, value=%s\n", k, v)
			containers[string(k)] = v
		}
		return nil
	})
	return containers, err
}
