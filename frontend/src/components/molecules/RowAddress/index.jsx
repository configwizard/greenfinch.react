import React from 'react';
//import PropTypes from 'prop-types';

// Components
import ButtonText from '../../atoms/ButtonText';
import RowElement from '../../atoms/RowElement';
import Tooltip from '../../atoms/Tooltip';

import './style.scss';

const RowAddress = ({contact}) => {
    console.log("row address ", contact)
    return (
        <div className="rowAddress d-flex flex-row align-items-center">
            <div>
                <RowElement
                    size={"small"}
                    isUppercase={false}
                    text={contact.firstName + " " + contact.lastName} />
                <Tooltip content="Copy wallet address" direction="top">
                    <ButtonText
                        size={"small"}
                        type={"clean"}
                        hasIcon={false}
                        text={contact.walletAddress} />
                </Tooltip>
            </div>
            <div className="ms-auto">
                <ButtonText
                    size={"small"}
                    type={"clean"}
                    hasIcon={true}
                    faClass={"fas fa-trash-alt"}
                    text={"Delete"} />
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
