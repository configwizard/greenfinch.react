const listContainers = async () => {
    try {
        await window.go.manager.Manager.ListContainersAsync()
    }catch (e) {
        console.log("error listing containers", e)
    }
}
const getContainer = async (containerID) => {
    try {
        let container = await window.go.manager.Manager.GetContainer(containerID)
        return container
    } catch(e) {
        console.log("error retrieving containers", e)
    }
};
const createContainer = async (name) => {
    try {
        let containerId = await window.go.manager.Manager.CreateContainer(name)
        console.log("created container", containerId)
        return containerId
    } catch(e) {
       console.log("error creating containers", e)
    }
}

const deleteContainer = async (containerId) => {
    try {
        await window.go.manager.Manager.DeleteContainer(containerId)
    } catch (e) {
        console.log("error deleting containers", e)
    }
}

export {
    listContainers,
    getContainer,
    createContainer,
    deleteContainer
}
