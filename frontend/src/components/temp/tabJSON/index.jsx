import React from "react";

import Wallet from "../wallet";
import Containers from "../containers";
import Objects from "../objects";

// Actual
import { getAccountInformation } from "../../manager/manager.js";
import { listContainers } from "../../manager/containers.js";
import { listObjects } from "../../manager/objects.js";
import { searchObjects } from "../../manager/interactions.js"

// Mocker
// import { getAccountInformation } from "../../mocker/manager.js";
// import { listContainers } from "../../mocker/containers.js";
// import { listObjects } from "../../mocker/objects.js";
// import { searchObjects } from "../../mocker/interactions.js"

class TabJSON extends React.Component {
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
            <section className="orgViewJSON">
                <div className="row">
                    <div className="col-12 col-sm-12 col-xl-4">
                        <div className="molViewJSON">
                            <Wallet resp={this.state.account}></Wallet>
                        </div>
                    </div>
                    <div className="col-12 col-sm-12 col-xl-4">
                        <div className="molViewJSON">
                            <Containers onSelected={this.onSelected} containers={this.state.containerList}></Containers>
                        </div>
                    </div>
                    <div className="col-12 col-sm-12 col-xl-4">
                        <div className="molViewJSON">
                            <Objects objects={this.state.objectList} containerID={this.selectedContainer}></Objects>
                        </div>
                    </div>
                        <div className="col-12 col-sm-6 col-xl-3">
                            <button onClick={searchObjects("cat")}></button>
                        </div>
                </div>
            </section>
        );
    }
}

export default TabJSON;
