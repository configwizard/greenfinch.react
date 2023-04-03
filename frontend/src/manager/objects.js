const listObjects = async (containerID, showDeleted=false) => {
    try {
        let objects = await window.go.manager.Manager.ListContainerObjects(containerID, false, showDeleted)
        console.log("objects", objects)
        return objects || []
    } catch(e) {
        console.log("error listing objects in containers", e)
    }
}
//contanierID Q9dpMA6t7drq8KJB5qa7jQ6JN6GMSGBH3qrxHN7v2TC
//objectID BWMzu5CGatL4n9idE2K3PTojynfAmoykaiVtKdeDm7iD
const getObject = async (filename, objId, containerID) => {
    try {
        let metaData = await window.go.manager.Manager.Download(filename, objId, containerID)
        return metaData
    } catch(e) {
        console.log("error retrieving object", e, "container id", containerID, "object id", objId)
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
        const response = await window.go.manager.Manager.DeleteObject(objId, containerID)
        return response || []
    } catch(e) {
        console.log("error deleting object ", e)
    }
}

const uploadObject = async (containerID) => {
    try {
        let attributes = {} //map - string:string only - will cause error
        let response = await window.go.manager.Manager.Upload(containerID, attributes)
        return response || []
    } catch(e) {
        console.log("error uploading content", e)
    }
}
export {
    listObjects,
    getObject,
    getObjectMetaData,
    deleteObject,
    uploadObject
}
