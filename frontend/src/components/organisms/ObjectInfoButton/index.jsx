import React from 'react';

// Components
import ButtonText from '../../atoms/ButtonText';
import { useModal } from '../Modal/ModalContext';
import CompModalStandard from '../Modal/ModalStandard';
import Moment from "react-moment";
import {fileSize} from "humanize-plus";

const ObjectInfo = ({ objectName, objectId, objectFile, objectSize, uploadedAt }) => {
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
                        <h6>Object Size:</h6>
                        <p>{fileSize(objectSize)}</p>
                        <h6>Object Created:</h6>
                        <p><Moment unix format="DD MMM YY">{uploadedAt}</Moment></p>
                </CompModalStandard>)
            }} />
    )
}

export default ObjectInfo;