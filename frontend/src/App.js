import './App.css';
import React from "react";

import 'bootstrap/dist/css/bootstrap.min.css'; // Every page will use bootstrap
import './assets/dashboard.scss'; //structural css
import './assets/gaspump.scss'; //brand css
// import './assets/fontawesome.css';

import { Tab, Tabs } from 'react-bootstrap';

import Containers from "./components/containers";
import Objects from "./components/objects";
import FileSystem from "./components/filesystem";
import Wallet from "./components/wallet";

//Actual
// import {getAccountInformation} from "./manager/manager.js"
// import {createContainer, listContainers} from "./manager/containers.js"
// import {listObjects, uploadObject, getObject} from "./manager/objects.js"
// import {retrieveFullFileSystem} from "./manager/interactions";

//Mocker
import {getAccountInformation} from "./mocker/manager.js"
import {createContainer, listContainers} from "./mocker/containers.js"
import {listObjects, uploadObject, getObject} from "./mocker/objects.js"
import {retrieveFullFileSystem} from "./mocker/interactions";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = { resp: [], containerList: [], objectList: [], account: {}, selectedContainer: 0 };
    }
    async componentDidMount() {
        const resp = await retrieveFullFileSystem()
        const account = await getAccountInformation()
        const containerList = await listContainers()
        await this.setState({resp, account, containerList})
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
                <section class="orgHeaderStatus d-flex align-items-center">
                    <div className="molHeaderContent">
                        <div className="d-flex">
                            <div className="atmStatus"><span className="utUCSmall d-block">Mode</span> Mocker</div>
                            <div className="atmStatus"><span className="utUCSmall d-block">Net Version</span> Testnet</div>
                            <div className="ms-auto">
                                <button className="atmButtonSimple" onClick={async () => uploadObject("Q9dpMA6t7drq8KJB5qa7jQ6JN6GMSGBH3qrxHN7v2TC")}>Upload a file (remember to set the container ID)</button>
                                <button className="atmButtonSimple" onClick={async () => getObject("87Jr1zaivaL6G13SB1Vowjxp3d9JJLdFTek3fgqTps9y", "Q9dpMA6t7drq8KJB5qa7jQ6JN6GMSGBH3qrxHN7v2TC")}>Download file </button>
                                <button className="atmButtonSimple" onClick={async () => createContainer("my container")}>Create a container</button>
                            </div>
                        </div>
                    </div>
                </section>

                <section class="orgMainJSON">
                    {/* Tab system could be a short-term solution to two views */}

                    <div className="row">
                        <div className="col-12">
                            <section className="orgTabsView flex-grow-1">
                                <Tabs defaultActiveKey="keyJSON" id="uncontrolled-tab-example">
                                    <Tab eventKey="keyJSON" className="tabViewJSON" title={(
                                        <>
                                            <i className="atmTabIcon fad fa-lg fa-lock-alt"/>
                                            <span className="atmTabTitle d-none d-sm-inline-block">JSON</span>
                                        </>
                                    )}>
                                        {/* { this.state.selectedKey == 0 ? <TabPlaceHolder encrypted={true}></TabPlaceHolder> : <EncryptTab kId={this.state.selectedKey}></EncryptTab>} */}
                                        <section className="orgViewJSON">
                                            <div className="row">
                                                <div className="col-12 col-sm-6 col-xl-3">
                                                    <Wallet resp={this.state.account}></Wallet>
                                                </div>
                                                <div className="col-12 col-sm-6 col-xl-3">
                                                    <Containers onSelected={this.onSelected} containers={this.state.containerList}></Containers>
                                                </div>
                                                <div className="col-12 col-sm-6 col-xl-3">
                                                    <Objects objects={this.state.objectList} containerID={this.selectedContainer}></Objects>
                                                </div>
                                                <div className="col-12 col-sm-6 col-xl-3">
                                                    <FileSystem resp={this.state.resp}></FileSystem>
                                                </div>
                                            </div>
                                        </section>
                                    </Tab>
                                    <Tab eventKey="keyVisual" className="tabViewVisual" title={(
                                        <>
                                            <i className="atmTabIcon fad fa-lg fa-lock-open-alt"/>
                                            <span className="atmTabTitle d-none d-sm-inline-block">Visual</span>
                                        </>
                                    )}>
                                        {/* { this.state.selectedKey == 0 ? <TabPlaceHolder encrypted={false}></TabPlaceHolder> : <DecryptTab kId={this.state.selectedKey}></DecryptTab>} */}
                                        <section className="orgViewVisual">
                                            <div>Design aesthetic here. Visual first once more developed.</div>
                                        </section>
                                    </Tab>
                                </Tabs>
                            </section>
                        </div>
                    </div>
                </section>

                <section class="orgFooterAction">
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
