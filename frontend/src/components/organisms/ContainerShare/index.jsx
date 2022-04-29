import React from 'react';
import { Form } from 'react-bootstrap';

// Components
import ButtonText from '../../atoms/ButtonText';
import { useModal } from '../../organisms/Modal/ModalContext';
import CompModalStandard from '../../organisms/Modal/ModalStandard';

const shareContainer = async (shareContact) => {
    console.log(shareContact);
}

const ContainerShare = () => {
    const { setModal, unSetModal } = useModal()
    return (
        <ButtonText
            type="default"
            size="medium"
            hasIcon={true}
            faClass={"fas fa-share"} 
            text={"Share container"}
            onClick={() => {
                setModal(
                <CompModalStandard
                    title={"Share this container"}
                    buttonTextPrimary={"Share"}
                    buttonTextSecondary={"Cancel"}
                    primaryClicked={async () => {await shareContainer(document.getElementById("shareContact").value); unSetModal()}}
                    secondaryClicked={async () => unSetModal()}>
                        <Form.Group>
                            <Form.Label>Contact</Form.Label>
                            <Form.Select id="shareContact" aria-label="select">
                                <option>Select contact to share...</option>
                                <option value="share_alexwalker">Alex Walker</option>
                                <option value="share_robingreen">Robin Green</option>
                                <option value="share_chrisbradley">Chris Bradley</option>
                            </Form.Select>
                        </Form.Group>
                </CompModalStandard>)
            }} />
    )
}

export default ContainerShare;