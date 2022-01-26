import './App.css';
import React from "react";
import { Row, Col } from 'react-simple-flex-grid';
import "react-simple-flex-grid/lib/main.css";

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

    // for dev purposes - print out the wallet ID so you know which one you are working with. 
    // Almost status line - quick view then JSON. What are the problems you have faced in the dev?

    //containerID Q9dpMA6t7drq8KJB5qa7jQ6JN6GMSGBH3qrxHN7v2TC
    //objectID BWMzu5CGatL4n9idE2K3PTojynfAmoykaiVtKdeDm7iD
    render() {
        return (

            <div>
                
                <Row>
                    <Wallet resp={this.state.account}></Wallet>
                    <Containers onSelected={this.onSelected} containers={this.state.containerList}></Containers>
                    <Objects objects={this.state.objectList} containerID={this.selectedContainer}></Objects>
                    <FileSystem resp={this.state.resp}></FileSystem>
                    <button onClick={async () => uploadObject("Q9dpMA6t7drq8KJB5qa7jQ6JN6GMSGBH3qrxHN7v2TC")}>Upload a file (remember to set the container ID)</button>
                    <button onClick={async () => getObject("87Jr1zaivaL6G13SB1Vowjxp3d9JJLdFTek3fgqTps9y", "Q9dpMA6t7drq8KJB5qa7jQ6JN6GMSGBH3qrxHN7v2TC")}>Download file </button>
                    <button onClick={async () => createContainer("my container")}>Create a container</button>
                </Row>
            </div>
        );
    }
}
export default App;
