import React from 'react';
import { fileSize } from "humanize-plus";
import Moment from "react-moment";

// Actual
import { deleteContainer, listContainers } from '../../../manager/containers.js';
import { deleteObject, getObject, listObjects, uploadObject } from '../../../manager/objects.js';
import { openInDefaultBrowser } from "../../../manager/manager.js";
import { listContacts } from "../../../manager/contacts";

// Mocker
// import { deleteContainer, listContainers} from '../../../mocker/containers.js';
// import { deleteObject, getObject, listObjects, uploadObject } from '../../../mocker/objects.js';

// Components
import HeadingGeneral from '../../atoms/HeadingGeneral';
import ControlBar from '../../molecules/ControlBar';
import BreadCrumb from '../../organisms/Breadcrumb';
import ContainerHeaderPage from '../../organisms/HeaderPage/ContainerHeaderPage';
import ViewContainers from '../../organisms/ViewContainers';
import ViewObjects, { ContainerPreviewButton, FileUpload } from '../../organisms/ViewObjects';
import ContainerShareButton from '../../organisms/ContainerShareButton';

// Central style sheet for templates
import '../_settings/style.scss';
import retrieveCorrectComponent from "../hacked/containerObjectHandler";

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
    onObjectSelection = async (objectID, objectName) => {
        if (this.state.selectedContainer == null) {
            throw new Error("cannot retrieve an object from non existent container")
        }
        console.log("selected", objectID, objectName)
        //we will need to call the function to get the objects for a specific container ID and update the objectList
        const selectedObject = {
            objectID,
            objectName
        }
        let state = this.state
        this.setState({...state, selectedObject})
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
            throw new Error("cannot retrieve an object from non existent container")
        }
        let state = this.state
        const objectList = await uploadObject(this.state.selectedContainer.containerID)
        this.setState({...this.state, objectList})
    }
    onContainerDelete = async (containerId) => {
        this.setState(this.setState({...this.state, containerList: []}))
        let response = await deleteContainer(containerId)
        console.log("deleting container ", containerId, response)
        const containers = await listContainers()
        console.log("listing containers 1", containers)
        await this.setState(this.setState({...this.state, containerList: containers}))
    }
    onObjectDelete = async (objectId) => {
        if (this.state.selectedContainer == null) {
            throw new Error("cannot retrieve an object from non existent container")
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
            <div class="templatePage d-flex flex-column flex-grow-1">
                <div class="row">
                    <div className="col-12">
                        <ContainerHeaderPage 
                            pageTitle={"Containers"} 
                            hasButton={true}
                            hasIcon={true}
                            faClass={"fas fa-plus-circle"}
                            buttonText={"Create new container"}
                        />
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
                            {retrieveCorrectComponent(this.state, this.onObjectSelection, this.onObjectDelete, this.onObjectDownload, this.onObjectUpload, this.onContainerSelection, this.onContainerDelete)}
                        </div>

                    </div>
                </div>
            </div>
        );
    }
}

export default Containers;
