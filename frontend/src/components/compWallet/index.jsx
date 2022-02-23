import React from "react";

const CompWallet = props => {

    if (!props.show) {
        return null
    }
    
    /* Helpful: https://medium.com/tinyso/how-to-create-a-modal-component-in-react-from-basic-to-advanced-a3357a2a716a */
    return ( 
        <div className="utTest" onClick={props.onClose}>
            <div className="molWallet" onClick={e => e.stopPropagation()}>
                <div className="molWalletContainer">
                    <h4>Title</h4>
                    <p>Wallet</p>
                </div>
            </div>
        </div>
    )
}

export default CompWallet;
