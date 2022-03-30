import React from "react";
import { Form } from "react-bootstrap";

const CompWallet = props => {
    if (!props.show) {
        return null
    }


    // /* Helpful: https://medium.com/tinyso/how-to-create-a-modal-component-in-react-from-basic-to-advanced-a3357a2a716a */
    return (
        <div>
            <div className="molWallet" onClick={e => e.stopPropagation()}>
                <div className="molWalletContainer">
                    <section className="orgWalletHeader d-flex align-items-center">
                        <div>
                            <h4 className="atmWalletTitle">Wallet</h4>
                        </div>
                        <div className="ms-auto">
                            <i className="far fa-times" onClick={props.onClose}/>
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
                            <h6 className="atmWallet">NeoFS GAS balance</h6>
                            <span className="atmWalletNumber">{props.account.neoFSBalance}</span>
                        </div>
                        <div className="molWalletOption">
                            <h6 className="atmWallet">Neo balance</h6>
                            <span className="atmWalletNumber">{props.account.neoBalance}</span>
                        </div>
                        <div className="molWalletOption">
                            <h6 className="atmWallet">GAS balance</h6>
                            <span className="atmWalletNumber">{props.account.gasBalance}</span>
                        </div>
                    </section>
                    <section className="orgWalletFooter">
                        <div className="molWalletOption">
                            <h6 className="atmWallet">Top-up NeoFS GAS Balance</h6>
                            <Form.Control type="number" placeholder="GAS amount" id={"topUpAmount"}/>
                            <button type="button" className="atmButtonBase atmButtonSimple" onClick={(amount) => {console.log("topping up"); props.topUpWallet(document.getElementById("topUpAmount").value)}}><i className="fas fa-chart-line"/>Top-up</button>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    )
}

export default CompWallet;
