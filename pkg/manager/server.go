package manager

import (
	"context"
	"encoding/json"
	"fmt"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
	"net/http"
	"strconv"
)

func (m *Manager) SetupServer(ctx context.Context) error {
	r := chi.NewRouter()
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins: []string{"*"},
		AllowedMethods: []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowedHeaders: []string{"*"},
		MaxAge:         300, // Maximum value not ignored by any of major browsers
	}))
	r.Use(middleware.Logger)
	r.Route("/api/v1/", func(r chi.Router) {
		//ok so this endpoint is requesting a new bearer token to sign
		r.Get("/readonly", m.retrieveReadOnlySinceObjectMetaData())
	})
	swaggerFs := http.FileServer(http.Dir("swagger"))
	r.Handle("/swagger/", http.StripPrefix("/swagger/", swaggerFs))
	server := &http.Server{Addr: ":43520", Handler: r}
	go func() {
		for {
			select {
			case <- ctx.Done():
				if err := server.Shutdown(ctx); err != nil {
					fmt.Println("error shutting server down ", err)
				}
			}
		}
	}()
	return server.ListenAndServe()
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
func (m *Manager) retrieveReadOnlySinceObjectMetaData() http.HandlerFunc {
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
