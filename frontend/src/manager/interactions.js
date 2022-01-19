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

export {
    retrieveContainerFileSystem,
    retrieveFullFileSystem
}
