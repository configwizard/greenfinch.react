import React from 'react';
import { Form } from 'react-bootstrap';

// Components
import ButtonText from '../../atoms/ButtonText';
import HeadingGeneral from '../../atoms/HeadingGeneral';
import RowWallet from '../../atoms/RowWallet';

import './style.scss';

const Wallet = props => {
    if (!props.show) {
        return null
    }
    return (
        <section className="org-wallet">
            <div onClick={e => e.stopPropagation()}>
                    <section className="wallet-header d-flex align-items-center">
                        <div>
                            {/* <h4 className="atmWalletTitle">Wallet</h4> */}
                            <HeadingGeneral 
                                level={"h4"}
                                isUppercase={true}
                                text={"Wallet"} />
                        </div>
                        <div className="ms-auto">
                            <i className="far fa-times" onClick={props.onClose}/>
                        </div>
                    </section>
                    <section className="wallet-body">
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
        </section>
    )
}

export default Wallet;
