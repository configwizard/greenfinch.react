import React from "react";

//Mocker/Manager
import {getAccountInformation} from "../../manager/manager.js";
import {deleteContainer, listContainers} from "../../manager/containers.js";
import {getObject, listObjects, uploadObject} from "../../manager/objects.js";
import {useModal} from "../compModals/compModalContext";
// import CompModalBrand from "../compModals/compModalBrand";
import NewWalletModal from "../compModals/compModalNewWallet"
import {newWallet, loadWallet} from "../../manager/manager"
//Components
import BreadCrumb from "../layoutBreadCrumb";
import ControlBar from "../viewOptions";
import ContainerView from "../viewContainers";
import ObjectView, {FileUpload} from "../viewObjects";
import CompModalBrand from "../compModals/compModalBrand";
// import {listContainers} from "../../mocker/containers.js";

class TabVisual extends React.Component {
    constructor(props) {
        super(props);
        this.state = {containerList: [], objectList: [], account: null, selectedObject: null, selectedContainer: null, viewMode: "grid", objectsLoaded: false, requestNewWallet: false};
    }
    async componentDidMount() {

        window.runtime.EventsOn("appendContainer", async (container) => {
            let containerList = this.state.containerList
            console.log("new container added", container)
            containerList.push(container)
            await this.setState({...this.state, containerList})
        })
        window.runtime.EventsOn("appendObject", async (object) => {
            let objectList = this.state.objectList
            objectList.push(object)
            await this.setState({...this.state, objectList})
        })

        window.runtime.EventsOn("clearContainer", async () => {
            await this.setState(this.setState({...this.state, containerList: []}))
        })
        window.runtime.EventsOn("freshUpload", async (value) => {
            console.log("fresh objects made", value)
            const objectList = await listObjects(this.state.selectedContainer.containerID) || []//list contents of a container
            await this.setState({...this.state, objectList})
        })
        // const [chooseWallet, setChooseWallet] = useState(false)
        window.runtime.EventsOn("select_wallet", async (title) => {
            // if (this.state.requestNewWallet) {
            //     return
            // }
            //open new wallet window
            console.log("requesting wallet select ", title)
            try {
                console.log("setting modal")
                await this.setState({...this.state, requestNewWallet: true})
            } catch (e) {
                console.log("error setting modal ", e)
            }
        })
        window.runtime.EventsOn("fresh-wallet", async (title) => {
            await this.onFreshWallet()
        })
        try {
            const account = await getAccountInformation()
            console.log("account", account)
            if (account) {
                console.log("fresh wallet")
                await this.props.setStatusAccount(account)
                await this.setState({...this.state, account, requestNewWallet: false})
                await listContainers()


                // await this.onFreshWallet()
            }
            await listContainers()
        } catch(e) {
            console.log(e)
        }
    }

    onFreshWallet = async() => {
        console.log("fresh wallet")
        await this.setState({... this.state, requestNewWallet: false})
        await listContainers()
        const account = await getAccountInformation()
        this.setState({account})
    }
    onSelected = async (selected) => {
        console.dir(selected)
    }
    onViewChange = async (viewMode) => {
        let state = this.state
        this.setState({...state, viewMode: viewMode})
    }
    onContainerSelection = async (containerID, containerName) => {
        //we will need to call the function to get the objects for a specific container ID and update the objectList
        const selectedContainer = {
            containerID,
            containerName
        }
        let state = this.state

        this.setState({...state, selectedContainer, objectsLoaded: false})
        const objectList = await listObjects(containerID) || []//list contents of a container
        this.setState({...state, selectedContainer, objectList, objectsLoaded: true})
    }
    onObjectSelection = async (objectID, objectName) => {
        if (this.state.selectedContainer == null) {
            throw new Error("cannot retrieve an object from non existent container")
        }
        console.log("selected", objectID, objectName)
        //we will need to call the function to get the objects for a specific container ID and update the objectList
        const selectedObject = {
            objectID,
            objectName
        }
        let state = this.state
        this.setState({...state, selectedObject})
        await getObject(objectName, objectID, this.state.selectedContainer.containerID)
        console.log('state after selecting object', this.state)
    }
    onObjectUpload = async () => {
        if (this.state.selectedContainer == null) {
            throw new Error("cannot retrieve an object from non existent container")
        }
        let state = this.state
        await uploadObject(this.state.selectedContainer.containerID)
    }
    onContainerDelete = async (containerId) => {
        let response = await deleteContainer(containerId)
        console.log("deleting container ", containerId, response)
    }
    resetBreadcrumb = async () => {
        let state = this.state
        await this.setState({...state, objectList: [], selectedObject: null, selectedContainer: null})
    }
    retrieveCorrectComponent() {
        if (this.state.selectedContainer == null) {
            return (
                <div className="col-12">
                    <div className="orgContainersGrid">
                        <div className="row">
                                <ContainerView containerList={this.state.containerList} onDelete={this.onContainerDelete} viewMode={this.state.viewMode} onContainerSelection={this.onContainerSelection}></ContainerView>
                        </div>
                    </div>
                </div>
            )
        } else {
            return (
                <>
                    <div className="col-12">
                        <FileUpload onObjectUpload={this.onObjectUpload}></FileUpload>
                    </div>
                    <div className="col-12">
                        <div className="orgContainersGrid">
                            <div className="row">
                                    <ObjectView objectsLoaded={this.state.objectsLoaded} objectList={this.state.objectList} viewMode={this.state.viewMode} onObjectSelection={this.onObjectSelection}></ObjectView>
                            </div>
                        </div>
                    </div>
                </>
            )
        }
    }
    render() {
        if (this.state.requestNewWallet) {
            return (<div className="col-12">
                <div className="orgContainersGrid">
                    <div className="row">
                        <CompModalBrand
                            title={"Get started"}>
                            <div className="d-flex flex-column align-items-center">
                                <p>Welcome to Greenfinch, to get started you will need a wallet.</p>
                                <button
                                    type="button"
                                    className="atmButtonSimple"
                                    onClick={async () => {await newWallet("password")}}>
                                    <i className="fas fa-star-shooting"/>Create new wallet
                                </button>
                                <button
                                    type="button"
                                    className="atmButtonText"
                                    onClick={async () => {await loadWallet("password")}}>
                                    <i className="fas fa-upload"/>Load existing wallet
                                </button>
                            </div>
                        </CompModalBrand>
                        {/*<NewWalletModal requestNewWallet={this.state.requestNewWallet} containerList={this.state.containerList} onDelete={this.onContainerDelete} viewMode={this.state.viewMode} onContainerSelection={this.onContainerSelection}></NewWalletModal>*/}
                    </div>
                </div>
            </div>)
        }
        return (
            <section className="orgViewVisual">
                <div className="row">
                    <div className="col-12">
                        <BreadCrumb requestNewWallet={this.state.requestNewWallet} account={this.state.account} resetBreadcrumb={this.resetBreadcrumb} container={this.state.selectedContainer} object={this.state.selectedObject}></BreadCrumb>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <ControlBar resetBreadcrumb={this.resetBreadcrumb} changeView={this.onViewChange} viewMode={this.state.viewMode} selectedContainer={this.state.selectedContainer}></ControlBar>
                    </div>
                </div>
                <div className="row">
                    {this.retrieveCorrectComponent()}
                </div>
            </section>
        );
    }
}

export default TabVisual;
