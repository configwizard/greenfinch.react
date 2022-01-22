import './App.css';
import React from "react";
import { Row, Col } from 'react-simple-flex-grid';
import "react-simple-flex-grid/lib/main.css";

import Containers from "./components/containers";
import Objects from "./components/objects";
import FileSystem from "./components/filesystem";
import Wallet from "./components/wallet";

import {getAccountInformation} from "./manager/manager.js"
import {createContainer, listContainers} from "./manager/containers.js"
import {listObjects, uploadObject} from "./manager/objects.js"
import {retrieveFullFileSystem} from "./manager/interactions";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = { resp: [], containerList: [], objectList: [], account: {} };
    }

    async componentDidMount() {
        const resp = await retrieveFullFileSystem()
        this.setState({resp})
        const containerList = await listContainers()
        let objectList = []
        for (let i = 0; i < containerList.length; i++) {
            const o = await listObjects(containerList[i]) //list contents of first container
            console.log("o", o)
            objectList = objectList.concat(o)
        }
        const account = await getAccountInformation()
        await this.setState({containerList, objectList, account})
        console.log("state: ", this.state)
    }

    render() {
        return (

            <div>
                <Row>
                    <Wallet resp={this.state.account}></Wallet>
                    <Containers containers={this.state.containerList}></Containers>
                    <Objects objects={this.state.objectList} containerID={this.state.containerList[0]}></Objects>
                    <FileSystem resp={this.state.resp}></FileSystem>
                    <button onClick={async () => uploadObject(this.state.containerList[0])}>Upload a file (remember to set the container ID)</button>
                    <button onClick={async () => createContainer("my container")}>Create a container</button>
                </Row>
            </div>
        );
    }
}
export default App;
