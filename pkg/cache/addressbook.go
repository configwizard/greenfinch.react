package cache

import (
	"errors"
	"fmt"
	"github.com/boltdb/bolt"
)

const addressBookBucket = "address_book"

func StoreContact(wallet, network, id string, contact []byte) error {
	return db.Update(func(tx *bolt.Tx) error {
		fmt.Println("retrieving address book for ", id)
		nb := tx.Bucket([]byte(network))
		if nb == nil {
			return errors.New("no bucket for " + network)
		}
		ub := nb.Bucket([]byte(wallet))
		if ub == nil {
			return errors.New("no bucket for " + wallet)
		}
		b := ub.Bucket([]byte(addressBookBucket))
		err := b.Put([]byte(id), contact)
		return err
	})
}

func RetrieveContact(wallet, network, id string) ([]byte, error) {
	var contact []byte
	err := db.View(func(tx *bolt.Tx) error {
		nb := tx.Bucket([]byte(network))
		if nb == nil {
			return errors.New("no bucket for " + network)
		}
		ub := nb.Bucket([]byte(wallet))
		if ub == nil {
			return errors.New("no bucket for " + wallet)
		}
		b := ub.Bucket([]byte(addressBookBucket))
		contact = b.Get([]byte(id))
		return nil
	})
	return contact, err
}

func DeleteContact(wallet, network, id string) error {
	return db.Update(func(tx *bolt.Tx) error {
		nb := tx.Bucket([]byte(network))
		if nb == nil {
			return errors.New("no bucket for " + network)
		}
		ub := nb.Bucket([]byte(wallet))
		if ub == nil {
			return errors.New("no bucket for " + wallet)
		}
		b := ub.Bucket([]byte(addressBookBucket))
		err := b.Delete([]byte(id))
		return err
	})
}
func RetrieveContacts(wallet, network string) (map[string][]byte, error) {
	contacts := make(map[string][]byte)
	err := db.View(func(tx *bolt.Tx) error {
		nb := tx.Bucket([]byte(network))
		if nb == nil {
			return errors.New("no bucket for " + network)
		}
		ub := nb.Bucket([]byte(wallet))
		if ub == nil {
			return errors.New("no bucket for " + wallet)
		}
		b := ub.Bucket([]byte(addressBookBucket))
		c := b.Cursor()
		for k, v := c.First(); k != nil; k, v = c.Next() {
			contacts[string(k)] = v
		}
		return nil
	})
	return contacts, err
}
