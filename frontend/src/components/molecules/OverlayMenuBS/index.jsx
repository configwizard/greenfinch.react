import React from 'react';
import onClickOutside from 'react-onclickoutside';

// Components
import { useModal } from "../../organisms/Modal/ModalContext";
import CompModalStandard from "../../organisms/Modal/ModalStandard";


// This is Secondary Component test to original component: OverlayMenu

function OverlayMenuBS(props) {
    OverlayMenuBS.handleClickOutside = () => props.setShowMenu(false)
    const { setModal, unSetModal } = useModal()
    return (
        props.show ? 
            <div onClick={() => props.setShowMenu(false)}>
                <div className="utOverlayMenuSmall" onClick={e => e.stopPropagation()}>
                    {/* Bootstrap dropdown */}
                    <div class="btn-group">
                        <button class="btn btn-secondary btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                            Small button
                        </button>
                        <ul class="dropdown-menu">
                            <li><button 
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
                                <i className="fas fa-trash-alt"/>&nbsp;Delete
                            </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div> : null
    )
}
const clickOutsideConfig = {
    handleClickOutside: () => OverlayMenuBS.handleClickOutside,
};

export default onClickOutside(OverlayMenuBS, clickOutsideConfig);