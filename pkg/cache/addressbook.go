package cache

import (
	"github.com/boltdb/bolt"
)

const address_book_bucket = "address_book"

func StoreContact(id string, contact []byte) error {
	return db.Update(func(tx *bolt.Tx) error {
		b := tx.Bucket([]byte(address_book_bucket))
		err := b.Put([]byte(id), contact)
		return err
	})
}

func RetrieveContact(id string) ([]byte, error) {
	var contact []byte
	err := db.View(func(tx *bolt.Tx) error {
		b := tx.Bucket([]byte(address_book_bucket))
		contact = b.Get([]byte(id))
		return nil
	})
	return contact, err
}

func DeleteContact(id string) error {
	return db.Update(func(tx *bolt.Tx) error {
		b := tx.Bucket([]byte(address_book_bucket))
		err := b.Delete([]byte(id))
		return err
	})
}
func RetrieveContacts() (map[string][]byte, error) {
	contacts := make(map[string][]byte)
	err := db.View(func(tx *bolt.Tx) error {
		// Assume bucket exists and has keys
		b := tx.Bucket([]byte(address_book_bucket))
		c := b.Cursor()
		for k, v := c.First(); k != nil; k, v = c.Next() {
			contacts[string(k)] = v
		}
		return nil
	})
	return contacts, err
}
