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
            <div className="ms-auto">
                <ButtonIcon
                    type={"default"}
                    size={"small"}
                    isDisabled={selectedContainer ? false : true}
                    faClass={"fas fa-arrow-alt-to-left"}
                    onClick={()=>{resetBreadcrumb()}} />
                <ButtonIcon
                    type={"default"}
                    size={"small"}
                    buttonClass={viewMode === 'grid' ? "active" : null}
                    faClass={"fas fa-th-large"}
                    isDisabled={false}
                    onClick={()=>{changeView("grid")}} />
                <ButtonIcon
                    type={"default"}
                    size={"small"}
                    buttonClass={viewMode === 'grid' ? null : 'active'}
                    faClass={"fas fa-list"}
                    isDisabled={false}
                    onClick={()=>{changeView("list")}} />
            </div>
        </div>
    );
}

export default ControlBar;
