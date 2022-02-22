import React from "react";

import Wallet from "../wallet";
import Containers from "../containers";
import Objects from "../objects";

//Actual
// import {getAccountInformation} from "./manager/manager.js";
// import {createContainer, listContainers} from "./manager/containers.js";
// import {listObjects, uploadObject, getObject} from "./manager/objects.js";
// import {retrieveFullFileSystem} from "./manager/interactions";

//Mocker
import {getAccountInformation} from "../../mocker/manager.js";
import {listContainers} from "../../mocker/containers.js";
import {listObjects} from "../../mocker/objects.js";

//import {getAccountInformation} from "../../mocker/manager.js";
//import {createContainer, listContainers} from "../../mocker/containers.js";
//import {listObjects, uploadObject, getObject} from "../../mocker/objects.js";
//import {retrieveFullFileSystem} from "./mocker/interactions";

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
    //containerID Q9dpMA6t7drq8KJB5qa7jQ6JN6GMSGBH3qrxHN7v2TC
    //objectID BWMzu5CGatL4n9idE2K3PTojynfAmoykaiVtKdeDm7iD

    // <button className="atmButtonSimple" onClick={async () => uploadObject("Q9dpMA6t7drq8KJB5qa7jQ6JN6GMSGBH3qrxHN7v2TC")}>Upload a file (remember to set the container ID)</button>
    // <button className="atmButtonSimple" onClick={async () => getObject("87Jr1zaivaL6G13SB1Vowjxp3d9JJLdFTek3fgqTps9y", "Q9dpMA6t7drq8KJB5qa7jQ6JN6GMSGBH3qrxHN7v2TC")}>Download file </button>

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
                            <Objects objects={this.state.objectList} containerID={this.state.selectedContainer}></Objects>
                        </div>
                    </div>
                    {/*
                        <div className="col-12 col-sm-6 col-xl-3">
                            <FileSystem resp={this.state.resp}></FileSystem>
                        </div>
                    */}
                </div>
            </section>
        );
    }
}

export default TabJSON;
