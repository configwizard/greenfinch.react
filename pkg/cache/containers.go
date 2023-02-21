package cache

import (
	"errors"
	"fmt"
	"github.com/boltdb/bolt"
)

const containerBucket = "containers"

func StoreContainer(wallet, network, id string, container []byte) error {
	return db.Update(func(tx *bolt.Tx) error {
		nb := tx.Bucket([]byte(network))
		if nb == nil {
			return errors.New("no bucket for " + network)
		}
		ub := nb.Bucket([]byte(wallet))
		b := ub.Bucket([]byte(containerBucket))
		err := b.Put([]byte(id), container)
		return err
	})
}

func RetrieveContainer(wallet, network, id string) ([]byte, error) {
	var container []byte
	err := db.View(func(tx *bolt.Tx) error {
		nb := tx.Bucket([]byte(network))
		if nb == nil {
			return errors.New("no bucket for " + network)
		}
		ub := nb.Bucket([]byte(wallet))
		b := ub.Bucket([]byte(containerBucket))
		container = b.Get([]byte(id))
		return nil
	})
	return container, err
}

func PendContainerDeleted(wallet, network, id string, container []byte) error {
	return db.Update(func(tx *bolt.Tx) error {
		nb := tx.Bucket([]byte(network))
		if nb == nil {
			return errors.New("no bucket for " + network)
		}
		ub := nb.Bucket([]byte(wallet))
		b := ub.Bucket([]byte(containerBucket))
		err := b.Put([]byte(id), container)
		return err
	})
}
func DeleteContainer(wallet, network, id string) error {
	return db.Update(func(tx *bolt.Tx) error {
		nb := tx.Bucket([]byte(network))
		if nb == nil {
			return errors.New("no bucket for " + network)
		}
		ub := nb.Bucket([]byte(wallet))
		b := ub.Bucket([]byte(containerBucket))
		err := b.Delete([]byte(id))
		return err
	})
}
func RetrieveContainers(wallet, network string) (map[string][]byte, error) {
	containers := make(map[string][]byte)
	err := db.View(func(tx *bolt.Tx) error {
		nb := tx.Bucket([]byte(network))
		if nb == nil {
			return errors.New("no bucket for " + network)
		}
		ub := nb.Bucket([]byte(wallet))
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
