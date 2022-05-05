const addSharedContainer = async (containerId) => {
    console.log("received container ID", containerId)
    try {
        console.log("container ID to add", containerId)
        let containerId = await window.go.manager.Manager.AddSharedContainer("32w1uCZm6GG5pEFyy6MCw3MEcLoiuCijTqYpCe9Suqxh")
        console.log("created container", containerId)
        return containerId
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

export {
    addSharedContainer,
    listSharedContainers
}
