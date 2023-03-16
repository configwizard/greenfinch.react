import React from 'react';

import { removeSharedContainer, listSharedContainers } from '../../../manager/sharedContainers';
import { getObject} from '../../../manager/objects';
import { listSharedContainerObjects } from '../../../manager/sharedContainers';

// Components
import NoContent from '../../atoms/NoContent';
import ControlBar from '../../molecules/ControlBar';
import BreadCrumb from '../../organisms/Breadcrumb';
import SharedContainerHeaderPage from '../../organisms/HeaderPage/SharedContainerHeaderPage';
import filterContent from "../Containers/FilterContent";

// Central style sheet for templates
import '../_settings/style.scss';

class SharedContainers extends React.Component {
    constructor(props) {
        super(props);
        this.state = {shared: true, contacts: [], containerList: [], objectList: [], selectedObject: null, selectedContainer: null, viewMode: "grid", objectsLoaded: false, requestNewWallet: false};
        // this.state = {sharedContainers: [], viewMode: "grid"};
    }
    async componentDidMount() {
        const containerList = await listSharedContainers()
        console.log("listing shared containers", containerList)
        await this.setState(this.setState({...this.state, containerList}))
    }
    onViewChange = async (viewMode) => {
        let state = this.state
        this.setState({...state, viewMode: viewMode})
    }
    onSharedContainerSelection = async (containerID, containerName, permissions, sharable, createdAt, size) => {
        //we will need to call the function to get the objects for a specific container ID and update the objectList
        const selectedContainer = {
            containerID,
            containerName,
            permissions,
            sharable,
            createdAt,
            size
        }
        console.log("selected container.... ", selectedContainer)
        let state = this.state

        this.setState({...state, selectedContainer, objectsLoaded: false})
        const objectList = await listSharedContainerObjects(containerID)
        console.log("container selected object list", objectList)
        this.setState({...state, selectedContainer, objectList, objectsLoaded: true})
    }
    onObjectSelection = async (objectID, objectName, objectFile, size, uploadedAt) => {
        if (this.state.selectedContainer == null) {
            throw new Error("cannot retrieve an object from non existent container")
        }
        console.log("selected", objectID, objectName, uploadedAt)
        //we will need to call the function to get the objects for a specific container ID and update the objectList
        const selectedObject = {
            objectID,
            objectName,
            objectFile,
            size,
            uploadedAt
        }
        let state = this.state
        this.setState({...state, selectedObject})
        // await getObject(objectName, objectID, this.state.selectedContainer.containerID)
        console.log('state after selecting object', this.state)
    }
    onObjectDownloadByItem = async(name, id) => {
        if (this.state.selectedContainer == null) {
            return
        }
        await getObject(name, id, this.state.selectedContainer.containerID)
    }
    // onObjectDownload = async() => {
    //     if (this.state.selectedObject == null) {
    //         return
    //     }
    //     await getObject(this.state.selectedObject.objectName, this.state.selectedObject.objectID, this.state.selectedContainer.containerID)
    // }
    onContainerDelete = async (containerId) => {
        let containers = await removeSharedContainer(containerId)
        console.log("removing shared container container ", containerId)
        await this.setState(this.setState({...this.state, containerList: containers}))
    }
    resetBreadcrumb = async () => {
        let state = this.state
        await this.setState({...state, objectList: [], selectedObject: null, selectedContainer: null})
    }
    render() {
        return (
            <div className="templatePage d-flex flex-column flex-grow-1">
                <div className="row">
                    <div className="col-12">
                        <SharedContainerHeaderPage
                            pageTitle={"Containers shared with me"}
                            hasButton={true}
                            isButtonDisabled={false}
                            faClass={"fa-sharp fa-solid fa-circle-plus"}
                            buttonText={"Add shared container"}
                        />
                        <div className="row">
                            <div className="col-12">
                                {this.state.containerList.length > 0 ? 
                                    <>
                                        <div className="containerOptions">
                                            <div className="row">
                                                <div className="col-8">
                                                    <BreadCrumb account={this.props.account} onRefresh={this.onRefresh} resetBreadcrumb={this.resetBreadcrumb} container={this.state.selectedContainer} object={this.state.selectedObject}></BreadCrumb>
                                                </div>
                                                <div className="col-4">
                                                    <ControlBar resetBreadcrumb={this.resetBreadcrumb} changeView={this.onViewChange} viewMode={this.state.viewMode} selectedContainer={this.state.selectedContainer}></ControlBar>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            {filterContent(this.state, this.onObjectSelection, null, this.onObjectDownloadByItem, null, this.onSharedContainerSelection, this.onContainerDelete)}
                                        </div>
                                    </>
                                    : <NoContent
                                        text={"You currently have no shared container."}
                                        textAction={"Add your shared containers here"}
                                        addAction={true}
                                        isPageLink={false}
                                    />
                                }
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        );
    }
}

export default SharedContainers;
