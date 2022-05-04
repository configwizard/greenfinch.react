import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';

const RowWallet = ({ type, title, value }) => {
  return (
    <div className="row-wallet-option">
        {
            type === "address" && (
                <>
                    <h6 className="atmWallet">{title}</h6>
                    <span className="atmWalletAddress">{value}</span>
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
    title: "Row Title",
    value: "Empty"
};                            
