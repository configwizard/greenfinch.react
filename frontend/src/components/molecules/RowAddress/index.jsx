import React from 'react';
import {Form} from "react-bootstrap";
import {copyTextToClipboard, transferGasToContact} from "../../../manager/manager.js"

// Components
import ButtonText from '../../atoms/ButtonText';
import RowElement from '../../atoms/RowElement';
import Tooltip from '../../atoms/Tooltip';
import CompModalStandard from "../../organisms/Modal/ModalStandard";
import { useModal } from '../../organisms/Modal/ModalContext';

import './style.scss';

const RowAddress = ({first, contact, deleteContact}) => {
    const { setModal, unSetModal } = useModal()
    console.log("row address ", contact)
    return (
        <div className="rowAddress d-flex flex-row align-items-center">
            <div>
                <RowElement
                    size={"small"}
                    isUppercase={false}
                    text={contact.firstName + " " + contact.lastName} />
                <Tooltip content="Copy wallet address" direction={first ? "bottom": "top"}>
                    <ButtonText
                        size={"small"}
                        type={"clean"}
                        hasIcon={false}
                        text={contact.walletAddress}
                        isDisabled={false}
                        onClick={() => {copyTextToClipboard(contact.walletAddress)}}/>
                </Tooltip>
                <Tooltip content="Copy public key" direction={first ? "bottom": "top"}>
                    <ButtonText
                        size={"small"}
                        type={"clean"}
                        hasIcon={false}
                        text={contact.publicKey}
                        isDisabled={false}
                        onClick={() => {copyTextToClipboard(contact.publicKey)}}/>
                </Tooltip>
            </div>
            <div className="ms-auto">
                <ButtonText
                    size={"small"}
                    type={"clean"}
                    hasIcon={true}
                    faClass={"fa-sharp fa-solid fa-trash-can"}
                    text={"Delete"}
                    isDisabled={false}
                    onClick={() => {deleteContact(contact.walletAddress)}}/>
                <ButtonText
                    size={"small"}
                    type={"clean"}
                    hasIcon={true}
                    faClass={"fa-sharp fa-solid fa-paper-plane"}
                    text={"Send GAS"}
                    isDisabled={false}
                    onClick={
                        () => {
                            setModal(
                                <CompModalStandard
                                    title={"Add new contact"}
                                    hasSecondaryButton={true}
                                    buttonTextPrimary={"Send"}
                                    buttonTextSecondary={"Cancel"}
                                    primaryClicked={async () => {await transferGasToContact(contact.walletAddress, document.getElementById("transferGasAmount").value); await unSetModal()}}
                                    secondaryClicked={async () => unSetModal()}>
                                    <Form.Group className="form-div">
                                        <Form.Label>Transfer GAS to {contact.firstName + " " + contact.lastName} - {contact.walletAddress}</Form.Label>
                                        <Form.Control id="transferGasAmount" type="number" placeholder={"1.2"}/>
                                        <Form.Text muted>e.g. 5 GAS</Form.Text>
                                    </Form.Group>
                                </CompModalStandard>)
                        }}/>
            </div>
        </div>
    )
};

export default RowAddress;
