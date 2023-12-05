package views

type Element struct {
	ParentID, ID, Name, Hash string
	Size                     float32
}

// Sample Containers
var containers = []Element{
	{ID: "C1", Name: "Container 1", Size: 10.0},
	{ID: "C2", Name: "Container 2", Size: 15.0},
	{ID: "C3", Name: "Container 3", Size: 0.0},
}

// Sample Objects
var objects = []Element{
	{"C1", "O1", "Object 1", "Hash1", 2.0},
	{"C1", "O2", "Object 2", "Hash2", 3.0},
	{"C2", "O3", "Object 3", "Hash3", 4.0},
	{"C2", "O4", "Object 4", "Hash4", 5.0},
	{"C3", "O5", "Object 5", "Hash5", 6.0},
	// Add more objects as needed
}

// Function to filter objects by a container's ID
func filterObjectsByContainerID(containerID string) []Element {
	var filteredObjects []Element
	for _, obj := range objects {
		if obj.ParentID == containerID {
			filteredObjects = append(filteredObjects, obj)
		}
	}
	return filteredObjects
}

// Function to filter objects by a container's ID
func filterObjectsById(objectID string) []Element {
	var filteredObjects []Element
	for _, obj := range objects {
		if obj.ID == objectID {
			filteredObjects = append(filteredObjects, obj)
			return filteredObjects
		}
	}
	return filteredObjects
}

type Command int32

const (
	Containers Command = iota
	List
	Read
	Write
	Delete
)

func SimulateNeoFS(command Command, ref string) []Element { //this will be the async requester
	switch command {
	case Containers:
		return containers
	case List:
		return filterObjectsByContainerID(ref)
	case Read:
		return filterObjectsById(ref)
	}
	return nil
}
