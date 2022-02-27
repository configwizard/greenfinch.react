const retrieveFullFileSystem = async () => {
    try {
        let resp = await window.go.manager.Manager.RetrieveFileSystem()
        console.log(resp)
        return resp
    } catch(e) {
        console.log("error retrieving filesystem", e)
    }
}

const retrieveContainerFileSystem = async (containerID) => {
    try {
        let resp = await window.go.manager.Manager.RetrieveContainerFileSystem(containerID)
        return resp
    } catch(e) {
        console.log("error retrieving filesystem", e)
    }
}

const searchObjects = async (search) => {
    try {
        let resp = await window.go.manager.Manager.Search(search)
        console.log("search for", search, 'renders ', resp)
        return resp
    } catch(e) {
        console.log("error searching", e)
    }
}
searchObjects("cat").then(r => console.log("found results for cat", r))
export {
    retrieveContainerFileSystem,
    retrieveFullFileSystem,
    searchObjects
}
