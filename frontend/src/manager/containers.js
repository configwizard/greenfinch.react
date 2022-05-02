const listContainers = async () => {
    try {
        const containers = await window.go.manager.Manager.ListContainers(false)
        console.log("received containers ", containers)
        return containers
    }catch (e) {
        console.log("error listing containers", e)
        return []
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
const createContainer = async (name, permission, block) => {
    try {
        let containerId = await window.go.manager.Manager.CreateContainer(name, permission, block)
        console.log("created container", containerId)
        return containerId
    } catch(e) {
       console.log("error creating containers", e)
    }
}

const deleteContainer = async (containerId) => {
    console.log("deleting container with id -", containerId)
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
