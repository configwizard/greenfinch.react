package utils

const (
	ErrorPendingInUse   string = "event already exists"
	ErrorNotFound       string = "event not found"
	ErrorNotPayload     string = "not of type payload"
	ErrorNoSession      string = "no session available"
	ErrorNoToken        string = "no token available"
	ErrorNoSignature    string = "payload not signed correctly"
	ErrorNoDatabase     string = "no database available"
	ErrorNoNotification string = "not a notification"
)
