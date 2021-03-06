import React from 'react';
import { Form } from 'react-bootstrap';
import {shareContainerWithContact} from "../../../manager/contacts"
// Components
import ButtonText from '../../atoms/ButtonText';
import { useModal } from '../Modal/ModalContext';
import CompModalStandard from '../Modal/ModalStandard';
import {NavLink} from "react-router-dom";

// const shareContainer = async (shareContact) => {
//     console.log(shareContact);
// }

const ContainerShare = ({containerId, contacts}) => {
    const { setModal, unSetModal } = useModal()
    console.log("choose a contact", contacts)
    return (
        <ButtonText
            type="default"
            size="small"
            hasIcon={true}
            faClass={"fas fa-share"} 
            text={"Share container"}
            onClick={() => {
                setModal(
                <CompModalStandard
                    title={"Share this container"}
                    buttonTextPrimary={"Share"}
                    buttonTextSecondary={"Cancel"}
                    primaryClicked={async () => {console.log("clicked", document.getElementById("shareContact").value); await shareContainerWithContact(containerId, document.getElementById("shareContact").value); unSetModal()}}
                    secondaryClicked={async () => unSetModal()}>
                        <Form.Group>
                            <Form.Label>Select contact</Form.Label>
                            <Form.Select id="shareContact" aria-label="select">
                                <option>{contacts.length > 0 ? "Select contact to share..." : "N.B. You currently have no contacts in Greenfinch" }</option>
                                {
                                    contacts.map(c => {
                                        return <option value={c.publicKey} key={c.walletAddress}>{c.firstName + " " + c.lastName}</option>
                                    })
                                }
                            </Form.Select>
                        </Form.Group>
                </CompModalStandard>)
            }} />
    )
}

export default ContainerShare;
