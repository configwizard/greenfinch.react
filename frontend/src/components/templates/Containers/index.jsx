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
import ButtonText from '../../atoms/ButtonText';
import HeadingGeneral from '../../atoms/HeadingGeneral';
import ControlBar from '../../molecules/ControlBar';
import BreadCrumb from '../../organisms/Breadcrumb';
import ContainerHeaderPage from '../../organisms/HeaderPage/ContainerHeaderPage';
import ViewContainers from '../../organisms/ViewContainers';
import ViewObjects, { ContainerPreviewButton, FileUpload } from '../../organisms/ViewObjects';
import ContainerShareButton from '../../organisms/ContainerShareButton';

// Central style sheet for templates
import '../_settings/style.scss';

const selectPermission = (rawPermission) => {
    switch(rawPermission) {
        case 478973132 :
            return "Private"
        case 264211711:
            return "Public Read Only"
        case 264224767:
            return "Public Read/Write"
        case 268423167:
            return "custom - " + rawPermission.toString(16);
        default:
        return rawPermission.toString(16)
    }
}

class Containers extends React.Component {
    constructor(props) {
        super(props);
        this.state = {contacts: [], containerList: [], objectList: [], selectedObject: null, selectedContainer: null, viewMode: "grid", objectsLoaded: false, requestNewWallet: false};
    }
    async componentDidMount() {

        // const account = await getAccountInformation()
        // // console.log("now have wallet ", this.props.account)
        // await this.props.setStatusAccount(account)
        // // await this.setState({...this.state, account})

        // window.runtime.EventsOn("appendContainer", async (container) => {
        //     let containerList = this.state.containerList
        //     console.log("new container added", container)
        //     containerList.push(container)
        //     await this.setState({...this.state, containerList})
        // })
        // window.runtime.EventsOn("appendObject", async (object) => {
        //     let objectList = this.state.objectList
        //     objectList.push(object)
        //     await this.setState({...this.state, objectList})
        // })
        //
        // window.runtime.EventsOn("clearContainer", async () => {
        //     await this.setState(this.setState({...this.state, containerList: []}))
        // })
        // window.runtime.EventsOn("freshUpload", async (value) => {
        //     console.log("fresh objects made", value)
        //     const objectList = await listObjects(this.state.selectedContainer.containerID) || []//list contents of a container
        //     await this.setState({...this.state, objectList})
        // })
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
        await uploadObject(this.state.selectedContainer.containerID)
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
        let response = await deleteObject(objectId, containerId)
        console.log("deleting object ", objectId, containerId, response)

    }
    resetBreadcrumb = async () => {
        let state = this.state
        await this.setState({...state, objectList: [], selectedObject: null, selectedContainer: null})
    }
    retrieveCorrectComponent() {
        if (this.state.selectedContainer == null) {
            return (
                <>
                    <div className="col-4">
                        <p>Select a container to open and view contents.</p>
                    </div>
                    <div className="col-8">
                        <div className="orgContainersGrid">
                            <ViewContainers containerList={this.state.containerList} onDelete={this.onContainerDelete} viewMode={this.state.viewMode} onContainerSelection={this.onContainerSelection}></ViewContainers>
                        </div>
                    </div>
                </>
            )
        } else {
            return (
                <>
                    <div className="container-data col-4">
                        <div className="neo folder-icon"></div>
                        <HeadingGeneral
                            level={"h5"}
                            isUppercase={false}
                            text={this.state.selectedContainer.containerName}/>
                        <HeadingGeneral
                            level={"h6"}
                            isUppercase={true}
                            text={"Container ID"}/>
                        <p>{this.state.selectedContainer.containerID}</p>
                        <HeadingGeneral
                            level={"h6"}
                            isUppercase={true}
                            text={"Container permission"}/>
                        <p>{selectPermission(this.state.selectedContainer.permissions)}</p>
                        <HeadingGeneral
                            level={"h6"}
                            isUppercase={true}
                            text={"Container created"}/>
                        <p><Moment unix format="DD MMM YY">{this.state.selectedContainer.createdAt}</Moment></p>
                        <HeadingGeneral
                            level={"h6"}
                            isUppercase={true}
                            text={"Container size"}/>
                        <p>{fileSize(this.state.selectedContainer.size)}</p>
                        <div class="buttonStack">
                            <ContainerPreviewButton 
                                icon="fas fa-upload" 
                                text="Upload to this container" 
                                onClick={this.onObjectUpload}/>
                            <ContainerShareButton 
                                containerId={this.state.selectedContainer.containerID} 
                                contacts={this.state.contacts}/>
                                {
                                    this.state.selectedObject ?
                                    <>
                                        <div className="object-data" id={"objectData"}>
                                            <HeadingGeneral
                                                level={"h5"}
                                                isUppercase={false}
                                                text={this.state.selectedObject.objectName || null}/>
                                            <HeadingGeneral
                                                level={"h6"}
                                                isUppercase={true}
                                                text={"Object ID"}/>
                                                <p>{this.state.selectedObject.objectID || null}</p>
                                            <ContainerPreviewButton icon="fas fa-download" text="Download this object" onClick={this.onObjectDownload}></ContainerPreviewButton>
                                            { this.state.selectedContainer.permissions === 264211711 || 264224767 ?
                                                <ButtonText 
                                                    type="clean"
                                                    size="small"
                                                    hasIcon={true}
                                                    faClass={"fas fa-external-link"}
                                                    text={"Click to view file in web browser"}
                                                    onClick={() => openInDefaultBrowser(`https://http.testnet.fs.neo.org/${this.state.selectedContainer.containerID}/${this.state.selectedObject.objectID}`)} /> 
                                            : null}
                                        </div>
                                    </> : null
                                }
                            </div>
                    </div>
                    <div className="col-8">
                        <div className="orgContainersGrid">
                            <ViewObjects objectsLoaded={this.state.objectsLoaded} onDelete={this.onObjectDelete} objectList={this.state.objectList} viewMode={this.state.viewMode} onObjectSelection={this.onObjectSelection}></ViewObjects>
                        </div>
                    </div>
                </>
            )
        }
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

                        <div class="row">
                            <div class="col-12">
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
                                <div className="templateWrapper">
                                    <div className="templateContainer">
                                        <div className="row">
                                            {this.retrieveCorrectComponent()}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        );
    }
}

export default Containers;
