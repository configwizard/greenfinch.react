import React from 'react';
import { Form } from "react-bootstrap";

// Components
import ButtonText from "../../../atoms/ButtonText";
import HeadingGeneral from "../../../atoms/HeadingGeneral";
import InfoBox from "../../../atoms/InfoBox";
import RowWallet from "../../../atoms/RowWallet";

// Central style sheet for templates
import '../_settings/style.scss';

const DrawerWallet = (props) => {
    console.log("drawer wallet props ", props.account)
    return (
        <>
        <div className="offcanvas offcanvas-start" tabIndex="-1" id="offcanvasLeft" aria-labelledby="offcanvasLeftLabel">
            <div className="offcanvas-header d-flex align-items-center">
                <h4 id="offcanvasLeftLabel"><i className="fa-sharp fa-solid fa-wallet"/>&nbsp;Wallet</h4>
                <button type="button" className="button-offcanvas" data-bs-dismiss="offcanvas" aria-label="Close"><i className="fa-sharp fa-solid fa-xmark"/></button>
            </div>
            <div className="offcanvas-body">
                {props.account.address ?
                    null
                    :  
                    <InfoBox
                        type="info"
                        text={"There is currently no wallet loaded. Please load a wallet to continue."} />
                }
                <section className="molDrawerRow">
                    <RowWallet
                        type={"address"}
                        title={"Wallet address"}
                        value={props.account.address ? props.account.address : "- -"} />
                    <RowWallet
                        type={"address"}
                        title={"Public Key"}
                        value={props.account.publicKey ? props.account.publicKey : "- -"} />
                </section>
                <section className="molDrawerRow">
                    <RowWallet
                        type={"number"}
                        title={"NeoFS GAS balance"}
                        value={props.account.neoFSBalance ? props.account.neoFSBalance : "- -"} />
                    <RowWallet
                        type={"number"}
                        title={"Neo balance"}
                        value={props.account.neoBalance ? props.account.neoBalance : "- -"} />
                    <RowWallet
                        type={"number"}
                        title={"GAS balance"}
                        value={props.account.gasBalance ? props.account.gasBalance : "- -"} />
                        <ButtonText 
                            type="default"
                            size="small"
                            onClick={() => props.refreshAccount()}
                            isDisabled={props.account.address ? false : true }
                            text={"Refresh balance"}
                            faClass={"fa-sharp fa-solid fa-rotate"} />
                </section>
                <section className="molDrawerRow">
                    <HeadingGeneral
                        level={"h6"}
                        isUppercase={true}
                        text={"Top-up NeoFS GAS Balance"} />
                    <Form.Group className="form-div">
                        <Form.Control 
                            type="number"
                            disabled={props.account.address ? false : true }
                            placeholder="GAS amount" 
                            id={"topUpAmount"}/>
                    </Form.Group>
                    <ButtonText
                        type="default"
                        size="medium"
                        hasIcon={true}
                        faClass={"fa-sharp fa-solid fa-chart-line"}
                        isDisabled={props.account.address ? false : true }
                        text={"Top-up"}
                        onClick={(amount) => {console.log("topping up"); props.topUpWallet(document.getElementById("topUpAmount").value);}} />
                </section>
            </div>
        </div>
    </>
    )
}

export default DrawerWallet;
