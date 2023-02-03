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

//recomend adding all allow records then all deny records
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

//AllowOthersReadOnly from https://github.com/nspcc-dev/neofs-s3-gw/blob/fdc07b8dc15272e2aabcbd7bb8c19e435c94e392/authmate/authmate.go#L358
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

//AllowOthersReadOnly from https://github.com/nspcc-dev/neofs-s3-gw/blob/fdc07b8dc15272e2aabcbd7bb8c19e435c94e392/authmate/authmate.go#L358
func AllowGetPut(cid cid.ID, toWhom eacl.Target) (eacl.Table, error) {
	table := eacl.Table{}
	targetOthers := eacl.NewTarget()
	targetOthers.SetRole(eacl.RoleOthers)

	getAllowRecord := eacl.NewRecord()
	getAllowRecord.SetOperation(eacl.OperationGet)
	getAllowRecord.SetAction(eacl.ActionAllow)
	getAllowRecord.SetTargets(toWhom)

	//getDenyRecord := eacl.NewRecord()
	//getDenyRecord.SetOperation(eacl.OperationGet)
	//getDenyRecord.SetAction(eacl.ActionDeny)
	//getDenyRecord.SetTargets(toWhom)

	putAllowRecord := eacl.NewRecord()
	putAllowRecord.SetOperation(eacl.OperationPut)
	putAllowRecord.SetAction(eacl.ActionAllow)
	putAllowRecord.SetTargets(toWhom)

	//putDenyRecord := eacl.NewRecord()
	//putDenyRecord.SetOperation(eacl.OperationPut)
	//putDenyRecord.SetAction(eacl.ActionDeny)
	//putDenyRecord.SetTargets(toWhom)

	table.SetCID(cid)
	table.AddRecord(getAllowRecord)
	table.AddRecord(putAllowRecord)
	for _, v := range restrictedRecordsForOthers() {
		table.AddRecord(v)
	}
	//table.AddRecord(getDenyRecord)
	//table.AddRecord(putDenyRecord)
	//table.AddRecord(denyGETRecord)//deny must come first. Commented while debugging

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
