import React from 'react';

// Components
import { useModal } from "../../../organisms/Modal/ModalContext";
import CompModalStandard from "../../../organisms/Modal/ModalStandard";

export function DeleteButton(props){

    const { setModal, unSetModal } = useModal()
    return (
        <button 
            type="button" 
            className="atmButtonBase dropdown-item"
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
    )

}