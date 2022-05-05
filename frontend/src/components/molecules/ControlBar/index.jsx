import * as React from 'react'
// import { Breadcrumb } from 'react-bootstrap';
// import { Form } from 'react-bootstrap';

// Actual
// import { createContainer } from '../../../manager/containers.js';

// Mocker
// import { createContainer } from '../../../mocker/containers.js'

// Components
import ButtonIcon from '../../atoms/ButtonIcon';
// import { useModal } from '../../organisms/Modal/ModalContext';
// import CompModalStandard from '../../organisms/Modal/ModalStandard';

import './style.scss';

const ControlBar = ({containers, selectedContainer, onSelected, changeView, viewMode, resetBreadcrumb}) => {
    // console.log("containerList", containers)
    // const { setModal, unSetModal } = useModal()
    return (
        <div className="controlbar-container d-flex align-items-center">
            {/*
                <div className="molButtonGroup d-none d-md-block">
                    <span className="atmContainerTitle">
                        {selectedContainer ? "Objects - " : "Containers - "}{viewMode === 'grid' ? "Grid View" : "List View"}
                    </span>
                </div>
            */}
            {/*
                <div className="ms-auto molButtonGroup">
                    <ButtonText
                        type="default"
                        size="medium"
                        hasIcon={true}
                        faClass={"fas fa-plus-circle"} 
                        text={"Create new container"}
                        onClick={() => {
                            setModal(
                            <CompModalStandard
                                title={"Create new container"}
                                buttonTextPrimary={"Create"}
                                buttonTextSecondary={"Cancel"}
                                primaryClicked={async () => {await createContainer(document.getElementById("containerName").value, document.getElementById("containerPermission").value); unSetModal()}}
                                secondaryClicked={async () => unSetModal()}>
                                    <Form.Group className="form-div">
                                        <Form.Label>Container name</Form.Label>
                                        <Form.Control id="containerName" type="text" />
                                        <Form.Text muted>NB. This cannot be changed</Form.Text>
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label>Container permissions</Form.Label>
                                        <Form.Select id="containerPermission" aria-label="select">
                                            <option>Select container permissions...</option>
                                            <option value="PUBLICREAD">Public Read Only</option>
                                            <option value="PUBLICBASIC">Public Read/Write</option>
                                            <option value="PRIVATE">Private</option>
                                        </Form.Select>
                                    </Form.Group>
                            </CompModalStandard>)
                        }} />
                </div>
            */}
            <div className="ms-auto">
                <ButtonIcon
                    type={"default"}
                    size={"small"}
                    buttonClass={selectedContainer ? "utActive" : "utInactive"}
                    faClass={"fas fa-arrow-alt-to-left"}
                    onClick={()=>{resetBreadcrumb()}} />
                <ButtonIcon
                    type={"default"}
                    size={"small"}
                    buttonClass={viewMode === 'grid' ? "utLive" : "utReady"}
                    faClass={"fas fa-th-large"}
                    onClick={()=>{changeView("grid")}} />
                <ButtonIcon
                    type={"default"}
                    size={"small"}
                    buttonClass={viewMode === 'grid' ? "utReady" : "utLive"}
                    faClass={"fas fa-list"}
                    onClick={()=>{changeView("list")}} />
            </div>
        </div>
    );
}

export default ControlBar;
