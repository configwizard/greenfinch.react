import './App.css';
import React from 'react';

import 'bootstrap/dist/css/bootstrap.min.css'; // Every page will use bootstrap
import 'bootstrap/dist/js/bootstrap.min.js'; // TEMP - fine for V1
import './assets/dashboard.scss';
import './assets/greenfinch.scss';

import ButtonDefault from './components/a_atoms/ButtonDefault';
import Status from './components/a_organisms/Header';
import Artboard from './components/a_templates/Artboard';


// import CompToast from "./components/compToast";

// Actual
// import { getAccountInformation, loadWallet, newWallet } from "./manager/manager.js"

// Mocker
import { getAccountInformation, loadWallet, newWallet } from "./mocker/manager.js"

import CompProgress from "./components/compProgress";
import CompModalBrand from "./components/compModals/compModalBrand";
import {Form} from "react-bootstrap";

function prepareWalletData(account) {
    console.log("props.account", account)
    let clean = {
        neofs: {
            balance: account.neofs !== undefined ? account.neofs.balance : 0,
            precision: account.neofs !== undefined ? account.neofs.precision : 0
        },
        nep17: {
            GAS: {
                amount: account.nep17 !== undefined ? account.nep17.GAS.amount : 0,
                meta: {
                    decimals: account.nep17 !== undefined ? account.nep17.GAS.meta.decimals : 0,
                }
            },
            NEO: {
                amount: account.nep17 !== undefined  ? account.nep17.NEO.amount : 0
            }
        }
    }
    let b = clean.neofs.balance
    let p = clean.neofs.precision;
    let m = Math.pow(10,p);

    let gs = clean.nep17.GAS.amount
    let dp = clean.nep17.GAS.meta.decimals
    let ms = Math.pow(10,dp);

    let cleanBalances = {
        address: account.address,
        neoFSBalance: Number(b/m).toFixed(4),
        gasBalance: Number(gs/ms).toFixed(4),
        neoBalance: clean.nep17.NEO.amount
    }
    return cleanBalances
}
class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {account: null};
    }
    async componentDidMount() {
        const account = {
            address: 'WalletMocker',
            neoFSBalance: 4.3556,
            gasBalance: 8.8777,
            neoBalance: 15
        }
        await this.setState({account})
        /* 
        window.runtime.EventsOn("fresh_wallet", async (newAccount) => {
            console.log("fresh_wallet response", newAccount)
            const walletData  = await getAccountInformation()
            const account = prepareWalletData(walletData)
            console.log("setting wallet details to ", account)
            await this.setState({account})
        })
        */
        await this.setStatusAccount()
    }

    fireToast(message) {
        console.log("making toast with ", message)
        window.go.manager.Manager.MakeToast(message)
    }

    setStatusAccount = async () => {
        const walletData  = await getAccountInformation()
        const account = prepareWalletData(walletData)
        console.log("setting wallet details to ", account)
        await this.setState({account})
    }
    render() {
        console.log("propogating wallet", this.state.account)
        if (!this.state.account || this.state.account.address === "") { // if true then show the selection page
            return (
                <div className="col-12">
                <div className="orgContainersGrid">
                    <div className="row">
                        <CompModalBrand
                            title={"Get started"}>
                            <div className="d-flex flex-column align-items-center">
                                <p>Welcome to Greenfinch, to get started you will need a wallet.</p>
                                <p><strong>Please first, enter the password you would like to use for the wallet</strong></p>
                                <Form.Control id="walletPassword" type="password" placeholder="strong-password" />
                                <ButtonDefault
                                    buttonClass={"atmButtonDefault"}
                                    iconIncluded={true}
                                    iconClasses={"fas fa-star-shooting"} 
                                    text={"Create new wallet"}
                                    onClick={async () => {await newWallet(document.getElementById("walletPassword").value)}} 
                                />
                                <button
                                    type="button"
                                    className="atmButtonText"
                                    onClick={async () => {await loadWallet(document.getElementById("walletPassword").value)}}>
                                    <i className="fas fa-upload"/>Load existing wallet
                                </button>
                            </div>
                        </CompModalBrand>
                        {/*<NewWalletModal requestNewWallet={this.state.requestNewWallet} containerList={this.state.containerList} onDelete={this.onContainerDelete} viewMode={this.state.viewMode} onContainerSelection={this.onContainerSelection}></NewWalletModal>*/}
                    </div>
                </div>
                {/*
                    <CompToast autoDelete={true} autoDeleteTime={3000}></CompToast>
                */}
            </div>)
        }
        return (
            <>
                <section className="orgHeaderStatus">
                    <div className="molHeaderContent">
                        <Status account={this.state.account}></Status>
                    </div>
                </section>
                <div className="container-fluid">
                    <section className="orgMainJSON">
                        <Artboard account={this.state.account} refreshAccount={this.setStatusAccount}></Artboard>
                    </section>
                    {/*
                        <CompToast autoDelete={true} autoDeleteTime={3000}></CompToast>
                    */}
                    <CompProgress></CompProgress>
                </div>
            </>
        );
    }
}
export default App;
