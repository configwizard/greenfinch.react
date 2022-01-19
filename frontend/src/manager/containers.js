const listContainers = async () => {
    try {
        let containerIds = await window.go.manager.Manager.ListContainers()
        return containerIds
    }catch (e) {
        console.log("error listing containers", e)
    }
}
const getContainer = async (containerID) => {
    try {
        let container = await window.go.manager.Manager.GetContainer(containerID)
    } catch(e) {
        console.log("error retrieving containers", e)
    }
};
const createContainer = async (name) => {
    try {
        let containerId = await window.go.manager.Manager.CreateContainer(name)
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
