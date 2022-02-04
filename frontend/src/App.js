import './App.css';
import React from "react";

import 'bootstrap/dist/css/bootstrap.min.css'; // Every page will use bootstrap
import './assets/dashboard.scss'; //structural css
import './assets/gaspump.scss'; //brand css
// import './assets/fontawesome.css';

import { Tab, Tabs } from 'react-bootstrap';

import Wallet from "./components/wallet";
import Containers from "./components/containers";
import Objects from "./components/objects";
import Status from "./components/status";
import VisualContainer from "./components/visualcontainers"; // Why??
// import FileSystem from "./components/filesystem";

//Actual
// import {getAccountInformation} from "./manager/manager.js"
// import {createContainer, listContainers} from "./manager/containers.js"
// import {listObjects, uploadObject, getObject} from "./manager/objects.js"
// import {retrieveFullFileSystem} from "./manager/interactions";

//Mocker
import {getAccountInformation} from "./mocker/manager.js"
import {createContainer, listContainers} from "./mocker/containers.js"
import {listObjects, uploadObject, getObject} from "./mocker/objects.js"
//import {retrieveFullFileSystem} from "./mocker/interactions";

class App extends React.Component {
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
    //containerID Q9dpMA6t7drq8KJB5qa7jQ6JN6GMSGBH3qrxHN7v2TC
    //objectID BWMzu5CGatL4n9idE2K3PTojynfAmoykaiVtKdeDm7iD

    render() {
        return (
            <div className="container-fluid">
                <section className="orgHeaderStatus d-flex align-items-center">
                    <div className="molHeaderContent">
                        <div className="d-flex">
                            <div className="atmStatus"><span className="utUCSmall d-block">Mode</span> Mocker</div>{/* make this a component */}
                            <div className="atmStatus"><span className="utUCSmall d-block">Net Version</span> Testnet</div>{/* make this a component */}
                            <div className="ms-auto">
                                <button className="atmButtonSimple" onClick={async () => uploadObject("Q9dpMA6t7drq8KJB5qa7jQ6JN6GMSGBH3qrxHN7v2TC")}>Upload a file (remember to set the container ID)</button>
                                <button className="atmButtonSimple" onClick={async () => getObject("87Jr1zaivaL6G13SB1Vowjxp3d9JJLdFTek3fgqTps9y", "Q9dpMA6t7drq8KJB5qa7jQ6JN6GMSGBH3qrxHN7v2TC")}>Download file </button>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="orgMainJSON">
                    <div className="row">
                        <div className="col-12">
                            <section className="orgTabsView flex-grow-1">
                                <Tabs defaultActiveKey="keyVisual" id="uncontrolled-tab-example">
                                    <Tab eventKey="keyJSON" className="tabViewJSON" title={(
                                        <>
                                            <i className="atmTabIcon fas fa-lg fa-brackets-curly"/>
                                            <span className="atmTabTitle d-none d-sm-inline-block">JSON</span>
                                        </>
                                    )}>
                                        {/* { this.state.selectedKey == 0 ? <TabPlaceHolder encrypted={true}></TabPlaceHolder> : <EncryptTab kId={this.state.selectedKey}></EncryptTab>} */}
                                        <section className="orgViewJSON">
                                            <div className="row">
                                                <div className="col-12 col-sm-12 col-xl-4">
                                                    <Wallet resp={this.state.account}></Wallet>
                                                </div>
                                                <div className="col-12 col-sm-12 col-xl-4">
                                                    <Containers onSelected={this.onSelected} containers={this.state.containerList}></Containers>
                                                </div>
                                                <div className="col-12 col-sm-12 col-xl-4">
                                                    <Objects objects={this.state.objectList} containerID={this.selectedContainer}></Objects>
                                                </div>
                                                {/*
                                                    <div className="col-12 col-sm-6 col-xl-3">
                                                        <FileSystem resp={this.state.resp}></FileSystem>
                                                    </div>
                                                */}
                                            </div>
                                        </section>
                                    </Tab>
                                    <Tab eventKey="keyVisual" className="tabViewVisual" title={(
                                        <>
                                            <i className="atmTabIcon fas fa-lg fa-palette"/>
                                            <span className="atmTabTitle d-none d-sm-inline-block">Visual</span>
                                        </>
                                    )}>
                                        {/* { this.state.selectedKey == 0 ? <TabPlaceHolder encrypted={false}></TabPlaceHolder> : <DecryptTab kId={this.state.selectedKey}></DecryptTab>} */}
                                        <section className="orgViewVisual">

                                            <div className="row">
                                                <div className="col-12">
                                                    {/* Design aesthetic (to swap with JSON) */}
                                                    <Status resp={this.state.account}></Status>
                                                </div>
                                            </div>
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
                                                                        <button className="atmButtonIcon active"><i class="fas fa-th-large" /></button>
                                                                        <button className="atmButtonIcon"><i className="fas fa-list" /></button>
                                                                        <button className="atmButtonSimple" onClick={async () => createContainer("my container")}><i className="fas fa-archive"/>New container</button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="row">
                                                            <h4 className="atmContainerTitle">Grid _</h4>
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
                                                            <h4 className="atmContainerTitle">Rows _</h4>
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
                                    </Tab>
                                </Tabs>
                            </section>
                        </div>
                    </div>
                </section>

                <section className="orgFooterAction">
                    <div className="row">
                        <div className="col">
                           •••
                        </div>        
                    </div>
                </section>
            </div>        
        );
    }
}
export default App;
