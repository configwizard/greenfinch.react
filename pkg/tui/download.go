package main

import (
	"fmt"
	"net/http"
	"os/exec"
	"runtime"
)

const downloadPage = `
<!-- myform.html -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Form Input</title>
</head>
<body>
    <form action="/submit" method="post">
        <input type="text" name="inputField" placeholder="Enter some input">
        <button type="submit">Submit</button>
    </form>
</body>
</html>
`

func SetupFormHandler(inputChan chan string) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method == "POST" {
			// Parse the form data
			if err := r.ParseForm(); err != nil {
				http.Error(w, "ParseForm() error", http.StatusInternalServerError)
				return
			}
			// Get the value from the form's input field
			userInput := r.FormValue("inputField")
			fmt.Fprintln(w, "Received input:", userInput)
			inputChan <- userInput
			// Here you might want to signal your application that new input is available
		} else {
			http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		}
	}
}

// Function to open the URL in the default browser.
func openBrowser(url string) {
	var err error

	switch runtime.GOOS {
	case "linux":
		err = exec.Command("xdg-open", url).Start()
	case "windows":
		err = exec.Command("rundll32", "url.dll,FileProtocolHandler", url).Start()
	case "darwin":
		err = exec.Command("open", url).Start()
	default:
		err = fmt.Errorf("unsupported platform")
	}

	if err != nil {
		fmt.Errorf("openBrowser: %v", err)
	}
}

func startServer(inputChan chan string) {
	// Serve the HTML form at the root or a specific path
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte(downloadPage))
		w.Header().Add("content-type", "text/html")
		w.WriteHeader(200)
		//http.ServeFile(w, r, "myform.html")
	})

	// Handle form submission at a specific endpoint
	http.HandleFunc("/submit", SetupFormHandler(inputChan))

	// Start the server in a goroutine so it doesn't block the rest of your application
	go func() {
		if err := http.ListenAndServe(":8080", nil); err != nil {
			fmt.Println("ListenAndServe:", err)
		}
	}()
	//need to kill server but be able to open again
	// Open the web page in the default browser
	openBrowser("http://localhost:8080")
}
