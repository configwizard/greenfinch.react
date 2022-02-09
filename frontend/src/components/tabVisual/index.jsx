import React from "react";

//Mocker
import {getAccountInformation} from "../../mocker/manager.js";
import {listContainers} from "../../mocker/containers.js";
import {listObjects} from "../../mocker/objects.js";
import ControlBar from "../controlbar/index";
import ContainerView from "../containerview/index"
import ObjectView from "../objectview/index"

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
       //we will need to call the function to get the objects for a speicifc container ID and update the objectList
       const objectList = await listObjects(containerID) //list contents of a container
        let state = this.state
        this.setState({...state, selectedContainer: containerID, objectList})
   }
   onObjectSelection = async (objectID) => {
    //we will need to call the function to get the objects for a speicifc container ID and update the objectList
        alert("you selected object" + objectID)
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
    render() {
        return (
            <section className="orgViewVisual">
                <div className="row">

                    <div className="col-12">
                        <div className="molBlockBread">
                            {/* TODO: This is manually added for now*/}
                            <span className="atmBreadWallet"><i className="fas fa-lg fa-wallet"/>NQtxsStXxadvtRyz2B1yJXTXCeEoxsUJBkxW</span><span>Containers&nbsp;&nbsp;<i className="fas fa-caret-right"/>&nbsp;&nbsp;_</span>{/* breadcrumb horizontal */}
                        </div>
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
                        <div className="molBlockUpload d-flex align-items-center justify-content-center">
                            <div className="atmBlockUpload d-flex flex-column align-items-center justify-content-center">
                                <i className="fas fa-4x fa-upload"/>
                                {/* Add input here for file upload */}
                                <p><button className="atmButtonText" title="Choose a file">Choose a file</button> or drag it here</p>
                                {/* drag and drop upload componet (look for onEvent, onUpload... and console.log 'event' and can find a path) */}
                                {/* https://stackoverflow.com/questions/58880171/get-file-path-from-drop-event/64616487#64616487 */}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}


export default TabVisual;
