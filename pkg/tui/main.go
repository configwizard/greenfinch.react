package main

import (
	"fmt"
	"github.com/amlwwalker/greenfinch.react/pkg/tui/views"
	"github.com/charmbracelet/bubbles/list"
	"log"
	"os"
	"time"

	"github.com/charmbracelet/bubbles/table"
	tea "github.com/charmbracelet/bubbletea"
	"github.com/charmbracelet/lipgloss"
)

var p *tea.Program

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
	detailedTableView
	spinnerView
	timerView
)

var baseStyle = lipgloss.NewStyle().
	BorderStyle(lipgloss.NormalBorder()).
	BorderForeground(lipgloss.Color("240"))

var docStyle = lipgloss.NewStyle().Margin(1, 2)

type model struct {
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
	case listView:
		switch msg := msg.(type) {
		case tea.KeyMsg:
			if msg.String() == "enter" {
				// Handle selection in the list view
				i, ok := m.list.SelectedItem().(item)
				if ok {
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
				logger.Println("id ", objectID)
				objects := views.SimulateNeoFS(views.Read, objectID) //should just be one element
				if len(objects) == 0 {
					m.cardData = populateCard(views.Element{
						ParentID: "0",
						ID:       "0",
						Name:     "no data",
						Hash:     "no data",
						Size:     0,
					})
				} else {
					m.cardData = populateCard(objects[0]) // prepare data for card
				}
				m.state = objectCardView
				//m.state = detailedTableView // Transition to detailed containerListTable view
			} else if msg.Type == tea.KeyCtrlD {
				//r := m.objectListTable.SelectedRow()
				//objectID := r[0]
				//newContent := views.SimulateNeoFS(views.Read, objectID) //search by container ID (
				// Set the containerListTable with new content
				//m.objectListTable.SetColumns(newContent.columns)
				//m.objectListTable.SetRows(newContent.rows)
				//m.actionToConfirm = func() sessionState {
				//	m.startDownloadProcess("http://example.com/file")
				//	return downloadingState
				//}
				m.state = confirmationView
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

	case downloadingState:
		//return m.progressBar.View()
		return fmt.Sprintf("downloading state: %s\n", m.progressBar.Value())
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
	m := model{
		state:              listView,
		progressChan:       make(chan int),
		progressBar:        NewSimpleProgressBar(100), // Assuming 100 is the total progress
		inputChan:          make(chan string),
		containerListTable: t,
		objectListTable:    ot,
		list:               l,
	}
	m.list.Title = "Options"
	// Start Bubble Tea
	p = tea.NewProgram(m)
	if _, err := p.Run(); err != nil {
		fmt.Println("Error running program:", err)
		os.Exit(1)
	}
}
