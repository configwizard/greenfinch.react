import React from 'react';

// Components
import ButtonText from '../../../atoms/ButtonText';
import { useModal } from '../../../organisms/Modal/ModalContext';
import CompModalStandard from '../../../organisms/Modal/ModalStandard';

const ButtonContentContainerDelete = ({ containerName, containerId, containerPermission }) => {
    const { setModal, unSetModal } = useModal()
    return (
        <ButtonText
            type="default"
            size="small"
            hasIcon={true}
            faClass={"fas fa-trash-alt"} 
            text={"Delete container"}
            onClick={() => {
                setModal(
                <CompModalStandard
                    title={"Are you sure?"}
                    buttonTextSecondary={"No"}
                    buttonTextPrimary={"Yes"}
                    primaryClicked={async () => {console.log("clicked"); unSetModal()}}
                    secondaryClicked={async () => unSetModal()}>
                <p>Are you sure you would you like to delete container <em>{containerName}</em></p>
                </CompModalStandard>)
            }} />
    )
}

export default ButtonContentContainerDelete;