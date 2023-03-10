import React from 'react';

// Components
import ButtonText from '../../../atoms/ButtonText';
import { useModal } from '../../../organisms/Modal/ModalContext';
import CompModalStandard from '../../../organisms/Modal/ModalStandard';

const ButtonContentContainerDelete = ({ containerName, containerDelete, containerId, containerPermission }) => {
    const { setModal, unSetModal } = useModal()
    return (
        <ButtonText
            type="default"
            size="small"
            hasIcon={true}
            faClass={"fa-sharp fa-solid fa-trash-can"}
            text={"Delete container"}
            isDisabled={false}
            onClick={() => {
                setModal(
                <CompModalStandard
                    title={"Are you sure?"}
                    buttonTextPrimary={"Yes"}
                    hasSecondaryButton={true}
                    buttonTextSecondary={"No"}
                    primaryClicked={async () => {containerDelete(containerId); unSetModal()}}
                    secondaryClicked={async () => unSetModal()}>
                <p>Are you sure you would you like to delete container <em>{containerName}</em></p>
                </CompModalStandard>)
            }} />
    )
}

export default ButtonContentContainerDelete;