import React from 'react';
import { Form } from 'react-bootstrap';

import ButtonDefault from '../../a_atoms/ButtonDefault';
import HeadingGeneral from '../../a_atoms/HeadingGeneral';
import RowWallet from '../../a_atoms/RowWallet';

import './style.scss';

const Wallet = props => {
    if (!props.show) {
        return null
    }
    return (
        <div>
            <div className="molWallet" onClick={e => e.stopPropagation()}>
                <div className="molWalletContainer">
                    <section className="WalletHeader d-flex align-items-center">
                        <div>
                            {/* <h4 className="atmWalletTitle">Wallet</h4> */}
                            <HeadingGeneral 
                                level={"h4"}
                                isUppercase={true}
                                children={"Wallet"} />
                        </div>
                        <div className="ms-auto">
                            <i className="far fa-times" onClick={props.onClose}/>
                        </div>
                    </section>
                    <section className="WalletBody">
                        <RowWallet
                            type={"address"}
                            title={"Wallet address"}
                            children={props.account.address} />
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
                    <section className="WalletFooter">
                        {/*  <h6 className="atmWallet">Top-up NeoFS GAS Balance</h6> */}
                        <HeadingGeneral 
                            level={"h6"}
                            isUppercase={true}
                            children={"Top-up NeoFS GAS Balance"} />
                        <Form.Control type="number" placeholder="GAS amount" id={"topUpAmount"}/>
                        <ButtonDefault 
                            buttonClass={"atmButtonDefault"}
                            iconIncluded={true}
                            iconClasses={"fas fa-chart-line"}
                            text={"Top-up"}
                            onClick={(amount) => {console.log("topping up"); props.topUpWallet(document.getElementById("topUpAmount").value)}} />
                    </section>
                </div>
            </div>
        </div>
    )
}

export default Wallet;
