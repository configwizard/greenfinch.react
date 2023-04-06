package website

import (
	"encoding/json"
	"fmt"
	"testing"
)

func TestFilePathWalker(t *testing.T) {
	//homeDir, err := os.UserHomeDir()
	//if err != nil {
	//	t.Fatalf("Could not open user home directory %s", err)
	//}
	result, err := walkWebsiteDirectory("/Users/alex.walker/go/src/github.com/amlwwalker/greenfinch.react/build")
	if err != nil {
		t.Fatalf("Could not get directory tree %s", err)
	}
	byt, err := json.MarshalIndent(result, "", "  ")
	if err != nil {
		t.Fatalf("Could not get marshal tree %s", err)
	}

	fmt.Println(string(byt))
}
