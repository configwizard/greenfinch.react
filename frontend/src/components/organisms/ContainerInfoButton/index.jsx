import React from 'react';

// Components
import ButtonText from '../../atoms/ButtonText';
import { useModal } from '../Modal/ModalContext';
import CompModalStandard from '../Modal/ModalStandard';

const ContainerInfo = ({ containerName, containerId, containerPermission, containerCreated, containerSize }) => {
    const { setModal, unSetModal } = useModal()
    return (
        <ButtonText
            type="default"
            size="small"
            hasIcon={true}
            faClass={"fas fa-eye"} 
            text={"View container properties"}
            onClick={() => {
                setModal(
                <CompModalStandard
                    title={"Container properties"}
                    buttonTextSecondary={"Cancel"}
                    buttonTextPrimary={"Close"}
                    secondaryClicked={async () => unSetModal()}
                    primaryClicked={async () => unSetModal()}>
                        <h6>Container Name</h6>
                        <p>{containerName}</p>
                        <h6>Container ID</h6>
                        <p>{containerId}</p>
                        <h6>Container Permission</h6>
                        <p>{containerPermission}</p>
                        <h6>Container created</h6>
                        <p>{containerCreated}</p>
                        <h6>Container Size</h6>
                        <p>{containerSize}</p>
                </CompModalStandard>)
            }} />
    )
}

export default ContainerInfo;