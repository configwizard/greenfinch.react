import * as React from 'react'
import { Form } from 'react-bootstrap';

// Actual
import { createContainer } from '../../../manager/containers.js';

// Mocker
// import { createContainer } from '../../../mocker/containers.js'

// Components
import ButtonText from '../../atoms/ButtonText';
import ButtonIcon from '../../atoms/ButtonIcon';
import { useModal } from '../../organisms/Modal/ModalContext';
import CompModalStandard from '../../organisms/Modal/ModalStandard';

import './style.scss';

function ControlBar({containers, selectedContainer, onSelected, changeView, viewMode, resetBreadcrumb}) {
    // console.log("containerList", containers)
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
                        <ButtonText
                            buttonClass={"atmButtonText"}
                            hasIcon={true}
                            faClass={"fas fa-plus-circle"} 
                            text={"New container"}
                            onClick={() => {
                                setModal(
                                <CompModalStandard
                                    title={"Add a new container"}
                                    buttonTextPrimary={"Add"}
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
                            type={"default"}
                            size={"medium"}
                            buttonClass={selectedContainer ? "utActive" : "utInactive"}
                            faClass={"fas fa-arrow-alt-to-left"}
                            onClick={()=>{resetBreadcrumb()}} />
                    </div>
                    <div className="molButtonGroup">
                        <ButtonIcon
                            type={"default"}
                            size={"medium"}
                            buttonClass={viewMode === 'grid' ? "utLive" : "utReady"}
                            faClass={"fas fa-th-large"}
                            onClick={()=>{changeView("grid")}} />
                        <ButtonIcon
                            type={"default"}
                            size={"medium"}
                            buttonClass={viewMode === 'grid' ? "utReady" : "utLive"}
                            faClass={"fas fa-list"}
                            onClick={()=>{changeView("list")}} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ControlBar;
