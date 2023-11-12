package cache

import (
	"errors"
	"github.com/boltdb/bolt"
)

const notificationBucket = "notification"

// UpsertNotification used to create a new, or update an existing notification (mark read etc)
func UpsertNotification(wallet, network, id string, notification []byte) error {
	return db.Update(func(tx *bolt.Tx) error {
		nb := tx.Bucket([]byte(network))
		if nb == nil {
			return errors.New("no bucket for " + network)
		}
		ub := nb.Bucket([]byte(wallet))
		b := ub.Bucket([]byte(notificationBucket))
		err := b.Put([]byte(id), notification)
		return err
	})
}

func RetrieveNotifications(wallet, network string) (map[string][]byte, error) {
	objects := make(map[string][]byte)
	err := db.View(func(tx *bolt.Tx) error {
		nb := tx.Bucket([]byte(network))
		if nb == nil {
			return errors.New("no bucket for " + network)
		}
		ub := nb.Bucket([]byte(wallet))
		b := ub.Bucket([]byte(notificationBucket))
		c := b.Cursor()

		for k, v := c.First(); k != nil; k, v = c.Next() {
			objects[string(k)] = v
		}
		return nil
	})
	return objects, err
}
func DeleteNotications(wallet, network string) error {
	return db.Update(func(tx *bolt.Tx) error {
		nb := tx.Bucket([]byte(network))
		if nb == nil {
			return errors.New("no bucket for " + network)
		}
		ub := nb.Bucket([]byte(wallet))
		b := ub.Bucket([]byte(notificationBucket))
		err := b.ForEach(func(k []byte, v []byte) error {
			return b.Delete(k)
		})
		return err
	})

}
func DeleteNotification(wallet, network, id string) error {
	return db.Update(func(tx *bolt.Tx) error {
		nb := tx.Bucket([]byte(network))
		if nb == nil {
			return errors.New("no bucket for " + network)
		}
		ub := nb.Bucket([]byte(wallet))
		b := ub.Bucket([]byte(notificationBucket))
		err := b.Delete([]byte(id))
		return err
	})
}
