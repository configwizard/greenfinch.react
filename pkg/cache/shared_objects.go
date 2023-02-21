package cache

import (
	"errors"
	"github.com/boltdb/bolt"
)

const sharedObjectBucket = "shared_object_bucket"

func StoreSharedObject(wallet, network, id string, container []byte) error {
	return db.Update(func(tx *bolt.Tx) error {
		nb := tx.Bucket([]byte(network))
		if nb == nil {
			return errors.New("no bucket for " + network)
		}
		ub := nb.Bucket([]byte(wallet))
		b := ub.Bucket([]byte(sharedObjectBucket))
		err := b.Put([]byte(id), container)
		return err
	})
}

func RetrieveSharedObject(wallet, network, id string) ([]byte, error) {
	var object []byte
	err := db.View(func(tx *bolt.Tx) error {
		nb := tx.Bucket([]byte(network))
		if nb == nil {
			return errors.New("no bucket for " + network)
		}
		ub := nb.Bucket([]byte(wallet))
		b := ub.Bucket([]byte(sharedObjectBucket))
		object = b.Get([]byte(id))
		return nil
	})
	return object, err
}

func RetrieveSharedObjects(wallet, network string) (map[string][]byte, error) {
	objects := make(map[string][]byte)
	err := db.View(func(tx *bolt.Tx) error {
		nb := tx.Bucket([]byte(network))
		if nb == nil {
			return errors.New("no bucket for " + network)
		}
		ub := nb.Bucket([]byte(wallet))
		b := ub.Bucket([]byte(sharedObjectBucket))
		c := b.Cursor()

		for k, v := c.First(); k != nil; k, v = c.Next() {
			objects[string(k)] = v
		}
		return nil
	})
	return objects, err
}
func PendSharedObjectDeleted(wallet, network, id string, object []byte) error {
	return db.Update(func(tx *bolt.Tx) error {
		nb := tx.Bucket([]byte(network))
		if nb == nil {
			return errors.New("no bucket for " + network)
		}
		ub := nb.Bucket([]byte(wallet))
		b := ub.Bucket([]byte(sharedObjectBucket))
		err := b.Put([]byte(id), object)
		return err
	})
}
func DeleteSharedObject(wallet, network, id string) error {
	return db.Update(func(tx *bolt.Tx) error {
		nb := tx.Bucket([]byte(network))
		if nb == nil {
			return errors.New("no bucket for " + network)
		}
		ub := nb.Bucket([]byte(wallet))
		b := ub.Bucket([]byte(sharedObjectBucket))
		err := b.Delete([]byte(id))
		return err
	})
}
