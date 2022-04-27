package cache

import (
	"github.com/boltdb/bolt"
)

const object_bucket = "objects"

func StoreObject(id string, container []byte) error {
	return db.Update(func(tx *bolt.Tx) error {
		b := tx.Bucket([]byte(object_bucket))
		err := b.Put([]byte(id), container)
		return err
	})
}

func RetrieveObject(id string) ([]byte, error) {
	var object []byte
	err := db.View(func(tx *bolt.Tx) error {
		b := tx.Bucket([]byte(object_bucket))
		object = b.Get([]byte(id))
		return nil
	})
	return object, err
}

func RetrieveObjects() (map[string][]byte, error) {
	objects := make(map[string][]byte)
	err := db.View(func(tx *bolt.Tx) error {
		// Assume bucket exists and has keys
		b := tx.Bucket([]byte(object_bucket))
		c := b.Cursor()

		for k, v := c.First(); k != nil; k, v = c.Next() {
			objects[string(k)] = v
		}
		return nil
	})
	return objects, err
}
func PendObjectDeleted(id string, object []byte) error {
	return db.Update(func(tx *bolt.Tx) error {
		b := tx.Bucket([]byte(object_bucket))
		err := b.Put([]byte(id), object)
		return err
	})
}
