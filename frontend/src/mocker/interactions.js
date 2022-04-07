const retrieveFullFileSystem = async () => {
    try {
        let resp = await window.go.mocker.Mocker.RetrieveFileSystem("listContainerPopulatedObjects.json")
        console.log(resp)
        return resp
    } catch(e) {
        console.log("error retrieving filesystem", e)
    }
}
const retrieveContainerFileSystem = async (containerID) => {
    try {
        let resp = await window.go.mocker.Mocker.RetrieveContainerFileSystem(containerID, "listContainerPopulatedObjects.json")
        return resp
    } catch(e) {
        console.log("error retrieving filesystem", e)
    }
}
const searchObjects = async (search) => {
    try {
        let resp = await window.go.mocker.Mocker.Search(search, "listContainerPopulatedObjects.json")
        console.log("search for", search, 'renders ', resp)
        return resp
    } catch(e) {
        console.log("error searching", e)
    }
}

export {
    retrieveContainerFileSystem,
    retrieveFullFileSystem,
    searchObjects
}
