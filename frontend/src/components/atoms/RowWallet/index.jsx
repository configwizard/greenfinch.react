import React from 'react';
import PropTypes from 'prop-types';
import {copyTextToClipboard, makeCopyToast} from "../../../manager/manager.js"
import MiddleEllipsis from 'react-middle-ellipsis';

//Components
import Tooltip from '../../atoms/Tooltip';

import './style.scss';

const RowWallet = ({ type, title, value, hasCopy }) => {
  return (
    <div className="row-wallet-option">
        {
            type === "address" && (
                hasCopy ?
                    <>
                        <h6 className="atmWallet">{title}</h6>
                        <MiddleEllipsis><span className="copyable" onClick={() => {copyTextToClipboard(value); makeCopyToast("Copied to clipboard")}}>{value}</span></MiddleEllipsis>
                    </>
                :
                <>
                    <h6 className="atmWallet">{title}</h6>
                    <MiddleEllipsis><span>{value}</span></MiddleEllipsis>
                </>
            )      
        }
        {
            type === "number" && (
                hasCopy ?
                    <>
                        <h6 className="atmWallet">{title}</h6>
                        <Tooltip content={'Copy ' + title}>
                            <span className="copyable" onClick={() => {copyTextToClipboard(value); makeCopyToast("Copied to clipboard")}}>{value}</span>
                        </Tooltip>
                    </>
                :
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
    hasCopy: PropTypes.bool,
    title: PropTypes.string
};

RowWallet.defaultProps = {
    type: "number",
    hasCopy: false,
    title: "Row title",
    value: "Row value"
};                            
