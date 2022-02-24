import './App.css';
import React from "react";

import 'bootstrap/dist/css/bootstrap.min.css'; // Every page will use bootstrap
import 'bootstrap/dist/js/bootstrap.min.js'; // TEMP - fine for V1
import './assets/dashboard.scss'; //structural css
import './assets/greenfinch.scss'; //brand css
// import './assets/fontawesome.css';

import { Tab, Tabs } from 'react-bootstrap';

import TabVisual from "./components/tabVisual";
import TabJSON from "./components/tabJSON";
import Status from "./components/layoutHeader";
import Footer from "./components/layoutFooter";

import CompToast from "./components/compToast";
import CompProgress from "./components/compProgress";

// import Wallet from "./components/wallet";
// import Containers from "./components/containers";
// import Objects from "./components/objects";
// import Status from "./components/status";

// import FileSystem from "./components/filesystem";

//Actual
// import {getAccountInformation} from "./manager/manager.js"
// import {createContainer, listContainers} from "./manager/containers.js"
// import {listObjects, uploadObject, getObject} from "./manager/objects.js"
// import {retrieveFullFileSystem} from "./manager/interactions";

//Mocker
// import {getAccountInformation} from "./mocker/manager.js"
// import {createContainer, listContainers} from "./mocker/containers.js"
// import {listObjects, uploadObject, getObject} from "./mocker/objects.js"
//import {retrieveFullFileSystem} from "./mocker/interactions";

import {getAccountInformation} from "./mocker/manager.js"

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {account: {}};
    }
    async componentDidMount() {
        //const resp = await retrieveFullFileSystem()
        const account = await getAccountInformation()
        this.setState({account})
    }
    fireToast(message) {
        console.log("making toast with ", message)
        window.go.manager.Manager.MakeToast(message)
    }

    render() {
        return (
            <>
                <section className="orgHeaderStatus">
                    <div className="molHeaderContent">
                        <Status resp={this.state.account}></Status>
                    </div>
                </section>
                <div className="container-fluid">
                    <section className="orgMainJSON">
                        <div className="row">
                            <div className="col-12">
                                <section className="orgTabsView flex-grow-1">
                                    <Tabs defaultActiveKey="keyVisual" id="uncontrolled-tab-example">
                                        <Tab eventKey="keyVisual" className="tabViewVisual" title={(
                                            <>
                                                <i className="atmTabIcon fas fa-lg fa-kiwi-bird"/>
                                                <span className="atmTabTitle d-none d-sm-inline-block">Greenfinch</span>
                                            </>
                                        )}>
                                            {/* { this.state.selectedKey == 0 ? <TabPlaceHolder encrypted={false}></TabPlaceHolder> : <DecryptTab kId={this.state.selectedKey}></DecryptTab>} */}
                                            <TabVisual></TabVisual>
                                        </Tab>
                                        <Tab eventKey="keyJSON" className="tabViewJSON" title={(
                                            <>
                                                <i className="atmTabIcon fas fa-lg fa-brackets-curly"/>
                                                <span className="atmTabTitle d-none d-sm-inline-block">JSON</span>
                                            </>
                                        )}>
                                            {/* { this.state.selectedKey == 0 ? <TabPlaceHolder encrypted={true}></TabPlaceHolder> : <EncryptTab kId={this.state.selectedKey}></EncryptTab>} */}
                                            <TabJSON></TabJSON>
                                        </Tab>
                                    </Tabs>
                                </section>
                            </div>
                        </div>
                    </section>
                    <CompToast autoDelete={true} autoDeleteTime={3000}></CompToast>
                </div>
                {/* 
                    <div className="container-fluid">
                        <section className="orgFooterAction">
                            <div className="molFooterContent">
                                <Footer fireToast={this.fireToast}></Footer>
                            </div>
                        </section>
                    </div>
                */}
            </> 
        );
    }
}
export default App;
