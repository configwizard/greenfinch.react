const listObjects = async (containerID) => {
    try {
        let objects = require('../dbg_data_structures/listContainerPopulatedObjects.json');
        console.log("objects", objects)
        return objects
    } catch(e) {
        console.log("error listing objects in containers", )
    }
}
const getObject = async (objId, containerID) => {
    try {
        let metaData = await window.go.manager.Manager.Download(objId, containerID)
        return metaData
    } catch(e) {
        console.log("error retrieving object", e)
    }
}
const getObjectMetaData = async (objId, containerID) => {
    try {
        let metaData = await window.go.mocker.Mocker.GetObjectMetaData(objId, containerID)
        return metaData
    } catch(e) {
        console.log("error retrieving metadata", e)
    }
}
const deleteObject = async (objId, containerID) => {
    try {
        await window.go.mocker.Mocker.DeleteObject(objId, containerID)
    } catch(e) {
        console.log("error deleting object ", e)
    }
}

const uploadObject = async (containerID) => {
    try {
        let attributes = {james: "bond"}
        let result = await window.go.mocker.Mocker.Upload(containerID, attributes)
        return result
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
