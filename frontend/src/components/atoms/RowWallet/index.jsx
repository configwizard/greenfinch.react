import React from 'react';
import PropTypes from 'prop-types';
import MiddleEllipsis from 'react-middle-ellipsis';
import {copyTextToClipboard} from "../../../manager/manager.js"

//Components
import ButtonText from "../../atoms/ButtonText";
import Tooltip from '../../atoms/Tooltip';

import './style.scss';

const RowWallet = ({ type, title, value }) => {
  return (
    <div className="row-wallet-option">
        {
            type === "address" && (
                <>
                    <h6 className="atmWallet">{title}</h6>
                    <Tooltip content={'Copy' + title}>
                        <ButtonText
                            size={"small"}
                            type={"clean"}
                            hasIcon={false}
                            text={<MiddleEllipsis><span>{value}</span></MiddleEllipsis>}
                            isDisabled={false}
                            onClick={() => {copyTextToClipboard({value})}}/>
                    </Tooltip>
                </>
            )
        }
        {
            type === "number" && (
                <>
                    <h6 className="atmWallet">{title}</h6>
                    <span className="atmWalletNumber">{value}</span>
                </>
            )
        }
    </div>
  )
};

export default RowWallet;

RowWallet.propTypes = {
    type: PropTypes.string,
    title: PropTypes.string
};

RowWallet.defaultProps = {
    type: "number",
    title: "Row title",
    value: "Row value"
};                            
