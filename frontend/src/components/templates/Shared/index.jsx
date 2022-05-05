import React from 'react';
import { Form } from 'react-bootstrap';

// Components
import HeaderPage from '../../organisms/HeaderPage';
import { useModal } from '../../organisms/Modal/ModalContext';
import CompModalStandard from '../../organisms/Modal/ModalStandard';
// import ViewContainers from '../../organisms/ViewContainers';

// Central style sheet for templates
import '../_settings/style.scss';
import {addSharedContainer, listSharedContainers} from "../../../manager/sharedContainers";

class SharedContainers extends React.Component {
    constructor(props) {
        super(props);
        this.state = {sharedContainers: []};
    }
    async componentDidMount() {
        const sharedContainers = await listSharedContainers()
        console.log("listing shared containers", sharedContainers)
        await this.setState(this.setState({...this.state, sharedContainers}))
    }

    render() {
// const TemplateShared = () => {
//     const { setModal, unSetModal } = useModal()
        return (
            <div class="templatePage d-flex flex-column flex-grow-1">
                <div class="row">
                    <div className="col-12">
                        <HeaderPage
                            pageTitle={"Shared Containers"}
                            hasButton={true}
                            hasIcon={true}
                            faClass={"fas fa-plus-circle"}
                            buttonText={"Add shared container"}
                            // buttonAction={() => {
                            //     setModal(
                            //         <CompModalStandard
                            //             title={"Add shared container"}
                            //             buttonTextPrimary={"Add container"}
                            //             buttonTextSecondary={"Cancel"}
                            //             primaryClicked={async () => {
                            //                 const containerID = document.getElementById("sharedContainerID").value
                            //                 console.log("adding container ", containerID)
                            //                 await addSharedContainer(containerID)
                            //             }}
                            //             secondaryClicked={async () => unSetModal()}>
                            //             <Form.Group className="form-div">
                            //                 <Form.Label>To add a shared container, enter the &lsquo;Container
                            //                     ID&rsquo;.</Form.Label>
                            //                 <Form.Control id="sharedContainerID" type="text"
                            //                               placeholder="Container ID"/>
                            //             </Form.Group>
                            //         </CompModalStandard>)
                            // }}
                        />
                        <div class="row">
                            <div class="col-12">
                                <div className="templateWrapper">
                                    <div className="templateContainer">

                                        <div class="row">
                                            <div className="col-3">
                                                <p>Select a container to open and view contents.</p>
                                            </div>
                                            <div className="col-9">
                                                <div className="orgContainersGrid">
                                                    <div className="row">
                                                        {/* <ViewContainers containerList={this.state.containerList} onDelete={this.onContainerDelete} viewMode={this.state.viewMode} onContainerSelection={this.onContainerSelection} ></ViewContainers>*/}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default SharedContainers;
