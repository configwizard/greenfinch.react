import './App.css';
import React from "react";
import { Row, Col } from 'react-simple-flex-grid';
import "react-simple-flex-grid/lib/main.css";

import Containers from "./components/containers";
import Objects from "./components/objects";
import FileSystem from "./components/filesystem";


import {listContainers} from "./manager/containers.js"
import {listObjects, uploadObject} from "./manager/objects.js"
import {retrieveFullFileSystem} from "./manager/interactions";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = { resp: [], containerList: [], objectList: [] };
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
        await this.setState({containerList, objectList})
        console.log("state: ", this.state)
    }

    render() {
        return (

            <div>
                <Row>
                    <Containers containers={this.state.containerList}></Containers>
                    <Objects objects={this.state.objectList} containerID={this.state.containerList[0]}></Objects>
                    <FileSystem resp={this.state.resp}></FileSystem>
                    <button onClick={() => uploadObject(this.state.containerList[0])}>Upload a file</button>
                </Row>
            </div>
        );
    }
}
export default App;
