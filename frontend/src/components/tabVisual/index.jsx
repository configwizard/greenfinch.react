import React from "react";

//Mocker
import {getAccountInformation} from "../../mocker/manager.js";
import {listContainers} from "../../mocker/containers.js";
import {listObjects} from "../../mocker/objects.js";

//Components
import BreadCrumb from "../layoutBreadCrumb";
import ControlBar from "../layoutControlBar";
import ContainerView from "../viewContainer";
import ObjectView from "../viewObject";

class TabVisual extends React.Component {
    constructor(props) {
        super(props);
        this.state = {containerList: [], objectList: [], account: {}, selectedContainer: null, viewMode: "grid"};
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
    onContainerSelection = async (containerID) => {
        //we will need to call the function to get the objects for a specific container ID and update the objectList
        const objectList = await listObjects(containerID) //list contents of a container
            let state = this.state
            this.setState({...state, selectedContainer: containerID, objectList})
    }
    onObjectSelection = async (objectID) => {
        //we will need to call the function to get the objects for a specific container ID and update the objectList
        alert("You selected this object: " + objectID)
    }
    retriveCorrectComponent() {
        if (this.state.selectedContainer == null) {
            return (
                <ContainerView containerList={this.state.containerList} viewMode={this.state.viewMode} onContainerSelection={this.onContainerSelection}></ContainerView>
            )
        } else {
            return (
                <ObjectView objectList={this.state.objectList} viewMode={this.state.viewMode} onObjectSelection={this.onObjectSelection}></ObjectView>
            )
        }
    }
    retriveUploadFunction() {
        if (this.state.selectedContainer == null) {
            return (
                <div>Nope.</div>
            )
        } else {
            return (
                // TODO 01: Turn this into a component
                <div className="molBlockUpload d-flex align-items-center justify-content-center">
                    <div className="atmBlockUpload d-flex flex-column align-items-center justify-content-center">
                        <i className="fas fa-4x fa-upload"/>
                        {/* Add input here for file upload */}
                        <p><button type="button" className="atmButtonText" title="Choose a file">Choose a file</button> or drag it here</p>
                        {/* drag and drop upload componet (look for onEvent, onUpload... and console.log 'event' and can find a path) */}
                        {/* https://stackoverflow.com/questions/58880171/get-file-path-from-drop-event/64616487#64616487 */}
                    </div>
                </div>
            )
        }
    }
    // TODO 02: anther function here to determine the title... if selected container... show component X, if not component y... and stuff that in the control bar. Like the above 'retrieve'
    // TODO 03: Drawer
    render() {
        return (
            <section className="orgViewVisual">
                <div className="row">
                    <div className="col-12">
                        <BreadCrumb></BreadCrumb>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 col-md-6 col-xl-9 order-2 order-md-1">
                        <div className="orgContainersGrid">
                            <ControlBar changeView={this.onViewChange}></ControlBar>
                            {this.retriveCorrectComponent(this.state)}
                        </div>
                    </div>
                    <div className="col-12 col-md-6 col-xl-3 order-1 order-md-2">
                        {this.retriveUploadFunction(this.state)}
                    </div>
                </div>
            </section>
        );
    }
}

export default TabVisual;
