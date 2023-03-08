import React from 'react';

import { removeSharedContainer, listSharedContainers } from '../../../manager/sharedContainers';
import { getObject} from '../../../manager/objects';
import { listSharedContainerObjects } from '../../../manager/sharedContainers';

// Components
import NoContent from '../../atoms/NoContent';
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
        // await getObject(objectName, objectID, this.state.selectedContainer.containerID)
        console.log('state after selecting object', this.state)
    }
    onObjectDownload = async() => {
        if (this.state.selectedObject == null) {
            return
        }
        await getObject(this.state.selectedObject.objectName, this.state.selectedObject.objectID, this.state.selectedContainer.containerID)
    }
    onContainerDelete = async (containerId) => {
        let containers = await removeSharedContainer(containerId)
        console.log("removing shared container container ", containerId)
        await this.setState(this.setState({...this.state, containerList: containers}))
    }
    render() {
        return (
            <div className="templatePage d-flex flex-column flex-grow-1">
                <div className="row">
                    <div className="col-12">
                        <SharedContainerHeaderPage
                            pageTitle={"Containers shared with me"}
                            hasButton={true}
                            buttonText={"Add shared container"}
                        />
                        <div className="row">
                            <div className="col-12">
                                {this.state.containerList.length > 0 ? 
                                    <>
                                        {filterContent(this.state, this.onObjectSelection, null, this.onObjectDownload, null, this.onSharedContainerSelection, this.onContainerDelete)}
                                    </>
                                    : <NoContent
                                        text={"When someone shares a container with you, add it here"}
                                        addAction={false}
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
