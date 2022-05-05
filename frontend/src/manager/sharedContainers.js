const addSharedContainer = async (containerId) => {
    try {
        let containerId = await window.go.manager.Manager.AddSharedContainer(containerId)
        console.log("created container", containerId)
        return containerId
    } catch(e) {
        console.log("error creating containers", e)
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

export {
    addSharedContainer,
    listSharedContainers
}
