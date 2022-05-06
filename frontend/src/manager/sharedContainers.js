const addSharedContainer = async (containerId) => {
    try {
        console.log("container ID to add", containerId)
        let response = await window.go.manager.Manager.AddSharedContainer(containerId)
        console.log("created container", response)
        return response
    } catch(e) {
        console.log("error adding container", e)
    }
}
const listSharedContainers = async () => {
    try {
        const containers = await window.go.manager.Manager.ListSharedContainers()
        console.log("received containers ", containers)
        return containers || []
    }catch (e) {
        console.log("error listing containers", e)
        return []
    }
}
const listSharedContainerObjects = async (containerID) => {
    try {
        let objects = await window.go.manager.Manager.ListSharedContainerObjects(containerID, false)
        console.log("objects", objects)
        return objects || []
    } catch(e) {
        console.log("error listing objects in containers", e)
    }
}
export {
    addSharedContainer,
    listSharedContainers,
    listSharedContainerObjects
}
