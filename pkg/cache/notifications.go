package cache

import (
	"github.com/boltdb/bolt"
)

const notificationBucket = "notifications"


// UpsertNotification used to create a new, or update an existing notification (mark read etc)
func UpsertNotification(wallet, id string, notification []byte) error {
	return db.Update(func(tx *bolt.Tx) error {
		ub := tx.Bucket([]byte(wallet))
		b := ub.Bucket([]byte(notificationBucket))
		err := b.Put([]byte(id), notification)
		return err
	})
}

func RetrieveNotifications(wallet string) (map[string][]byte, error) {
	objects := make(map[string][]byte)
	err := db.View(func(tx *bolt.Tx) error {
		ub := tx.Bucket([]byte(wallet))
		b := ub.Bucket([]byte(notificationBucket))
		c := b.Cursor()

		for k, v := c.First(); k != nil; k, v = c.Next() {
			objects[string(k)] = v
		}
		return nil
	})
	return objects, err
}

func DeleteNotification(wallet, id string) error {
	return db.Update(func(tx *bolt.Tx) error {
		ub := tx.Bucket([]byte(wallet))
		b := ub.Bucket([]byte(notificationBucket))
		err := b.Delete([]byte(id))
		return err
	})
}
