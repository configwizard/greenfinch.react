package localserve

import (
	"encoding/json"
	"fmt"
	"github.com/amlwwalker/greenfinch.react/pkg/manager"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"log"
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

// SetupServer godoc
// @BasePath  /api/v1
// GetObjectHead godoc
// @Summary      Get object metadata
// @Description  Returns the metadata/HEAD of an object in a container
// @Tags         objects
// @Param        containerId   path      string  true  "The ID of the container to get the object metadata from"
// @Param        objectId   path      string  true  "The ID of the object to get the metadata of"
// @Param       publicKey header string true "Public Key"
// @Param       X-r header string true "The bigInt r, that makes up part of the signature"
// @Param       X-s header string true "The bigInt s, that makes up part of the signature"
// @Success      200
// @Failure      400  {object}  HTTPClientError
// @Failure      502  {object}  HTTPServerError
// @Router       /object/{containerId}/{objectId} [head]
// @response     default
// @Header       200              {string}  NEOFS-META  "The base64 encoded version of the binary bearer token ready for signing"
func SetupServer(m manager.Manager) {
	r := chi.NewRouter()
	r.Use(middleware.Logger)
	r.Route("/api/v1/", func(r chi.Router) {
		//ok so this endpoint is requesting a new bearer token to sign
		r.Get("/readonly", func(w http.ResponseWriter, r *http.Request) {
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
			containers, err := m.ListReadOnlyContainers(unixTime)
			if err != nil {
				http.Error(w, "issue listing read only containers " + err.Error(), http.StatusInternalServerError)
				return
			}
			containerData, err := json.Marshal(containers)
			if err != nil {
				http.Error(w, "issue marshalling read only containers " + err.Error(), http.StatusInternalServerError)
				return
			}
			w.Write(containerData)
		})
	})
	swaggerFs := http.FileServer(http.Dir("swagger"))
	r.Handle("/swagger/", http.StripPrefix("/swagger/", swaggerFs))
	clientFs := http.FileServer(http.Dir("client"))
	r.Handle("/*", clientFs)
	log.Println("about to listen and server")
	err := http.ListenAndServe(":43520", r)
	if err != nil {
		log.Fatal("error ", err)
	}
}
