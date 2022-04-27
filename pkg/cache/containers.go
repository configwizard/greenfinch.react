package cache

import (
	"fmt"
	"github.com/boltdb/bolt"
)

const container_bucket = "containers"
func StoreContainer(id string, container []byte) error {
	return db.Update(func(tx *bolt.Tx) error {
		b := tx.Bucket([]byte(container_bucket))
		err := b.Put([]byte(id), container)
		return err
	})
}

func RetrieveContainer(id string) ([]byte, error) {
	var container []byte
	err := db.View(func(tx *bolt.Tx) error {
		b := tx.Bucket([]byte(container_bucket))
		container = b.Get([]byte(id))
		return nil
	})
	return container, err
}

func PendContainerDeleted(id string, container []byte) error {
	return db.Update(func(tx *bolt.Tx) error {
		b := tx.Bucket([]byte(container_bucket))
		err := b.Put([]byte(id), container)
		return err
	})
}
func RetrieveContainers() (map[string][]byte, error) {
	containers := make(map[string][]byte)
	err := db.View(func(tx *bolt.Tx) error {
		// Assume bucket exists and has keys
		b := tx.Bucket([]byte(container_bucket))
		c := b.Cursor()

		for k, v := c.First(); k != nil; k, v = c.Next() {
			fmt.Printf("key=%s, value=%s\n", k, v)
			containers[string(k)] = v
		}
		return nil
	})
	return containers, err
}
