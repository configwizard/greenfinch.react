import React from "react";

const CompWallet = props => {

    if (!props.show) {
        return null
    }

    console.log("props.account", props.account)
    if (
        (props.account.nep17 === undefined) ||
        (props.account.nep17.GAS === undefined) ||
        (props.account.nep17.GAS.meta === undefined) ||
        (props.account.nep17.NEO === undefined)) {
        console.log("Waiting...");
        return(<div>Waiting...</div>)
    }
    //TODO: Don't think you need Number()
    let b = Number((props.account.neofs.balance));
    let p = Number((props.account.neofs.precision));
    let m = Math.pow(10,p);
    let neoFSBalance = Number(b/m).toFixed(4);

    let gs = Number((props.account.nep17.GAS.amount));
    let dp = Number((props.account.nep17.GAS.meta.decimals));
    let ms = Math.pow(10,dp);
    let gasBalance = Number(gs/ms).toFixed(4); //TODO: Check that this is 10 to the power...

    let neoBalance = props.account.nep17.NEO.amount
    // /* Helpful: https://medium.com/tinyso/how-to-create-a-modal-component-in-react-from-basic-to-advanced-a3357a2a716a */
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
                            <h5 className="atmWalletTitle">{props.account.address}</h5>
                            <div className="ms-auto">
                                <button type="button" className="atmButtonIconClean" onClick=""><i className="far fa-clone"/></button>
                            </div>
                        </div>
                        <div className="d-flex align-items-center">
                            <h4 className="atmWalletTitle">NeoFS Gas balance-</h4>
                            <h5 className="atmWalletTitle">{neoFSBalance}</h5>
                        </div>
                        <div className="d-flex align-items-center">
                            <h4 className="atmWalletTitle">Neo balance-</h4>
                            <h5 className="atmWalletTitle">{neoBalance}</h5>
                        </div>
                        <div className="d-flex align-items-center">
                            <h4 className="atmWalletTitle">Neo Gas balance-</h4>
                            <h5 className="atmWalletTitle">{gasBalance}</h5>
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
