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
                    <section className="orgWalletHeader d-flex">
                        <div>
                            <h4 className="atmWalletTitle">Wallet</h4>
                        </div>
                        <div className="ms-auto">
                            <i className="far fa-times" style={{"color":"red"}} onClick={props.onClose}/>
                        </div>
                    </section>
                    <section className="orgWalletBody">
                        <div className="molWalletOption">
                            <h6 className="atmWallet">Wallet address</h6>
                            <span className="atmWalletAddress">{props.account.address}</span>
                            {/* <div className="ms-auto">
                                <button type="button" className="atmButtonIconClean" onClick=""><i className="far fa-clone"/></button>
                            </div> */}
                        </div>
                        <div className="molWalletOption">
                            <h6 className="atmWallet">NeoFS Gas balance</h6>
                            <span className="atmWalletNumber">{neoFSBalance}</span>
                        </div>
                        <div className="molWalletOption">
                            <h6 className="atmWallet">Neo balance</h6>
                            <span className="atmWalletNumber">{neoBalance}</span>
                        </div>
                        <div className="molWalletOption">
                            <h6 className="atmWallet">Neo Gas balance</h6>
                            <span className="atmWalletNumber">{gasBalance}</span>
                        </div>
                    </section>
                    <section className="orgWalletFooter">
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
