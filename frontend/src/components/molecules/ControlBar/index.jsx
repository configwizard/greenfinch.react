import * as React from 'react'

// Components
import ButtonIcon from '../../atoms/ButtonIcon';

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
                    faClass={"fa-sharp fa-solid fa-left-to-line"}
                    onClick={()=>{resetBreadcrumb()}} />
                <ButtonIcon
                    type={"default"}
                    size={"small"}
                    buttonClass={viewMode === 'grid' ? "active" : null}
                    faClass={"fa-sharp fa-solid fa-table-cells-large"}
                    onClick={()=>{changeView("grid")}} />
                <ButtonIcon
                    type={"default"}
                    size={"small"}
                    buttonClass={viewMode === 'grid' ? null : 'active'}
                    faClass={"fa-sharp fa-solid fa-list"}
                    onClick={()=>{changeView("list")}} />
            </div>
        </div>
    );
}

export default ControlBar;
