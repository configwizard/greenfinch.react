package localserve

import (
	"encoding/json"
	"fmt"
	"github.com/amlwwalker/greenfinch.react/pkg/manager"
	"net/http"
	"strconv"
	"time"
)

func dateFormat(layout string, intTime int64) time.Time {
	t := time.Unix(intTime, 0)
	if layout == "" {
		layout = "2006-01-02 15:04:05"
	}
	fmt.Println(t.Format(layout))
	return t
}

// RetrieveReadOnlySinceObjectMetaData godoc
// @BasePath  /api/v1/readonly
// GetObjectHead godoc
// @Summary      Get object data locally
// @Description  Returns the metadata/HEAD of the objects that have been created since a certain time
// @Tags         objects
// @Param        since   query      string  true  "The unix time since all objects returned should have been created after"
// @Success      200
// @Failure      400  {object}  HTTPClientError
// @Failure      502  {object}  HTTPServerError
func RetrieveReadOnlySinceObjectMetaData(m *manager.Manager) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		sinceTimeQuery := r.URL.Query().Get("since")
		unixTime, err := strconv.ParseInt(sinceTimeQuery, 10, 64)
		if err != nil {
			http.Error(w, "bad unix time", http.StatusBadRequest)
			return
		}
		//unixTimeToDate := dateFormat("", unixTime)
		/*
			1. get all containers with public read basic permissions (and no restrictions on the eacl table?)
			2. request head for all objects
			3. return the filesystem for those
			4. create list
		*/
		containers, err := m.NewListReadOnlyContainerContents(unixTime)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		containerData, err := json.Marshal(containers)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		w.Write(containerData)
	}
}

// HTTPClientError returned when a client error occurs
type HTTPClientError struct {
	Code    int    `json:"code" example:"400"`
	Message string `json:"message" example:"status bad request"`
}

// HTTPServerError returned when a server error occurs
type HTTPServerError struct {
	Code    int    `json:"code" example:"502"`
	Message string `json:"message" example:"status server error"`
}
