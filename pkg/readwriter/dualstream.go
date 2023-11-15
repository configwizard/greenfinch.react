package readwriter

import "io"

type DualStream struct {
	Reader io.Reader
	Writer io.Writer
}

func (ds *DualStream) Read(p []byte) (n int, err error) {
	return ds.Reader.Read(p)
}

func (ds *DualStream) Write(p []byte) (n int, err error) {
	return ds.Writer.Write(p)
}
