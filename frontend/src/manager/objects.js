const listObjects = async (containerID) => {
    try {
        let objectIds = await window.go.manager.Manager.ListContainerObjects(containerID)
        return objectIds
    } catch(e) {
        console.log("error listing objects in containers", )
    }
}
const getObjectMetaData = async (objId, containerID) => {
    try {
        let metaData = await window.go.manager.Manager.GetObjectMetaData(objId, containerID)
        return metaData
    } catch(e) {
        console.log("error retrieving metadata", e)
    }
}
const deleteObject = async (objId, containerID) => {
    try {
        await window.go.manager.Manager.DeleteObject(objId, containerID)
    } catch(e) {
        console.log("error deleting object ", e)
    }
}

const uploadObject = async (containerID) => {
    try {
        let attributes = {james: "bond"}
        let result = await window.go.manager.Manager.Upload(containerID, attributes)
        return result
    } catch(e) {
        console.log("error uploading content", e)
    }
}
export {
    listObjects,
    getObjectMetaData,
    deleteObject,
    uploadObject
}
