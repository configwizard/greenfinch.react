import React from 'react';
//import PropTypes from 'prop-types';

// Components
import ButtonText from '../../atoms/ButtonText';
import RowElement from '../../atoms/RowElement';
import Tooltip from '../../atoms/Tooltip';

import './style.scss';

const RowAddress = () => {
    return (
        <div className="rowAddress d-flex flex-row align-items-center">
            <div>
                <RowElement
                    size={"small"}
                    isUppercase={false}
                    text={"Alex Walker"} />
                <Tooltip content="Copy wallet address" direction="top">
                    <ButtonText
                        size={"small"}
                        type={"clean"}
                        hasIcon={false}
                        text={"n89kygydnhr4672533jdhfx"} />
                </Tooltip>
            </div>
            <div className="ms-auto">
                <ButtonText
                    size={"small"}
                    type={"clean"}
                    hasIcon={true}
                    faClass={"fas fa-pencil"}
                    text={"Edit"} />
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
                    text={"Send"} />
            </div>
        </div>
    )
};

export default RowAddress;