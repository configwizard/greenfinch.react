const listContainers = async () => {
    try {
        let containers = require('../dbg_data_structures/ListPopulatedContainers.json');
        // let containers = await window.go.mocker.Mocker.ListContainers("ListPopulatedContainers.json")
        console.log("containers", containers)
        return containers
    } catch(e) {
        console.log("error listing containers", e)
    }
}

const getContainer = async (containerID) => {
    try {
        let container = await window.go.mocker.Mocker.GetContainer(containerID)
        return container
    } catch(e) {
        console.log("error retrieving containers", e)
    }
}

const createContainer = async (name) => {
    if (name === "") {
        throw new Error("a container must have a name")
    }
    try {
        console.log("creating container with name", name)
        let containerId = await window.go.mocker.Mocker.CreateContainer(name)
        console.log("created container", containerId)
        return containerId
    } catch(e) {
        console.log("error creating containers", e)
    }
}

const deleteContainer = async (containerId) => {
    try {
        await window.go.mocker.Mocker.DeleteContainer(containerId)
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
