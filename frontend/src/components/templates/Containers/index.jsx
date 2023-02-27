import React from 'react';

import { deleteContainer, listContainers } from '../../../manager/containers.js';
import { deleteObject, getObject, listObjects, uploadObject } from '../../../manager/objects.js';
import { listContacts } from '../../../manager/contacts';

// Mocker
// import { deleteContainer, listContainers} from '../../../mocker/containers.js';
// import { deleteObject, getObject, listObjects, uploadObject } from '../../../mocker/objects.js';

// Components
import NoContent from '../../atoms/NoContent';
import ControlBar from '../../molecules/ControlBar';
import BreadCrumb from '../../organisms/Breadcrumb';
import ContainerHeaderPage from '../../organisms/HeaderPage/ContainerHeaderPage';
import filterContent from './OrganiseContent';

// Central style sheet for templates
import '../_settings/style.scss';

function TextClickAction() {
    console.log("Button clicked, add modal onClick here")
}

class Containers extends React.Component {
    constructor(props) {
        super(props);
        this.state = {shared: false, contacts: [], containerList: [], objectList: [], selectedObject: null, selectedContainer: null, viewMode: "grid", objectsLoaded: false, requestNewWallet: false};
    }
    async componentDidMount() {
        window.runtime.EventsOn("networkchanged", async (message) => {
            console.log("refreshing containers")
            await this.onRefresh()
        })
        window.runtime.EventsOn("containerschanged", async (message) => {
            console.log("refreshing containers")
            await this.onRefresh()
        })
        const contacts = await listContacts()
        console.log("share contacts", contacts)
        console.log("received wallet", this.props.account)
        const containers = await listContainers()
        console.log("listing containers 1", containers)
        await this.setState(this.setState({...this.state, contacts: contacts, containerList: containers, objectList: []}))
        console.log("componentDidMount, objects", this.state.objectList)
    }
    onRefresh = async() => {
        await this.props.refreshAccount()
        console.log("onRefresh, objects", this.state.objectList)
        const contacts = await listContacts()
        console.log("share contacts", contacts)
        //ROBIN!! -- uncomment this following line if you want to really refresh the app.
        // window.location.reload(false); //disable this
        await this.setState(this.setState({...this.state, contacts: [], containerList: [], objectList: []}))
        const containers = await listContainers()
        console.log("listing containers 2", containers)
        await this.setState(this.setState({...this.state, containerList: containers, objectList: []}))
        if (this.state.selectedContainer == null) {
            return
        }
        const objectList = await listObjects(this.state.selectedContainer.containerID) || []
        await this.setState({...this.state, objectList})
    }
    onSelected = async (selected) => {
        console.dir(selected)
    }
    onViewChange = async (viewMode) => {
        let state = this.state
        this.setState({...state, viewMode: viewMode})
    }
    onContainerSelection = async (containerID, containerName, permissions, sharable, createdAt, size) => {
        //we will need to call the function to get the objects for a specific container ID and update the objectList
        const selectedContainer = {
            containerID,
            containerName,
            permissions,
            sharable,
            createdAt,
            size
        }
        console.log("selected container.... ", selectedContainer)
        let state = this.state

        this.setState({...state, selectedContainer, objectsLoaded: false})
        const objectList = await listObjects(containerID)
        let containerSize = 0
        objectList.forEach((x => {
            console.log("retrieving object ", x)
            containerSize += x.size
        }))
        selectedContainer.size = containerSize
        console.log("container selected object list", objectList)
        this.setState({...state, selectedContainer, objectList, objectsLoaded: true})
    }
    onObjectSelection = async (objectID, objectName, objectFile, size, uploadedAt) => {
        if (this.state.selectedContainer == null) {
            throw new Error("cannot retrieve an object from non existent container 1")
        }
        console.log("selected", objectID, objectName, uploadedAt)
        //we will need to call the function to get the objects for a specific container ID and update the objectList
        const selectedObject = {
            objectID,
            objectName,
            objectFile,
            size,
            uploadedAt
        }
        let state = this.state
        await this.setState({...state, selectedObject})
        // await getObject(objectName, objectID, this.state.selectedContainer.containerID)
        console.log('state after selecting object', this.state)
    }
    onObjectDownload = async() => {
        if (this.state.selectedObject == null) {
            return
        }
        await getObject(this.state.selectedObject.objectName, this.state.selectedObject.objectID, this.state.selectedContainer.containerID)
    }
    onObjectUpload = async () => {
        if (this.state.selectedContainer == null) {
            throw new Error("cannot retrieve an object from non existent container 2")
        }
        let state = this.state
        const objectList = await uploadObject(this.state.selectedContainer.containerID)
        this.setState({...this.state, objectList})
    }
    onContainerDelete = async (containerId) => {
        this.setState({...this.state, containerList: []})
        let containerList = await deleteContainer(containerId)
        console.log("deleting container ", containerId, containerList)
        // const containers = await listContainers()
        // console.log("listing containers 1", containers)
        await this.setState(this.setState({...this.state, containerList}))
    }
    onObjectDelete = async (objectId) => {
        if (this.state.selectedContainer == null) {
            throw new Error("cannot retrieve an object from non existent container 3")
        }
        const containerId = this.state.selectedContainer.containerID
        let objectList = await deleteObject(objectId, containerId)
        console.log("deleting object ", objectId, containerId, objectList)
        this.setState({...this.state, objectList})
    }
    resetBreadcrumb = async () => {
        let state = this.state
        await this.setState({...state, objectList: [], selectedObject: null, selectedContainer: null})
    }

    render() {
        console.log("props/state account", this.props.account, this.state.account)
        return (
            <div className="templatePage d-flex flex-column flex-grow-1">
                <div className="row">
                    <div className="col-12">
                        <ContainerHeaderPage 
                            pageTitle={"Containers"} 
                            hasButton={true}
                            hasIcon={true}
                            faClass={"fas fa-plus-circle"}
                            buttonText={"Create new container"}
                        />
                        <div className="row">
                            <div className="col-12">

                                    {this.state.containerList.length > 0 ? 
                                        <>
                                            <div className="containerOptions">
                                                <div className="row">
                                                    <div className="col-6">
                                                        <BreadCrumb account={this.props.account} onRefresh={this.onRefresh} resetBreadcrumb={this.resetBreadcrumb} container={this.state.selectedContainer} object={this.state.selectedObject}></BreadCrumb>
                                                    </div>
                                                    <div className="col-6">
                                                        <ControlBar resetBreadcrumb={this.resetBreadcrumb} changeView={this.onViewChange} viewMode={this.state.viewMode} selectedContainer={this.state.selectedContainer}></ControlBar>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                {filterContent(this.state, this.onObjectSelection, this.onObjectDelete, this.onObjectDownload, this.onObjectUpload, this.onContainerSelection, this.onContainerDelete)}
                                            </div>
                                        </>
                                        : <NoContent
                                            text={"You currently have no containers."}
                                            textAction={"Create your first container."}
                                            textClick={TextClickAction} />
                                    }

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Containers;
