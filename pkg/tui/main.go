package main

import (
	"bytes"
	"context"
	"crypto/ecdsa"
	"encoding/hex"
	"fmt"
	"github.com/amlwwalker/greenfinch.react/pkg/controller"
	"github.com/amlwwalker/greenfinch.react/pkg/emitter"
	obj "github.com/amlwwalker/greenfinch.react/pkg/object"
	gspool "github.com/amlwwalker/greenfinch.react/pkg/pool"
	"github.com/amlwwalker/greenfinch.react/pkg/readwriter"
	"github.com/amlwwalker/greenfinch.react/pkg/tui/views"
	"github.com/amlwwalker/greenfinch.react/pkg/utils"
	"github.com/charmbracelet/bubbles/list"
	neofsecdsa "github.com/nspcc-dev/neofs-sdk-go/crypto/ecdsa"
	"github.com/nspcc-dev/neofs-sdk-go/eacl"
	"github.com/nspcc-dev/neofs-sdk-go/object"
	"github.com/nspcc-dev/neofs-sdk-go/pool"
	"log"
	"os"
	"time"

	"github.com/charmbracelet/bubbles/table"
	tea "github.com/charmbracelet/bubbletea"
	"github.com/charmbracelet/lipgloss"
)

var p *tea.Program

type progressUpdateMsg struct {
	progress int
}
type sessionState uint

var logger *log.Logger

const (
	defaultTime              = time.Minute
	listView    sessionState = iota
	containerView
	objectView
	objectCardView
	confirmationView
	downloadingState
	waitingForWebInputState
	webInputReceivedState
	walletView
	detailedTableView
	spinnerView
	timerView
)

var baseStyle = lipgloss.NewStyle().
	BorderStyle(lipgloss.NormalBorder()).
	BorderForeground(lipgloss.Color("240"))

var docStyle = lipgloss.NewStyle().Margin(1, 2)

type model struct {
	controller                          controller.Controller
	pl                                  *pool.Pool
	state                               sessionState //manage the state of the UI (which view etc)
	containerListTable, objectListTable table.Model
	progressBar                         ProgressBar
	progressChan                        chan int
	webInput                            string
	loading                             bool
	inputChan                           chan string
	list                                list.Model // list of initial options
	choice                              string
	confirmState                        bool
	actionToConfirm                     func() sessionState // This will hold the action to be confirmed
	cardData                            card                // Replace with your card data type
	walletCard                          card                // display/login the mock wallet
}

func (m model) Init() tea.Cmd { return nil }

// This function will be assigned to m.actionToConfirm and called when the user confirms
func (m *model) startDownloadProcess(url string) {
	// Start the background download process
	m.state = downloadingState
	downloadFile(url, m.progressChan)
}

