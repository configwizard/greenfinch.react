import React from 'react';
import PropTypes from 'prop-types';

const RowWallet = ({ type, title, children,  }) => {
  return (
    <div className="molWalletOption">
        {
            type === "address" && (
                <>
                    <h6 className="atmWallet">{title}</h6>
                    <span className="atmWalletAddress">{children}</span>
                </>
            )
        }
        {
            type === "number" && (
                <>
                    <h6 className="atmWallet">{title}</h6>
                    <span className="atmWalletNumber">{children}</span>
                </>
            )
        }
    </div>
  )
};

export default RowWallet;

RowWallet.propTypes = {
    type: PropTypes.string,
    title: PropTypes.number
};

RowWallet.defaultProps = {
    type: "number",
    title: "Row Title",
    children: 0
};                            