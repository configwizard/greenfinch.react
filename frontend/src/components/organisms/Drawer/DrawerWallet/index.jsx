import React from 'react';
import {copyTextToClipboard} from "../../../../manager/manager"
// Components

// Central style sheet for templates
import '../_settings/style.scss';
import HeadingGeneral from "../../../atoms/HeadingGeneral";
import RowWallet from "../../../atoms/RowWallet";
import {Form} from "react-bootstrap";
import ButtonText from "../../../atoms/ButtonText";
import Tooltip from "../../../atoms/Tooltip";

const DrawerWallet = (props) => {
    console.log("drawer wallet props ", props.account)
    return (
        <>
        <div className="offcanvas offcanvas-end" tabIndex="-1" id="offcanvasRight" aria-labelledby="offcanvasRightLabel">
            <div className="offcanvas-header d-flex align-items-center">
                <h4 id="offcanvasRightLabel"><i className="fas fa-lg fa-wallet"/>&nbsp;Wallet</h4>
                <button type="button" className="atmButtonIconClean" data-bs-dismiss="offcanvas" aria-label="Close"><i className="fas fa-times"/></button>
            </div>
            <div className="offcanvas-body">
                <section className="wallet-body">
                    {/*<RowWallet*/}
                    {/*    type={"address"}*/}
                    {/*    title={"Wallet address"}*/}
                    {/*    children={props.account.address} />*/}
                    <Tooltip content="Copy your wallet address" direction="bottom">
                        <ButtonText
                            size={"small"}
                            type={"clean"}
                            hasIcon={false}
                            text={props.account.address}
                            onClick={() => {copyTextToClipboard(props.account.address)}}/>
                    </Tooltip>
                    <Tooltip content="Copy your public key" direction="bottom">
                        <ButtonText
                            size={"small"}
                            type={"clean"}
                            hasIcon={false}
                            text={props.account.publicKey}
                            onClick={() => {copyTextToClipboard(props.account.publicKey)}}/>
                    </Tooltip>
                    <RowWallet
                        type={"number"}
                        title={"NeoFS GAS balance"}
                        children={props.account.neoFSBalance} />
                    <RowWallet
                        type={"number"}
                        title={"Neo balance"}
                        children={props.account.neoBalance} />
                    <RowWallet
                        type={"number"}
                        title={"GAS balance"}
                        children={props.account.gasBalance} />
                </section>
                <section className="wallet-footer">
                    {/* <h6 className="atmWallet">Top-up NeoFS GAS Balance</h6> */}
                    <HeadingGeneral
                        level={"h6"}
                        isUppercase={true}
                        text={"Top-up NeoFS GAS Balance"} />
                    <Form.Control type="number" placeholder="GAS amount" id={"topUpAmount"}/>
                    <ButtonText
                        type="default"
                        size="medium"
                        hasIcon={true}
                        faClass={"fas fa-chart-line"}
                        text={"Top-up"}
                        onClick={(amount) => {console.log("topping up"); props.topUpWallet(document.getElementById("topUpAmount").value)}} />
                </section>
            </div>
        </div>
    </>
    )
}

export default DrawerWallet;
