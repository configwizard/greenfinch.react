package website

import (
	"io/fs"
	"path/filepath"
)

func walkWebsiteDirectory(directory string) (map[string][]string, error) {
	//walk the directory and remove the base
	var directoryTree = make(map[string][]string)
	err := filepath.Walk(directory, func(path string, info fs.FileInfo, err error) error {
		if info.IsDir() {
			rel, err := filepath.Rel(directory, path)
			if err != nil {
				return err
			}
			//now store this against the object as an attribute
			directoryTree[rel] = []string{}
		} else {
			rel, err := filepath.Rel(directory, path)
			if err != nil {
				return err
			}
			relDir := filepath.Dir(rel)
			//now store this against the object as an attribute
			directoryTree[relDir] = append(directoryTree[relDir], filepath.Base(path))
		}
		return nil
	})
	return directoryTree, err
}
