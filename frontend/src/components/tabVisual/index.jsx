import React from "react";
// import FadeProps from 'fade-props';

//Mocker
import {getAccountInformation} from "../../manager/manager.js";
import {listContainers} from "../../manager/containers.js";
import {getObject, listObjects, uploadObject} from "../../manager/objects.js";

//Components
import BreadCrumb from "../layoutBreadCrumb";
import ControlBar from "../viewOptions";
import ContainerView from "../viewContainers";
import ObjectView, {DragAndDrop} from "../viewObjects";
// import {listContainers} from "../../mocker/containers.js";

class TabVisual extends React.Component {
    constructor(props) {
        super(props);
        this.state = {containerList: [], objectList: [], account: {}, selectedObject: null, selectedContainer: null, viewMode: "grid"};
    }
    async componentDidMount() {
        const account = await getAccountInformation()
        this.setState({account})
        window.runtime.EventsOn("appendContainer", async (container) => {
            let containerList = this.state.containerList
            containerList.push(container)
            this.setState({...this.state, containerList})
        })
        window.runtime.EventsOn("appendObject", async (object) => {
            let objectList = this.state.objectList
            objectList.push(object)
            this.setState({...this.state, objectList})
        })

        window.runtime.EventsOn("clearContainer", async () => {
            this.setState(this.setState({...this.state, containerList: []}))
        })
        window.runtime.EventsOn("freshUpload", async () => {
            const objectList = await listObjects(this.state.selectedContainer.containerID) || []//list contents of a container
            this.setState({...this.state, objectList})
        })
        listContainers()
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
        this.setState({...state, selectedContainer})
        const objectList = await listObjects(containerID) || []//list contents of a container
        this.setState({...state, selectedContainer, objectList})
    }
    onObjectSelection = async (objectID, objectName) => {
        if (this.state.selectedContainer == null) {
            throw new Error("cannot retrieve an object from non existent container")
        }
        //we will need to call the function to get the objects for a specific container ID and update the objectList
        const selectedObject = {
            objectID,
            objectName
        }
        console.log('state after selecting object', this.state)
        let state = this.state
        await this.setState({...state, selectedObject})
        await getObject(objectID, state.selectedContainer.containerID)
    }
    onObjectUpload = async () => {
        if (this.state.selectedContainer == null) {
            throw new Error("cannot retrieve an object from non existent container")
        }
        let state = this.state
        await uploadObject(this.state.selectedContainer.containerID)
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
                        {/*<FadeProps animationLength={150}>*/}
                            <ContainerView containerList={this.state.containerList} viewMode={this.state.viewMode} onContainerSelection={this.onContainerSelection}></ContainerView>
                        {/*</FadeProps>*/}
                    </div>
                </div>
            )
        } else {
            return (
                <>
                    <div className="col-12 col-md-9 order-2 order-md-1">
                        <div className="orgContainersGrid">
                            {/*<FadeProps animationLength={150}>*/}
                                <ObjectView objectList={this.state.objectList} viewMode={this.state.viewMode} onObjectSelection={this.onObjectSelection}></ObjectView>
                            {/*</FadeProps>*/}
                        </div>
                    </div>
                    <div className="col-12 col-md-3 col-xl-3 order-1 order-md-2">
                        <DragAndDrop onObjectUpload={this.onObjectUpload} ></DragAndDrop>
                    </div>
                </>
            )
        }
    }

    render() {
        return (
            <section className="orgViewVisual">
                <div className="row">
                    <div className="col-12">
                        <BreadCrumb account={this.state.account} resetBreadcrumb={this.resetBreadcrumb} container={this.state.selectedContainer} object={this.state.selectedObject}></BreadCrumb>
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

export default TabVisual;
