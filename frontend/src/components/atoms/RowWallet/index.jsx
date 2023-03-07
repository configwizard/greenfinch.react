import React from 'react';
import PropTypes from 'prop-types';
import MiddleEllipsis from 'react-middle-ellipsis';

import './style.scss';

const RowWallet = ({ type, title, value }) => {
  return (
    <div className="row-wallet-option">
        {
            type === "address" && (
                <>
                    <h6 className="atmWallet">{title}</h6>
                    <MiddleEllipsis><span>{value}</span></MiddleEllipsis>
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
