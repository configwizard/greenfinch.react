package tokens

import (
	cid "github.com/nspcc-dev/neofs-sdk-go/container/id"
	"github.com/nspcc-dev/neofs-sdk-go/eacl"
)

func InitTable(cid cid.ID) eacl.Table {
	table := eacl.Table{}
	table.SetCID(cid)
	return table
}

// recomend adding all allow records then all deny records
func AddRecords(table eacl.Table, toWhom []eacl.Target, operations map[eacl.Operation]eacl.Action) eacl.Table {
	for k, v := range operations {
		record := eacl.NewRecord()
		record.SetOperation(k)
		record.SetAction(v)
		record.SetTargets(toWhom...)
		table.AddRecord(record)
	}
	return table
}

// AllowOthersReadOnly from https://github.com/nspcc-dev/neofs-s3-gw/blob/fdc07b8dc15272e2aabcbd7bb8c19e435c94e392/authmate/authmate.go#L358
func AllowDelete(cid cid.ID, toWhom eacl.Target) (eacl.Table, error) {
	table := eacl.Table{}
	//targetOthers := eacl.NewTarget()
	//targetOthers.SetRole(eacl.RoleOthers)

	record := eacl.NewRecord()
	record.SetOperation(eacl.OperationDelete)
	record.SetAction(eacl.ActionAllow)
	record.SetTargets(toWhom)

	table.SetCID(cid)
	table.AddRecord(record)
	for _, v := range restrictedRecordsForOthers() {
		table.AddRecord(v)
	}
	return table, nil
}

// AllowOthersReadOnly from https://github.com/nspcc-dev/neofs-s3-gw/blob/fdc07b8dc15272e2aabcbd7bb8c19e435c94e392/authmate/authmate.go#L358
func AllowGetPut(cid cid.ID, toWhom eacl.Target) (eacl.Table, error) {
	table := eacl.Table{}

	headAllowRecord := eacl.NewRecord()
	headAllowRecord.SetOperation(eacl.OperationHead)
	headAllowRecord.SetAction(eacl.ActionAllow)
	headAllowRecord.SetTargets(toWhom)

	rangeAllowRecord := eacl.NewRecord()
	rangeAllowRecord.SetOperation(eacl.OperationRange)
	rangeAllowRecord.SetAction(eacl.ActionAllow)
	rangeAllowRecord.SetTargets(toWhom)

	searchAllowRecord := eacl.NewRecord()
	searchAllowRecord.SetOperation(eacl.OperationSearch)
	searchAllowRecord.SetAction(eacl.ActionAllow)
	searchAllowRecord.SetTargets(toWhom)

	getAllowRecord := eacl.NewRecord()
	getAllowRecord.SetOperation(eacl.OperationGet)
	getAllowRecord.SetAction(eacl.ActionAllow)
	getAllowRecord.SetTargets(toWhom)

	putAllowRecord := eacl.NewRecord()
	putAllowRecord.SetOperation(eacl.OperationPut)
	putAllowRecord.SetAction(eacl.ActionAllow)
	putAllowRecord.SetTargets(toWhom)

	deleteAllowRecord := eacl.NewRecord()
	deleteAllowRecord.SetOperation(eacl.OperationDelete)
	deleteAllowRecord.SetAction(eacl.ActionAllow)
	deleteAllowRecord.SetTargets(toWhom)

	table.SetCID(cid)
	table.AddRecord(getAllowRecord)
	table.AddRecord(headAllowRecord)
	table.AddRecord(putAllowRecord)
	table.AddRecord(deleteAllowRecord)
	//for _, v := range restrictedRecordsForOthers() {
	//	table.AddRecord(v)
	//}

	return table, nil
}

func restrictedRecordsForOthers() (records []*eacl.Record) {
	for op := eacl.OperationGet; op <= eacl.OperationRangeHash; op++ {
		record := eacl.NewRecord()
		record.SetOperation(op)
		record.SetAction(eacl.ActionDeny)
		eacl.AddFormedTarget(record, eacl.RoleOthers)
		records = append(records, record)
	}

	return
}
