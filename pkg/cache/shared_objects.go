package cache

import (
	"github.com/boltdb/bolt"
)

const sharedObjectBucket = "shared_object_bucket"

func StoreSharedObject(wallet, id string, container []byte) error {
	return db.Update(func(tx *bolt.Tx) error {
		ub := tx.Bucket([]byte(wallet))
		b := ub.Bucket([]byte(sharedObjectBucket))
		err := b.Put([]byte(id), container)
		return err
	})
}

func RetrieveSharedObject(wallet, id string) ([]byte, error) {
	var object []byte
	err := db.View(func(tx *bolt.Tx) error {
		ub := tx.Bucket([]byte(wallet))
		b := ub.Bucket([]byte(sharedObjectBucket))
		object = b.Get([]byte(id))
		return nil
	})
	return object, err
}

func RetrieveSharedObjects(wallet string) (map[string][]byte, error) {
	objects := make(map[string][]byte)
	err := db.View(func(tx *bolt.Tx) error {
		ub := tx.Bucket([]byte(wallet))
		b := ub.Bucket([]byte(sharedObjectBucket))
		c := b.Cursor()

		for k, v := c.First(); k != nil; k, v = c.Next() {
			objects[string(k)] = v
		}
		return nil
	})
	return objects, err
}
func PendSharedObjectDeleted(wallet, id string, object []byte) error {
	return db.Update(func(tx *bolt.Tx) error {
		ub := tx.Bucket([]byte(wallet))
		b := ub.Bucket([]byte(sharedObjectBucket))
		err := b.Put([]byte(id), object)
		return err
	})
}
func DeleteSharedObject(wallet, id string) error {
	return db.Update(func(tx *bolt.Tx) error {
		ub := tx.Bucket([]byte(wallet))
		b := ub.Bucket([]byte(sharedObjectBucket))
		err := b.Delete([]byte(id))
		return err
	})
}
