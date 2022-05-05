import React from 'react';
import { Form } from 'react-bootstrap';

// Components
import HeaderPage from '../../organisms/HeaderPage';
import { useModal } from '../../organisms/Modal/ModalContext';
import CompModalStandard from '../../organisms/Modal/ModalStandard';
// import ViewContainers from '../../organisms/ViewContainers';
import SharedContainerHeaderPage from '../../organisms/HeaderPage/SharedContainerHeaderPage';
// Central style sheet for templates
import '../_settings/style.scss';
import {addSharedContainer, listSharedContainers} from "../../../manager/sharedContainers";
import ViewContainers from "../../organisms/ViewContainers";
import {listObjects} from "../../../manager/objects";
import retrieveCorrectComponent from "../hacked/containerObjectHandler";

class SharedContainers extends React.Component {
    constructor(props) {
        super(props);
        this.state = {contacts: [], containerList: [], objectList: [], selectedObject: null, selectedContainer: null, viewMode: "grid", objectsLoaded: false, requestNewWallet: false};
        // this.state = {sharedContainers: [], viewMode: "grid"};
    }
    async componentDidMount() {
        const containerList = await listSharedContainers()
        console.log("listing shared containers", containerList)
        await this.setState(this.setState({...this.state, containerList}))
    }
    onContainerSelection = async (containerID, containerName, permissions, sharable, createdAt, size) => {
        //we will need to call the function to get the objects for a specific container ID and update the objectList
        const selectedContainer = {
            containerID,
            containerName,
            permissions,
            sharable,
            createdAt,
            size
        }
        console.log("selected shared container.... ", selectedContainer)
        let state = this.state

        this.setState({...state, selectedContainer, objectsLoaded: false})
        // const objectList = await listSharedObjects(containerID)
        // console.log("container selected object list", objectList)
        // this.setState({...state, selectedContainer, objectList, objectsLoaded: true})
    }
    addSharedContainer() {}


    render() {
// const TemplateShared = () => {
//     const { setModal, unSetModal } = useModal()
        return (
            <div class="templatePage d-flex flex-column flex-grow-1">
                <div class="row">
                    <div className="col-12">
                        <SharedContainerHeaderPage
                            pageTitle={"Containers shared with me"}
                            hasButton={true}
                            hasIcon={true}
                            faClass={"fas fa-plus-circle"}
                            buttonText={"Add shared container"}
                        />
                        <div className="row">
                            {retrieveCorrectComponent(this.state, null, null, null, null, this.onContainerSelection, null)}
                        </div>
                        {/*<div class="row">*/}
                        {/*    <div class="col-12">*/}
                        {/*        <div className="templateWrapper">*/}
                        {/*            <div className="templateContainer">*/}

                        {/*                <div class="row">*/}
                        {/*                    <div className="col-3">*/}
                        {/*                        <p>Select a container to open and view contents.</p>*/}
                        {/*                    </div>*/}
                        {/*                    <div className="col-9">*/}
                        {/*                        <div className="orgContainersGrid">*/}
                        {/*                            <div className="row">*/}
                        {/*                                {retrieveCorrectComponent(this.state, null, null, null, null, this.onContainerSelection, null)}*/}
                        {/*                                 /!*<ViewContainers containerList={this.state.sharedContainers} viewMode={this.state.viewMode} onContainerSelection={this.onSharedContainerSelection} ></ViewContainers>*!/*/}
                        {/*                            </div>*/}
                        {/*                        </div>*/}
                        {/*                    </div>*/}
                        {/*                </div>*/}

                        {/*            </div>*/}
                        {/*        </div>*/}
                        {/*    </div>*/}
                        {/*</div>*/}
                    </div>
                </div>
            </div>
        );
    }
}

export default SharedContainers;
