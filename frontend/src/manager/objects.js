const listObjects = async (containerID) => {
    try {
        let objects = await window.go.manager.Manager.ListContainerPopulatedObjects(containerID)
        console.log("objects", objects)
        return objects
    } catch(e) {
        console.log("error listing objects in containers", e)
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
        let attributes = {} //map - string:string only - will cause error
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
