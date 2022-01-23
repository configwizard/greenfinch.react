const retrieveFullFileSystem = async () => {
    try {
        let resp = await window.go.mocker.Mocker.RetrieveFileSystem()
        console.log(resp)
        return resp
    } catch(e) {
        console.log("error retrieving filesystem", e)
    }
}

const retrieveContainerFileSystem = async (containerID) => {
    try {
        let resp = await window.go.mocker.Mocker.RetrieveContainerFileSystem(containerID)
        return resp
    } catch(e) {
        console.log("error retrieving filesystem", e)
    }
}

export {
    retrieveContainerFileSystem,
    retrieveFullFileSystem
}
