import React from 'react';

// Components
import ButtonText from '../../atoms/ButtonText';
import { useModal } from '../Modal/ModalContext';
import CompModalStandard from '../Modal/ModalStandard';

const ObjectInfo = ({ objectName, objectId, objectFile }) => {
    const { setModal, unSetModal } = useModal()
    return (
        <ButtonText
            type="default"
            size="small"
            hasIcon={true}
            faClass={"fas fa-eye"} 
            text={"View object properties"}
            onClick={() => {
                setModal(
                <CompModalStandard
                    title={"Object properties"}
                    buttonTextSecondary={"Cancel"}
                    buttonTextPrimary={"Close"}
                    secondaryClicked={async () => unSetModal()}
                    primaryClicked={async () => unSetModal()}>
                        <figure><img className="mw-100" src={`data:image/png;base64,${objectFile}`} alt={objectName} /></figure>
                        <h6>Object Name:</h6>
                        <p>{objectName}</p>
                        <h6>Object ID:</h6>
                        <p>{objectId}</p>
                </CompModalStandard>)
            }} />
    )
}

export default ObjectInfo;