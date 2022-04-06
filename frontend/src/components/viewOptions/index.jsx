import * as React from 'react'

// Actual
// import { createContainer } from "../../manager/containers.js";

// Mocker
import { createContainer } from "../../mocker/containers.js"

import {useModal} from "../compModals/compModalContext";
import CompModalStandard from "../compModals/compModalStandard";
import { Form } from "react-bootstrap";

import ButtonDefault from '../a_atoms/ButtonDefault';
import ButtonIcon from '../a_atoms/ButtonIcon';

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
                        {/*
                        <button
                            type="button" 
                            className={`atmButtonDefault ${selectedContainer ? "utInactive" : "utActive"}`}
                            onClick={() => {
                                setModal(
                                <CompModalStandard
                                    title={"Add a new container"}
                                    buttonTextPrimary={"Send"}
                                    buttonTextSecondary={"Cancel"}
                                    primaryClicked={async () => {await createContainer(document.getElementById("containerName").value); unSetModal()}}
                                    secondaryClicked={async () => unSetModal()}>
                                        <p>Choose a name for the container. (N.B. this cannot be changed)</p>
                                        <Form.Control id="containerName" type="text" placeholder="e.g. holiday photos" />
                                </CompModalStandard>)
                            }}>
                            <i className="fas fa-plus-circle"/>New container
                        </button>
                        */}
                        <ButtonDefault 
                            buttonClass={"atmButtonDefault"}
                            iconIncluded={true}
                            iconClasses={"fas fa-plus-circle"} 
                            text={"New container"}
                            onClick={() => {
                                setModal(
                                <CompModalStandard
                                    title={"Add a new container"}
                                    buttonTextPrimary={"Send"}
                                    buttonTextSecondary={"Cancel"}
                                    primaryClicked={async () => {await createContainer(document.getElementById("containerName").value); unSetModal()}}
                                    secondaryClicked={async () => unSetModal()}>
                                        <p>Choose a name for the container. (N.B. this cannot be changed)</p>
                                        <Form.Control id="containerName" type="text" placeholder="e.g. holiday photos" />
                                </CompModalStandard>)
                            }} />
                    </div>
                    <div className="molButtonGroup">
                        <ButtonIcon
                            buttonClass={`atmButtonIcon ${selectedContainer ? "utActive" : "utInactive"}`}
                            iconClasses={"fas fa-arrow-alt-to-left"}
                            onClick={()=>{resetBreadcrumb()}} />
                        {/*
                        <button type="button" className={`atmButtonIcon ${selectedContainer ? "utActive" : "utInactive"}`} onClick={()=>{resetBreadcrumb()}}><i className="fas fa-arrow-alt-to-left" /></button>
                        */}
                    </div>
                    <div className="molButtonGroup">
                        <ButtonIcon
                            buttonClass={`atmButtonIcon ${viewMode === 'grid' ? "utLive" : "utReady"}`}
                            iconClasses={"fas fa-th-large"}
                            onClick={()=>{changeView("grid")}}/>
                        <ButtonIcon
                            buttonClass={`atmButtonIcon ${viewMode === 'grid' ? "utReady" : "utLive"}`}
                            iconClasses={"fas fa-list"}
                            onClick={()=>{changeView("list")}}/>
                        {/*  
                        <button type="button" className={`atmButtonIcon ${viewMode === 'grid' ? "utLive" : "utReady"}`} onClick={()=>{changeView("grid")}}><i className="fas fa-th-large" /></button>
                        <button type="button" className={`atmButtonIcon ${viewMode === 'grid' ? "utReady" : "utLive"}`} onClick={()=>{changeView("list")}}><i className="fas fa-list" /></button>
                        */}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ControlBar;
