import {copyTextToClipboard} from "../../../../manager/manager"
// Components
import React, { useState, useEffect } from 'react';

// Central style sheet for templates
import '../_settings/style.scss';
import HeadingGeneral from "../../../atoms/HeadingGeneral";
import RowWallet from "../../../atoms/RowWallet";
import {Form} from "react-bootstrap";
import ButtonText from "../../../atoms/ButtonText";
//import Tooltip from "../../../atoms/Tooltip";

const DrawerWallet = (props) => {
    console.log("drawer wallet props ", props.account)
    return (
        <>
        <div className="offcanvas offcanvas-start" tabIndex="-1" id="offcanvasLeft" aria-labelledby="offcanvasLeftLabel">
            <div className="offcanvas-header d-flex align-items-center">
                <h4 id="offcanvasLeftLabel"><i className="fas fa-lg fa-wallet"/>&nbsp;Wallet</h4>
                <button type="button" className="button-offcanvas" data-bs-dismiss="offcanvas" aria-label="Close"><i className="fas fa-lg fa-times"/></button>
            </div>
            <div className="offcanvas-body">
                <section className="molDrawerRow">
                    <RowWallet
                        type={"address"}
                        title={"Wallet address"}
                        value={props.account.address} />
                    <RowWallet
                        type={"address"}
                        title={"Public Key"}
                        value={props.account.publicKey} />
                </section>
                <section className="molDrawerRow">
                    <RowWallet
                        type={"number"}
                        title={"NeoFS GAS balance"}
                        value={props.account.neoFSBalance} />
                    <RowWallet
                        type={"number"}
                        title={"Neo balance"}
                        value={props.account.neoBalance} />
                    <RowWallet
                        type={"number"}
                        title={"GAS balance"}
                        value={props.account.gasBalance} />
                        <ButtonText 
                            type="default"
                            size="small"
                            onClick={() => props.refreshAccount()}
                            text={"Refresh balance"}
                            faClass={"fas fa-sync-alt"} />
                </section>
                <section className="molDrawerRow">
                    {/* <h6 className="atmWallet">Top-up NeoFS GAS Balance</h6> */}
                    <HeadingGeneral
                        level={"h6"}
                        isUppercase={true}
                        text={"Top-up NeoFS GAS Balance"} />
                    <Form.Group className="form-div">
                        <Form.Control type="number" placeholder="GAS amount" id={"topUpAmount"}/>
                    </Form.Group>
                    <ButtonText
                        type="default"
                        size="medium"
                        hasIcon={true}
                        faClass={"fas fa-chart-line"}
                        text={"Top-up"}
                        onClick={(amount) => {console.log("topping up"); props.topUpWallet(document.getElementById("topUpAmount").value);}} />
                </section>
            </div>
        </div>
    </>
    )
}

export default DrawerWallet;
