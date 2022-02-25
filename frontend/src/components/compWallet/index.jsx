import React from "react";

const CompWallet = props => {

    if (!props.show) {
        return null
    }
    
    /* Helpful: https://medium.com/tinyso/how-to-create-a-modal-component-in-react-from-basic-to-advanced-a3357a2a716a */
    return ( 
        <div className="utTest">
            <div className="molWallet" onClick={e => e.stopPropagation()}>
                <div className="molWalletContainer">
                    <section>
                        <div className="d-flex align-items-right">
                            <i className="far fa-times" style={{"color":"red"}} onClick={props.onClose}/>
                        </div>
                    </section>
                    <section>
                        <div className="d-flex align-items-center">
                            <h4 className="atmWalletTitle">Wallet address</h4>
                            <div className="ms-auto">
                                <button type="button" className="atmButtonIconClean" onClick=""><i className="far fa-clone"/></button>    
                            </div>
                        </div>
                        <div className="d-flex align-items-center">
                            <h4 className="atmWalletTitle">--- Public key ---</h4>
                            <div className="ms-auto">
                                <button type="button" className="atmButtonIconClean" onClick=""><i className="far fa-clone"/></button>
                            </div>
                        </div>
                    </section>
                    <section>
                        <div>
                            <h5>Top-up</h5>
                            <button type="button" className="atmButtonBase atmButtonSimple" onClick=""><i className="fas fa-chart-line"/>Top-up NeoFS Balance</button>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    )
}

export default CompWallet;
