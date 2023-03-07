import React from 'react';
import onClickOutside from 'react-onclickoutside';

// Components
import { useModal } from "../../organisms/Modal/ModalContext";
import CompModalStandard from "../../organisms/Modal/ModalStandard";

import './style.scss';

function OverlayMenu(props) {
    //leave this for the time being - it should allow us to click outside to close like the dropdown, but currently not working
    OverlayMenu.handleClickOutside = () => props.setShowMenu(false)
    const { setModal, unSetModal } = useModal()
    return (
        props.show ? 
            <div onClick={() => props.setShowMenu(false)}>
                <div className="utOverlayMenuSmall" onClick={e => e.stopPropagation()}>
                    <nav className="nav flex-column align-items-start">
                        { props.type === "object" ?  
                            <>
                                {/* <button className="atmButtonBase nav-link" onClick={props.view}><i className="fa-sharp fa-solid fa-eye"/>&nbsp;View</button>*/}
                                <button className="atmButtonBase nav-link" onClick={() => props.onObjectSelection(props.id, props.filename)}><i className="fa-sharp fa-solid fa-download"/>&nbsp;Download</button>
                            </>
                        : null }
                        {/*  <button data-bs-toggle="modal" data-bs-target="#deleteModal" type="button" className="atmButtonBase nav-link"><i className="fa-sharp fa-solid fa-trash-can"/>&nbsp;Delete</button> */}
                        <button 
                            type="button" 
                            className="atmButtonBase nav-link" 
                            onClick={() => {
                                setModal(
                                <CompModalStandard 
                                    title={"Confirmation"} 
                                    buttonTextPrimary={"Yes"} 
                                    buttonTextSecondary={"No"} 
                                    secondaryClicked={async () => unSetModal()} 
                                    primaryClicked={() => {props.onDelete(); unSetModal()}}>
                                        <p>Are you sure you want to delete this item?</p>
                                </CompModalStandard>)
                            }}>
                            <i className="fa-sharp fa-solid fa-trash-can"/>&nbsp;Delete
                        </button>
                    </nav>
                </div>
            </div> : null
    )
}

const clickOutsideConfig = {
    handleClickOutside: () => OverlayMenu.handleClickOutside,
};

export default onClickOutside(OverlayMenu, clickOutsideConfig);
// export default OverlayMenu;
