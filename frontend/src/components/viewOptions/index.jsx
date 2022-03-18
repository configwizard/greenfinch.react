import React from "react";
import { createContainer } from "../../manager/containers.js";
import { Form } from "react-bootstrap";
import {useModal} from "../compModals/compModalContext";
import CompModalStandard from "../compModals/compModalStandard";
import CompModalBrand from "../compModals/compModalBrand";

function ControlBar({containers, selectedContainer, onSelected, changeView, viewMode, resetBreadcrumb}) {
    console.log("containerList", containers)
    const { setModal, unSetModal } = useModal()
    return (
        <div className="row">
            <div className="col-12">
                <div className="molContainersHeader d-flex align-items-center">
                    <div className="molButtonGroup d-none d-md-block">
                        <span className="atmContainerTitle">
                            {selectedContainer ? "Objects - " : "Containers - "}{viewMode === 'grid' ? "Grid View" : "List View"}
                        </span>
                    </div>
                    {/* Implement button disable attribute or :disabled */}
                    <div className="ms-auto molButtonGroup">
                        <button 
                            type="button" 
                            className="atmButtonSimple"
                            onClick={() => {
                                setModal(
                                <CompModalBrand
                                    title={"Get started"} 
                                    secondaryClicked={async () => unSetModal()} 
                                    primaryClicked={async () => createContainer(document.getElementById("containerName").value)}>
                                        <div className="d-flex flex-column align-items-center">
                                            <p>Welcome to Greenfinch, to get started you will need a wallet.</p>
                                            <button 
                                                type="button" 
                                                className="atmButtonSimple">
                                                    <i className="fas fa-star-shooting"/>Create new wallet
                                            </button>
                                            <button 
                                                type="button" 
                                                className="atmButtonText">
                                                    <i className="fas fa-upload"/>Load existing wallet
                                            </button>
                                        </div>
                                </CompModalBrand>)
                            }}>
                            <i className="fas fa-star"/>Launch Modal
                        </button>
                        <button 
                            type="button" 
                            className={`atmButtonSimple ${selectedContainer ? "utInactive" : "utActive"}`}
                            onClick={() => {
                                setModal(
                                <CompModalStandard 
                                    title={"Add a new container"} 
                                    buttonTextPrimary={"Send"} 
                                    buttonTextSecondary={"Cancel"} 
                                    primaryClicked={async () => createContainer(document.getElementById("containerName").value)}
                                    secondaryClicked={async () => unSetModal()}>
                                        <p>Choose a name for the container. (N.B. this cannot be changed)</p>
                                        <Form.Control id="containerName" type="text" placeholder="e.g. holiday photos" />
                                </CompModalStandard>)
                            }}>
                            <i className="fas fa-plus-circle"/>New container
                        </button>
                        {/*  <button
                            type="button" 
                            className={`atmButtonIcon ${viewMode === 'grid' ? "utReady" : "utLive"}`} // this line creates the button to show the modal
                            onClick={() => {
                                setModal(
                                <CompModalStandard title={"click for a modal"} buttonTextPrimary={"Send!"} buttonTextSecondary={"cancel"} secondaryClicked={async () => unSetModal()} primaryClicked={async () => createContainer(document.getElementById("containerName").value)}>
                                    <Form.Label>Container name</Form.Label>
                                    <Form.Text> Choose a name for the container. (N.B. this cannot be changed)</Form.Text>
                                    <Form.Control id="containerName" type="text" placeholder="e.g. holiday photos" />
                                </CompModalStandard>)
                            }}><i className="fas fa-list" />"Button for modals"
                        </button>  */}
                    </div>
                    <div className="molButtonGroup">
                        <button type="button" className={`atmButtonIcon ${selectedContainer ? "utActive" : "utInactive"}`} onClick={()=>{resetBreadcrumb()}}><i className="fas fa-arrow-alt-to-left" /></button>
                    </div>
                    <div className="molButtonGroup">
                        <button type="button" className={`atmButtonIcon ${viewMode === 'grid' ? "utLive" : "utReady"}`} onClick={()=>{changeView("grid")}}><i className="fas fa-th-large" /></button>
                        <button type="button" className={`atmButtonIcon ${viewMode === 'grid' ? "utReady" : "utLive"}`} onClick={()=>{changeView("list")}}><i className="fas fa-list" /></button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ControlBar;
