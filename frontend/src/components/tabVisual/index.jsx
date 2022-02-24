import React from "react";
import FadeProps from 'fade-props';
//Mocker
import {getAccountInformation} from "../../mocker/manager.js";
import {listContainers} from "../../mocker/containers.js";
import {listObjects} from "../../mocker/objects.js";

//Components
import BreadCrumb from "../layoutBreadCrumb";
import ControlBar from "../viewOptions";
import ContainerView from "../viewContainers";
import ObjectView, {DragAndDrop} from "../viewObjects";

class TabVisual extends React.Component {
    constructor(props) {
        super(props);
        this.state = {containerList: [], objectList: [], account: {}, selectedObject: null, selectedContainer: null, viewMode: "grid"};
    }
    async componentDidMount() {
        //const resp = await retrieveFullFileSystem()
        const account = await getAccountInformation()
        const containerList = await listContainers()
        this.setState({account, containerList})
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
        const objectList = await listObjects(containerID) //list contents of a container
            let state = this.state
            this.setState({...state, selectedContainer: containerName, objectList})
    }
    onObjectSelection = async (objectID, objectName) => {
        //we will need to call the function to get the objects for a specific container ID and update the objectList
        console.log('state after selecting object', this.state)
        let state = this.state
        await this.setState({...state, selectedObject: objectName, })
    }
    resetBreadcrumb = async () => {
        console.log('resetting bread')
        let state = this.state
        await this.setState({...state, selectedObject: null, selectedContainer: null})
    }
    retrieveCorrectComponent() {
        if (this.state.selectedContainer == null) {
            return (
                <div className="col-12">
                    <div className="orgContainersGrid">
                        <FadeProps animationLength={150}>
                            <ContainerView containerList={this.state.containerList} viewMode={this.state.viewMode} onContainerSelection={this.onContainerSelection}></ContainerView>
                        </FadeProps>
                    </div>
                </div>
            )
        } else {
            return (
                <>
                    <div className="col-12 col-md-9 order-2 order-md-1">
                        <div className="orgContainersGrid">
                            <FadeProps animationLength={150}>
                                <ObjectView objectList={this.state.objectList} viewMode={this.state.viewMode} onObjectSelection={this.onObjectSelection}></ObjectView>
                            </FadeProps>
                        </div>
                    </div>
                    <div className="col-12 col-md-3 col-xl-3 order-1 order-md-2">
                        <DragAndDrop></DragAndDrop>
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
                        <BreadCrumb resetBreadcrumb={this.resetBreadcrumb} container={this.state.selectedContainer} object={this.state.selectedObject}></BreadCrumb>
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
