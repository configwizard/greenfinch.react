import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import { useModal } from "../../organisms/Modal/ModalContext";
import CompModalStandard from "../../organisms/Modal/ModalStandard";

import './style.scss';

export const ContentDropdownSize = {
    DEFAULT: 'default'
}

export const ContentDropdownType = {
    ICON: 'icon'
}

const ContentDropdown = ({ triggerText, menu }) => {

    const [isOpen, setIsOpen] = React.useState(false);
    const handleOpen = () => { setIsOpen(!isOpen); };

    const { setModal, unSetModal } = useModal()

    useEffect(() => console.log('UseEffect says Dropdown is open:',isOpen))
  
    return (
        <>
            <div className="molContentDropdown d-flex align-items-center justify-content-center">
                <button class="btn dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <i className="fa-sharp fa-solid fa-ellipsis"/>
                </button>
                <ul class="dropdown-menu">
                    {/*
                        { props.type === "object" ?  
                            <li>
                                <button className="atmButtonBase nav-link" onClick={() => props.onObjectSelection(props.id, props.filename)}><i className="fas fa-download"/>&nbsp;Download</button>
                            </li>
                        : null }
                    */}

                    <li>
                        <button 
                            type="button" 
                            className="atmButtonBase dropdown-item"
                            /*
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
                                }} 
                            */
                            >
                            <i className="fas fa-trash-alt"/>&nbsp;Delete
                        </button>
                    </li>
                </ul>
            </div>
        </>
    )
};

export default ContentDropdown;

ContentDropdown.propTypes = {
};

ContentDropdown.defaultProps = {
};  