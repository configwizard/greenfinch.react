import React from "react";
import { createContainer } from "../../manager/containers.js";
//import CompModalFrosted from "../compModals/compModalFrosted";
import { Form } from "react-bootstrap";
import {useModal} from "../compModals/modalContext";
import CompModalStandard from "../compModals/compModalStandard";

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
                        <button data-bs-toggle="modal" data-bs-target="#compModalStandard" type="button" className={`atmButtonSimple ${selectedContainer ? "utInactive" : "utActive"}`}
                            onClick={() => {
                                setModal(<CompModalStandard title={"click for a modal"} buttonTextPrimary={"Send!"} buttonTextSecondary={"cancel"} secondaryClicked={async () => unSetModal()} primaryClicked={async () => createContainer(document.getElementById("containerName").value)}>
                                    <Form.Label>Container name</Form.Label>
                                    <Form.Text> Choose a name for the container. (N.B. this cannot be changed)</Form.Text>
                                    <Form.Control id="containerName" type="text" placeholder="e.g. holiday photos" />
                                </CompModalStandard>)
                            }}>
                        ><i className="fas fa-plus-circle"/>New container</button>
                        {/*<button type="button" className={`atmButtonIcon ${viewMode === 'grid' ? "utReady" : "utLive"}`} // this line creates the button to show the modal*/}
                        {/*    onClick={() => {*/}
                        {/*    setModal(<CompModalStandard title={"click for a modal"} buttonTextPrimary={"Send!"} buttonTextSecondary={"cancel"} secondaryClicked={async () => unSetModal()} primaryClicked={async () => createContainer(document.getElementById("containerName").value)}>*/}
                        {/*                <Form.Label>Container name</Form.Label>*/}
                        {/*                <Form.Text> Choose a name for the container. (N.B. this cannot be changed)</Form.Text>*/}
                        {/*                <Form.Control id="containerName" type="text" placeholder="e.g. holiday photos" />*/}
                        {/*    </CompModalStandard>)*/}
                        {/*}}><i className="fas fa-list" />"Button for modals"</button>*/}
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
            {/*<div className="modal fade" id="compModalStandard" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">*/}
            {/*    <CompModalStandard title="Create a New Container" buttonTextPrimary="Create" buttonTextSecondary="Cancel" clicked={async () => createContainer(document.getElementById("containerName").value)}>*/}
            {/*        <Form.Label>Container name</Form.Label> */}
            {/*        <Form.Text> Choose a name for the container. (N.B. this cannot be changed)</Form.Text>*/}
            {/*        <Form.Control id="containerName" type="text" placeholder="e.g. holiday photos" />*/}
            {/*        /!* <button onClick={async () => createContainer(document.getElementById("containerName"))}></button> *!/*/}
            {/*    </CompModalStandard>*/}
            {/*</div>*/}
            {/*
                <div className="modal fade" id="compModalFrosted" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <CompModalFrosted title="Create a New Container" buttonTextSecondary="Cancel">
                        Test
                    </CompModalFrosted>
                </div>
            */}
        </div>
    );
}

export default ControlBar;
