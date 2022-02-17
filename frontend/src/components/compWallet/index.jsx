import React from "react";

const CompWallet = props => {
    if (!props.show) {
        return null
    }
    /* Helpful: https://medium.com/tinyso/how-to-create-a-modal-component-in-react-from-basic-to-advanced-a3357a2a716a */
    return ( 
        <div className="molWallet">
            <div className="molWalletContainer">
                <h4>Title</h4>
                <p>Wallet</p>
            </div>
        </div>
    )
}

export default CompWallet;