func (m model) Update(msg tea.Msg) (tea.Model, tea.Cmd) {
	var cmd tea.Cmd
	var cmds []tea.Cmd

	// Process global key events regardless of state
	switch msg := msg.(type) {
	case progressUpdateMsg:
		m.progressBar.SetProgress(msg.progress)
		return m, nil
	case tea.KeyMsg:
		switch msg.String() {
		case "esc":
			// Toggle focus on the containerListTable
			if m.state == containerView && m.containerListTable.Focused() {
				m.containerListTable.Blur()
			} else if m.state == containerView {
				m.containerListTable.Focus()
			}
		case "m":
			m.state = listView
		case "q", "ctrl+c":
			// Quit the program
			return m, tea.Quit
		}
	case tea.WindowSizeMsg:
		h, v := docStyle.GetFrameSize()
		m.list.SetSize(msg.Width-h, msg.Height-v)
	}
	// Process state-specific interactions
	switch m.state {
	case waitingForWebInputState:
		select {
		case input := <-m.inputChan:
			// Update the model with the input from the web form
			m.webInput = input
			// Transition to a state that handles the received input
			m.state = webInputReceivedState
			// Stop the loading indicator
			m.loading = false
		default:
			// While waiting, continue showing the loading message or spinner
			m.loading = true
			//m.loadingMsg = spinner.View() // If you're using a spinner component
		}
	case downloadingState:
		// Handle messages from the progress channel
		select {
		case progress, ok := <-m.progressChan:
			if ok {
				// Update progress bar with the received progress
				m.progressBar.SetProgress(progress)
			} else {
				// The channel has been closed, the download is complete
				// Transition to another state or perform other completion actions
				m.state = listView
			}
		default:
			// No progress update, proceed with other messages
		}
		//m.list, cmd = m.progressBar.Update(msg)
		//cmds = append(cmds, cmd)
	case walletView:
		//m.walletCard = populateWalletCard(m.controller.Account()) // prepare data for card
		////m.state = walletView
		//_, cmd = m.walletCard.Update(msg)
		//cmds = append(cmds, cmd)
	case listView:
		switch msg := msg.(type) {
		case tea.KeyMsg:
			if msg.String() == "enter" {
				// Handle selection in the list view
				i, ok := m.list.SelectedItem().(item)
				if ok {
					if i.contentID == "walletItems" {
						m.walletCard = populateWalletCard(m.controller.Account()) // prepare data for card
						m.state = walletView
					} else {
						m.choice = i.Title()
						retrieveContainers := views.SimulateNeoFS(views.Containers, i.contentID) // Get the content based on the selected item
						var rows []table.Row
						var containerHeadings = []table.Column{
							{Title: "ID", Width: 10},
							{Title: "Name", Width: 10},
							{Title: "Hash", Width: 10},
							{Title: "Size", Width: 10},
						}
						for _, v := range retrieveContainers {
							rows = append(rows, table.Row{
								v.ID, v.Name, v.Hash, fmt.Sprintf("%.1f", v.Size),
							})
						}
						m.containerListTable.SetColumns(containerHeadings)
						m.containerListTable.SetRows(rows)
						m.state = containerView // Transition to containerListTable view
					}
				}
			}
		}
		m.list, cmd = m.list.Update(msg)
		cmds = append(cmds, cmd)
	case objectView:
		switch msg := msg.(type) {
		case tea.KeyMsg:
			// Handle containerListTable interactions
			if msg.Type == tea.KeyEnter {
				// Handle selection in the containerListTable view
				r := m.objectListTable.SelectedRow()
				objectID := r[0]

				gateKey := m.controller.TokenManager.GateKey()
				//fixme: this takes time. we should have a manager to handle the fact we can't connect
				/*
						go func() {
							time.Sleep(1 * time.Second)
							spinnerEmitter <- true //something that listens and waits for the connection to establish
						}()
					//either this or a mock pool.
				*/

				mockAction := obj.MockObject{Id: "object", ContainerId: "container"}
				//mockAction := obj.Object{}
				mockAction.Notifier = m.controller.Notifier
				mockAction.Store = m.controller.DB
				//prep for some reading
				pBarName := "file_monitor"       //todo - expose the name of a progress bar
				destination := new(bytes.Buffer) //todo: this is where we want to put it
				file, fileStats := utils.MockFileCopy()
				fileWriterProgressBar := m.controller.ProgressBarManager.AddProgressWriter(destination, pBarName)
				//overwrite the progress managers emitter so that we can pick it up here
				m.controller.ProgressBarManager.StartProgressBar(m.controller.WG(), pBarName, fileStats.Size())
				m.controller.Add(1)
				go m.controller.Notifier.ListenAndEmit() //this sends out notifications to the frontend.

				var o obj.ObjectParameter
				o.Pl = m.pl
				o.GateAccount = &gateKey
				o.Id = objectID
				o.ContainerId = "87JeshQhXKBw36nULzpLpyn34Mhv1kGCccYyHU2BqGpT" //fixme
				bPubKey, err := hex.DecodeString(m.controller.Account().PublicKeyHexString())
				if err != nil {
					log.Fatal("could not decode public key - ", err)
				}
				var pubKey neofsecdsa.PublicKeyWalletConnect
				err = pubKey.Decode(bPubKey)
				o.PublicKey = ecdsa.PublicKey(pubKey)
				o.Attrs = make([]object.Attribute, 0)
				o.ActionOperation = eacl.OperationHead
				o.ReadWriter = &readwriter.DualStream{
					Reader: file,                  //here is where it knows the source of the data
					Writer: fileWriterProgressBar, //this is where we write the data to
				}
				o.ExpiryEpoch = 100
				if err := m.controller.PerformAction(m.controller.WG(), &o, mockAction.Head); err != nil {
					log.Fatal(err)
				}
				//fix me = remove this.
				//objects := views.SimulateNeoFS(views.Read, objectID) //should just be one element
				//if len(objects) == 0 {
				//	m.cardData = populateElementCard(views.Element{
				//		ParentID: "0",
				//		ID:       "0",
				//		Name:     "no data",
				//		Hash:     "no data",
				//		Size:     0,
				//	})
				//} else {
				//	m.cardData = populateElementCard(objects[0]) // prepare data for card
				//}
				/*
					1. the wait group will block this, so we don't want to block in the operation
					2. we need to find the channel to update the progress bar
					3. we will need a new type of emitter so that it updates here
				*/
				//m.state = objectCardView
				//m.actionToConfirm = func() sessionState {
				//	m.startDownloadProcess("http://example.com/file")
				//	return downloadingState
				//}
				m.state = downloadingState
				//m.state = detailedTableView // Transition to detailed containerListTable view
			} else if msg.Type == tea.KeyCtrlD {
				//ok so this is an option to have a wallet connect esq emitter.
				//r := m.objectListTable.SelectedRow()
				//objectID := r[0]
				//newContent := views.SimulateNeoFS(views.Read, objectID) //search by container ID (
				////Set the containerListTable with new content
				//m.objectListTable.SetColumns(newContent.columns)
				//m.objectListTable.SetRows(newContent.rows)
				//m.actionToConfirm = func() sessionState {
				//	m.startDownloadProcess("http://example.com/file")
				//	return downloadingState
				//}
				//m.state = confirmationView
			}
		}
		m.objectListTable, cmd = m.objectListTable.Update(msg)
		cmds = append(cmds, cmd)
	case confirmationView:
		// Handle the confirmation prompt logic here
		switch msg := msg.(type) {
		case tea.KeyMsg:
			switch msg.String() {
			case "y", "Y":
				m.confirmState = true
				m.state = m.actionToConfirm() // Perform the confirmed action
			case "n", "N":
				m.confirmState = false
				m.state = objectView
			}
		}
	case containerView:
		switch msg := msg.(type) {
		case tea.KeyMsg:
			// Handle containerListTable interactions
			if msg.Type == tea.KeyEnter {
				// Handle selection in the containerListTable view
				r := m.containerListTable.SelectedRow()
				containerID := r[0]
				listContainerContent := views.SimulateNeoFS(views.List, containerID) //search by container ID (
				logger.Println("Enter pressed in containerView - ", listContainerContent)

				var rows []table.Row
				var objectHeadings = []table.Column{
					{Title: "ID", Width: 10},
					{Title: "Name", Width: 10},
					{Title: "Hash", Width: 10},
					{Title: "Size", Width: 10},
				}
				for _, v := range listContainerContent {
					rows = append(rows, table.Row{
						v.ID, v.Name, v.Hash, fmt.Sprintf("%.1f", v.Size),
					})
				}
				m.objectListTable.SetColumns(objectHeadings)
				m.objectListTable.SetRows(rows)
				m.state = objectView
				m.objectListTable, cmd = m.objectListTable.Update(msg)
				cmds = append(cmds, cmd)
			}
		}
		// Update containerListTable interactions only when in containerView
		m.containerListTable, cmd = m.containerListTable.Update(msg)
		cmds = append(cmds, cmd)
	}

	return m, tea.Batch(cmds...)
}

