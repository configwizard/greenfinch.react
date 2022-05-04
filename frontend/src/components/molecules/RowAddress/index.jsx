import React from 'react';
//import PropTypes from 'prop-types';
import {copyTextToClipboard} from "../../../manager/manager.js"
// Components
import ButtonText from '../../atoms/ButtonText';
import RowElement from '../../atoms/RowElement';
import Tooltip from '../../atoms/Tooltip';

import './style.scss';
import {deleteContact} from "../../../manager/contacts"
const RowAddress = ({first, contact}) => {
    console.log("row address ", contact)
    return (
        <div className="rowAddress d-flex flex-row align-items-center">
            <div>
                <RowElement
                    size={"small"}
                    isUppercase={false}
                    text={contact.firstName + " " + contact.lastName} />
                <RowElement
                    size={"small"}
                    isUppercase={false}
                    text={" " + contact.walletAddress} />
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
                onClick={() => {deleteContact(contact.walletAddress)}}/>
                <ButtonText
                    size={"small"}
                    type={"clean"}
                    hasIcon={true}
                    faClass={"fas fa-paper-plane"}
                    text={"Send GAS"} />
            </div>
        </div>
    )
};

export default RowAddress;
