package manager

import (
	"encoding/json"
	"errors"
	"io/ioutil"
	"path"
	"time"
)

func DebugSaveJson(filename string, data interface{}) error {
	file, _ := json.MarshalIndent(data, "", " ")
	filepath := path.Join("frontend/src/dbg_data_structures", filename)
	return ioutil.WriteFile(filepath, file, 0644)
}
func AwaitTime(seconds int, f func() bool) error {
	for i := 1; i <= seconds; i++ {
		if f() {
			return nil
		}

		time.Sleep(time.Second)
	}
	return errors.New("time ran out")
}

//func PUTAllowDenyOthersEACL(containerID cid.ID, allowedPubKey *keys.PublicKey) eacl.Table {
//	table := eacl.NewTable()
//	table.SetCID(&containerID)
//
//	if allowedPubKey != nil {
//		target := eacl.NewTarget()
//		target.SetBinaryKeys([][]byte{allowedPubKey.Bytes()})
//
//		allowPutRecord := eacl.NewRecord()
//		allowPutRecord.SetOperation(eacl.OperationPut)
//		allowPutRecord.SetAction(eacl.ActionAllow)
//		allowPutRecord.SetTargets(target)
//
//		table.AddRecord(allowPutRecord)
//	}
//
//	target := eacl.NewTarget()
//	target.SetRole(eacl.RoleOthers)
//
//	denyPutRecord := eacl.NewRecord()
//	denyPutRecord.SetOperation(eacl.OperationPut)
//	denyPutRecord.SetAction(eacl.ActionDeny)
//	denyPutRecord.SetTargets(target)
//
//	table.AddRecord(denyPutRecord)
//
//	return *table
//}