func (m model) View() string {
	// Check the state to decide what to render
	switch m.state {
	case waitingForWebInputState:
		// If you have a loading indicator
		if m.loading {
			return "Please complete the action in your web browser...\n\n"
		}
		// Or simply a static message
		return "Please complete the action in your web browser..."
	case webInputReceivedState:
		// Display the received web input
		return fmt.Sprintf("Input received from the web: %s\n", m.webInput)
		// ... handle other states ...
	case walletView:
		return baseStyle.Render(m.walletCard.View())
	case downloadingState:
		return m.progressBar.View()
		//return fmt.Sprintf("downloading state: %d\n", m.progressBar.Value())
	case listView:

		// When in list view, render the list
		return baseStyle.Render(m.list.View())
	case containerView:
		// When in containerListTable view, render the table
		return baseStyle.Render(m.containerListTable.View())
	case objectView:
		logger.Println("view changed to objectView")
		// When in containerListTable view, render the table
		return baseStyle.Render(m.objectListTable.View())
	case objectCardView:
		return baseStyle.Render(m.cardData.View()) // return the card view
	case confirmationView:
		prompt := confirmationPrompt{
			question: "Are you sure? (Y/N)",
			choices:  []string{"Y", "N"},
		}
		return baseStyle.Render(prompt.View()) // return the card view
	default:
		// As a fallback, render the list (or a welcome message or similar)
		return baseStyle.Render("Please select an option from the list:\n\n" + m.list.View())
	}
}

