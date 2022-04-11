import React from 'react';

// Actual
import { deleteContainer, listContainers} from '../../../manager/containers.js';
import { deleteObject, getObject, listObjects, uploadObject } from '../../../manager/objects.js';

// Mocker
// import { deleteContainer, listContainers} from '../../../mocker/containers.js';
// import { deleteObject, getObject, listObjects, uploadObject } from '../../../mocker/objects.js';

// Components
import ControlBar from '../../molecules/ControlBar';
import BreadCrumb from '../../organisms/HeaderArtboard';
import ContainerView from '../../organisms/ViewContainers';
import ObjectView, { FileUpload } from '../../organisms/ViewObjects';

import './style.scss';

class Artboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {containerList: [], objectList: [], selectedObject: null, selectedContainer: null, viewMode: "grid", objectsLoaded: false, requestNewWallet: false};
    }
    async componentDidMount() {

        // const account = await getAccountInformation()
        // // console.log("now have wallet ", this.props.account)
        // await this.props.setStatusAccount(account)
        // // await this.setState({...this.state, account})


        window.runtime.EventsOn("appendContainer", async (container) => {
            let containerList = this.state.containerList
            console.log("new container added", container)
            containerList.push(container)
            await this.setState({...this.state, containerList})
        })
        window.runtime.EventsOn("appendObject", async (object) => {
            let objectList = this.state.objectList
            objectList.push(object)
            await this.setState({...this.state, objectList})
        })
        window.runtime.EventsOn("clearContainer", async () => {
            await this.setState(this.setState({...this.state, containerList: []}))
        })
        window.runtime.EventsOn("freshUpload", async (value) => {
            console.log("fresh objects made", value)
            const objectList = await listObjects(this.state.selectedContainer.containerID) || []//list contents of a container
            await this.setState({...this.state, objectList})
        })

        console.log("received wallet", this.props.account)
        await listContainers()
        console.log("componentDidMount, objects", this.state.objectList)
    }
    onRefresh = async() => {
        await this.props.refreshAccount()
        console.log("onRefresh, objects", this.state.objectList)
        //Refresh button (dev) -- uncomment this following line if you want to really refresh the app.
        window.location.reload(false); //disable this
        await this.setState(this.setState({...this.state, containerList: [], objectList: []}))
        await listContainers()
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
    onContainerSelection = async (containerID, containerName) => {
        //we will need to call the function to get the objects for a specific container ID and update the objectList
        const selectedContainer = {
            containerID,
            containerName
        }
        let state = this.state

        this.setState({...state, selectedContainer, objectsLoaded: false})
        const objectList = await listObjects(containerID) || []//list contents of a container
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

        await listContainers()
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
                <div className="col-12">
                    <div className="orgContainersGrid">
                        <div className="row">
                            <ContainerView containerList={this.state.containerList} onDelete={this.onContainerDelete} viewMode={this.state.viewMode} onContainerSelection={this.onContainerSelection}></ContainerView>
                        </div>
                    </div>
                </div>
            )
        } else {
            return (
                <>
                    <div className="col-12">
                        <FileUpload onObjectUpload={this.onObjectUpload}></FileUpload>
                    </div>
                    <div className="col-12">
                        <div className="orgContainersGrid">
                            <div className="row">
                                <ObjectView objectsLoaded={this.state.objectsLoaded} onDelete={this.onObjectDelete} objectList={this.state.objectList} viewMode={this.state.viewMode} onObjectSelection={this.onObjectSelection}></ObjectView>
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

export default Artboard;
