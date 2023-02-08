import React from 'react';
//import PropTypes from 'prop-types';
import {copyTextToClipboard, transferGasToContact} from "../../../manager/manager.js"
// Components
import ButtonText from '../../atoms/ButtonText';
import RowElement from '../../atoms/RowElement';
import Tooltip from '../../atoms/Tooltip';

import './style.scss';
import CompModalStandard from "../../organisms/Modal/ModalStandard";
import {Form} from "react-bootstrap";
import { useModal } from '../../organisms/Modal/ModalContext';


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
                        onClick={() => {copyTextToClipboard(contact.walletAddress)}}/>
                </Tooltip>
                <Tooltip content="Copy public key" direction={first ? "bottom": "top"}>
                    <ButtonText
                        size={"small"}
                        type={"clean"}
                        hasIcon={false}
                        text={contact.publicKey}
                        onClick={() => {copyTextToClipboard(contact.publicKey)}}/>
                </Tooltip>
            </div>
            <div className="ms-auto">
                <ButtonText
                    size={"small"}
                    type={"clean"}
                    hasIcon={true}
                    faClass={"fas fa-trash-alt"}
                    text={"Delete"}
                /* onClick={() => {deleteContact(contact.walletAddress)}} */ 
                    onClick={
                        () => {
                            setModal(
                                <CompModalStandard
                                    title={"Delete contact"}
                                    buttonTextPrimary={"Yes"}
                                    buttonTextSecondary={"No"}
                                    primaryClicked={async () => {await deleteContact(contact.walletAddress); await unSetModal()}}
                                    secondaryClicked={async () => unSetModal()}>
                                        <p>Are you sure you want to delete this contact?</p>
                                </CompModalStandard>)
                        }}/>
                <ButtonText
                    size={"small"}
                    type={"clean"}
                    hasIcon={true}
                    faClass={"fas fa-paper-plane"}
                    text={"Send GAS"}
                    onClick={
                        () => {
                            setModal(
                                <CompModalStandard
                                    title={"Add new contact"}
                                    buttonTextPrimary={"Send"}
                                    buttonTextSecondary={"Cancel"}
                                    primaryClicked={async () => {await transferGasToContact(contact.walletAddress, document.getElementById("transferGasAmount").value); await unSetModal()}}
                                    secondaryClicked={async () => unSetModal()}>
                                    <Form.Group className="form-div">
                                        <Form.Label>Transfer Gas to {contact.firstName + " " + contact.lastName} - {contact.walletAddress}</Form.Label>
                                        <Form.Control id="transferGasAmount" type="number" placeholder={"1.2"}/>
                                        <Form.Text muted>e.g 1.3 GAS</Form.Text>
                                    </Form.Group>
                                </CompModalStandard>)
                        }}/>
            </div>
        </div>
    )
};

export default RowAddress;
