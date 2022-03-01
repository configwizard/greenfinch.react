import React from "react";
import { createContainer } from "../../manager/containers.js";
import CompModal from "../compModal";
import { Form } from "react-bootstrap";

function ControlBar({containers, selectedContainer, onSelected, changeView, viewMode, resetBreadcrumb}) {
    console.log("containerList", containers)
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
                        <button data-bs-toggle="modal" data-bs-target="#newContainerModal" type="button" className={`atmButtonSimple ${selectedContainer ? "utInactive" : "utActive"}`}><i className="fas fa-plus-circle"/>New container</button>
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
            <div className="modal fade" id="newContainerModal" tabIndex="-1" aria-labelledby="exampleModalLabel"
                 aria-hidden="true">
                <CompModal title="Create a New Container" buttonTextPrimary="Create" buttonTextSecondary="Cancel" clicked={async () => createContainer(document.getElementById("containerName").value)}>
                    <Form.Label>Container name</Form.Label>
                    <Form.Text> Choose a name for the container. (N.B. this cannot be changed)</Form.Text>
                    <Form.Control id="containerName" type="text" placeholder="e.g. holiday photos" />
                    {/*<button onClick={async () => createContainer(document.getElementById("containerName"))}></button>*/}
                </CompModal>
            </div>
        </div>
    );
}

export default ControlBar;
