package cache

import (
	"fmt"
	"github.com/boltdb/bolt"
)

const containerBucket = "containers"

func StoreContainer(wallet, id string, container []byte) error {
	return db.Update(func(tx *bolt.Tx) error {
		ub := tx.Bucket([]byte(wallet))
		b := ub.Bucket([]byte(containerBucket))
		err := b.Put([]byte(id), container)
		return err
	})
}

func RetrieveContainer(wallet, id string) ([]byte, error) {
	var container []byte
	err := db.View(func(tx *bolt.Tx) error {
		ub := tx.Bucket([]byte(wallet))
		b := ub.Bucket([]byte(containerBucket))
		container = b.Get([]byte(id))
		return nil
	})
	return container, err
}

func PendContainerDeleted(wallet, id string, container []byte) error {
	return db.Update(func(tx *bolt.Tx) error {
		ub := tx.Bucket([]byte(wallet))
		b := ub.Bucket([]byte(containerBucket))
		err := b.Put([]byte(id), container)
		return err
	})
}
func DeleteContainer(wallet, id string) error {
	return db.Update(func(tx *bolt.Tx) error {
		ub := tx.Bucket([]byte(wallet))
		b := ub.Bucket([]byte(containerBucket))
		err := b.Delete([]byte(id))
		return err
	})
}
func RetrieveContainers(wallet string) (map[string][]byte, error) {
	containers := make(map[string][]byte)
	err := db.View(func(tx *bolt.Tx) error {
		ub := tx.Bucket([]byte(wallet))
		b := ub.Bucket([]byte(containerBucket))
		c := b.Cursor()

		for k, v := c.First(); k != nil; k, v = c.Next() {
			fmt.Printf("key=%s, value=%s\n", k, v)
			containers[string(k)] = v
		}
		return nil
	})
	return containers, err
}