func main() {

	logger = log.Default()
	f, err := tea.LogToFileWith("debug.log", "debug", logger)
	if err != nil {
		fmt.Println("fatal:", err)
		os.Exit(1)
	}
	defer f.Close()
	t := table.New(
		table.WithFocused(true),
		table.WithHeight(15),
	)
	ot := table.New(
		table.WithFocused(true),
		table.WithHeight(15),
	)

	s := table.DefaultStyles()
	s.Header = s.Header.
		BorderStyle(lipgloss.NormalBorder()).
		BorderForeground(lipgloss.Color("240")).
		BorderBottom(true).
		Bold(false)
	s.Selected = s.Selected.
		Foreground(lipgloss.Color("229")).
		Background(lipgloss.Color("57")).
		Bold(false)

	t.SetStyles(s)
	ot.SetStyles(s)

	l := list.New(options, list.NewDefaultDelegate(), 0, 0)
	l.SetShowStatusBar(false)
	l.SetFilteringEnabled(false)
	c, err := controller.NewMockController()
	if err != nil {
		log.Fatal(err)
	}
	acc := controller.WCWallet{}
	acc.WalletAddress = "NQtxsStXxvtRyz2B1yJXTXCeEoxsUJBkxW"
	acc.PublicKey = "031ad3c83a6b1cbab8e19df996405cb6e18151a14f7ecd76eb4f51901db1426f0b"
	c.SetAccount(&acc)
	mockSigner := emitter.MockWalletConnectEmitter{Name: "[mock signer]"}
	mockSigner.SignResponse = c.UpdateFromWalletConnect
	c.SetEmitter(mockSigner)

	m := model{
		controller:   c,
		state:        listView,
		progressChan: make(chan int),
		progressBar: NewSimpleProgressBar(100, func(progress int) {
			logger.Println("sending to update ", progress)
			p.Send(progressUpdateMsg{progress: progress})
		}), // Assuming 100 is the total progress
		inputChan:          make(chan string),
		containerListTable: t,
		objectListTable:    ot,
		list:               l,
	}
	gateKey := m.controller.TokenManager.GateKey()
	pl, err := gspool.GetPool(context.Background(), gateKey.PrivateKey().PrivateKey, utils.RetrieveStoragePeers(utils.MainNet))
	if err != nil {
		fmt.Println("error getting pool ", err)
		log.Fatal(err)
	}
	m.pl = pl
	//override the progress bar from the default controller
	//c.ProgressBarManager.Emitter = m.progressBar
	m.list.Title = "Options"
	// Start Bubble Tea
	p = tea.NewProgram(m)
	if _, err := p.Run(); err != nil {
		fmt.Println("Error running program:", err)
		os.Exit(1)
	}
}
