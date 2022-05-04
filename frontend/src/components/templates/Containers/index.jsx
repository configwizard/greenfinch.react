import React from 'react';

// Actual
import { deleteContainer, listContainers} from '../../../manager/containers.js';
import { deleteObject, getObject, listObjects, uploadObject } from '../../../manager/objects.js';

// Mocker
// import { deleteContainer, listContainers} from '../../../mocker/containers.js';
// import { deleteObject, getObject, listObjects, uploadObject } from '../../../mocker/objects.js';

// Components
import HeadingGeneral from '../../atoms/HeadingGeneral';
import ControlBar from '../../molecules/ControlBar';
import BreadCrumb from '../../organisms/HeaderArtboard';
import ViewContainers from '../../organisms/ViewContainers';
import ViewObjects, { FileUpload } from '../../organisms/ViewObjects';
import ContainerShare from '../../organisms/ContainerShare';

// Central style sheet for templates
import '../_settings/style.scss';
import {fileSize} from "humanize-plus";
import Moment from "react-moment";


const selectPermission = (rawPermission) => {
    switch(rawPermission) {
        case 478973132 :
            return "PrivateBasicRule"
        case 264211711:
            return "EACLReadOnlyBasicRule"
        case 264224767:
            return "EACLPublicBasicRule"
        case 268423167:
            return "custom - " + rawPermission.toString(16);
        default:
        return rawPermission.toString(16)
    }
}
class Containers extends React.Component {
    constructor(props) {
        super(props);
        this.state = {containerList: [], objectList: [], selectedObject: null, selectedContainer: null, viewMode: "grid", objectsLoaded: false, requestNewWallet: false};
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
        console.log("received wallet", this.props.account)
        const containers = await listContainers()
        console.log("listing containers 1", containers)
        await this.setState(this.setState({...this.state, containerList: containers, objectList: []}))
        console.log("componentDidMount, objects", this.state.objectList)
    }
    onRefresh = async() => {
        await this.props.refreshAccount()
        console.log("onRefresh, objects", this.state.objectList)
        //ROBIN!! -- uncomment this following line if you want to really refresh the app.
        // window.location.reload(false); //disable this
        await this.setState(this.setState({...this.state, containerList: [], objectList: []}))
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
        await getObject(objectName, objectID, this.state.selectedContainer.containerID)
        console.log('state after selecting object', this.state)
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
                    <div className="col-3">
                        <p>Select a container to see more information and it's contents</p>
                    </div>
                    <div className="col-9">
                        <div className="orgContainersGrid">
                            <div className="row">
                                <ViewContainers containerList={this.state.containerList} onDelete={this.onContainerDelete} viewMode={this.state.viewMode} onContainerSelection={this.onContainerSelection}></ViewContainers>
                            </div>
                        </div>
                    </div>
                </>
            )
        } else {
            return (
                <>
                    <div className="col-3">
                        <i className="fas fa-4x fa-folder"/>
                        <h4>{this.state.selectedContainer.containerName}</h4>
                        <HeadingGeneral
                            level={"h6"}
                            isUppercase={true}
                            text={"Container ID"}/>
                        <p style={{fontSize:9}}>{this.state.selectedContainer.containerID}</p>
                        <HeadingGeneral
                            level={"h6"}
                            isUppercase={true}
                            text={"Container permission"}/>
                        <p style={{fontSize:9}}>{
                            selectPermission(this.state.selectedContainer.permissions)
                        }</p>
                        <HeadingGeneral
                            level={"h6"}
                            isUppercase={true}
                            text={"Container created"}/>
                        <p style={{fontSize:9}}><Moment unix format="DD MMM YY">{this.state.selectedContainer.createdAt}</Moment></p>
                        <HeadingGeneral
                            level={"h6"}
                            isUppercase={true}
                            text={"Container size"}/>
                        <p style={{fontSize:9}}>{fileSize(this.state.selectedContainer.size)}</p>
                        <hr/>
                        <FileUpload onObjectUpload={this.onObjectUpload}></FileUpload>
                        <ContainerShare/>
                    </div>
                    <div className="col-9">
                        <div className="orgContainersGrid">
                            <div className="row">
                                <ViewObjects objectsLoaded={this.state.objectsLoaded} onDelete={this.onObjectDelete} objectList={this.state.objectList} viewMode={this.state.viewMode} onObjectSelection={this.onObjectSelection}></ViewObjects>
                            </div>
                        </div>
                    </div>
                </>
            )
        }
    }
    render() {
        console.log("props/state account", this.props.account, this.state.account)
        return (
            <section className="orgViewVisual">
                <div className="row">
                    <div className="col-12">
                        <BreadCrumb account={this.props.account} onRefresh={this.onRefresh} resetBreadcrumb={this.resetBreadcrumb} container={this.state.selectedContainer} object={this.state.selectedObject}></BreadCrumb>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <ControlBar resetBreadcrumb={this.resetBreadcrumb} changeView={this.onViewChange} viewMode={this.state.viewMode} selectedContainer={this.state.selectedContainer}></ControlBar>
                    </div>
                </div>
                <div className="row">
                    {this.retrieveCorrectComponent()}
                </div>
            </section>
        );
    }
}

export default Containers;
