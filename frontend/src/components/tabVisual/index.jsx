import React from "react";

//Mocker
import {getAccountInformation} from "../../mocker/manager.js";
import {createContainer,listContainers} from "../../mocker/containers.js";
import {listObjects} from "../../mocker/objects.js";

class TabVisual extends React.Component {
    constructor(props) {
        super(props);
        this.state = {containerList: [], objectList: [], account: {}, selectedContainer: 0 };
    }
    async componentDidMount() {
        //const resp = await retrieveFullFileSystem()
        const account = await getAccountInformation()
        const containerList = await listContainers()
        await this.setState({account, containerList})
    }
    onSelected = async (selected) => {
        console.dir(selected)
        const objectList = await listObjects(selected.value) //list contents of a container
        await this.setState({objectList: objectList, selectedContainer: selected.value})
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
                            <div className="row">
                                <div className="col-12">
                                    <div className="molContainersHeader d-flex">
                                        <div>
                                            <h2 className="atmContainerTitle">Containers</h2>
                                        </div>
                                        <div className="ms-auto">
                                            <button className="atmButtonIcon active"><i className="fas fa-th-large" /></button>
                                            <button className="atmButtonIcon"><i className="fas fa-list" /></button>
                                            <button className="atmButtonSimple" onClick={async () => createContainer("my container")}><i className="fas fa-archive"/>New container</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <h4 className="atmContainerTitle">Grid</h4>
                                {this.state.containerList.map((item,i) => 
                                    <div className="col-6 col-lg-4 col-xl-2" key={i}>
                                        <button className="molContainersButtonGrid d-flex flex-column align-items-center justify-content-between">
                                            <div className="atmButtonOptions">
                                                <i className="far fa-ellipsis-h"/>
                                            </div>
                                            <i className="fas fa-3x fa-archive"/>
                                            <span className="atmContainerName">{item.name}</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                            <div className="row">
                                <h4 className="atmContainerTitle">Rows</h4>
                                {this.state.containerList.map((item,i) => 
                                    <div className="col-12" key={i}>
                                        <button className="molContainersButtonRow d-flex flex-row align-items-center">
                                            <i className="fas fa-archive"/>
                                            <span className="atmContainerName">{item.name}</span>
                                        </button>
                                    </div>
                                )}
                            </div>
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
