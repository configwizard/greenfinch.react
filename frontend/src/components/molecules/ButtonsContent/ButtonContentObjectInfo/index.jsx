import React from 'react';

// Components
import ButtonText from '../../../atoms/ButtonText';
import { useModal } from '../../../organisms/Modal/ModalContext';
import CompModalStandard from '../../../organisms/Modal/ModalStandard';
import Moment from "react-moment";
import {fileSize} from "humanize-plus";

const ButtonContentObjectInfo = ({ objectName, objectId, objectFile, objectSize, uploadedAt }) => {
    const { setModal, unSetModal } = useModal()
    return (
        <ButtonText
            type="clean"
            size="small"
            hasIcon={true}
            faClass={"fa-sharp fa-solid fa-eye"} 
            text={"View object properties"}
            isDisabled={false}
            onClick={() => {
                setModal(
                <CompModalStandard
                    unSetModal={async () => unSetModal()}
                    size={"medium"}
                    title={"Object properties"}
                    hasSecondaryButton={false}
                    buttonTextPrimary={"Close"}
                    primaryClicked={async () => unSetModal()}>
                        <figure><img className="mw-100" src={`data:image/png;base64,${objectFile}`} alt={objectName} /></figure>
                        <h6>Object Name:</h6>
                        <p>{objectName}</p>
                        <h6>Object ID:</h6>
                        <p>{objectId}</p>
                        <h6>Object Size:</h6>
                        <p>{fileSize(objectSize)}</p>
                        <h6>Object Created:</h6>
                        <p><Moment unix format="DD MMM YY">{uploadedAt}</Moment></p>
                </CompModalStandard>)
            }} />
    )
}

export default ButtonContentObjectInfo;