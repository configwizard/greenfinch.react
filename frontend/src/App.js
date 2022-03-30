import './App.css';
import React from "react";

import 'bootstrap/dist/css/bootstrap.min.css'; // Every page will use bootstrap
import 'bootstrap/dist/js/bootstrap.min.js'; // TEMP - fine for V1
import './assets/dashboard.scss'; //structural css
import './assets/greenfinch.scss'; //brand css
// import './assets/fontawesome.css';
// import { Tab, Tabs } from 'react-bootstrap';

import TabVisual from "./components/tabVisual";
// import TabJSON from "./components/tabJSON";
import Status from "./components/layoutHeader";
import CompToast from "./components/compToast";

// import Wallet from "./components/wallet";
// import Containers from "./components/containers";
// import Objects from "./components/objects";
// import Status from "./components/status";

// import FileSystem from "./components/filesystem";

//Actual
// import {getAccountInformation} from "./manager/manager.js"
// import {createContainer, listContainers} from "./manager/containers.js"
// import {listObjects, uploadObject, getObject} from "./manager/objects.js"
// import {retrieveFullFileSystem} from "./manager/interactions";

//Mocker
// import {getAccountInformation} from "./mocker/manager.js"
// import {createContainer, listContainers} from "./mocker/containers.js"
// import {listObjects, uploadObject, getObject} from "./mocker/objects.js"
//import {retrieveFullFileSystem} from "./mocker/interactions";

import {getAccountInformation, loadWallet, newWallet} from "./manager/manager.js"
import CompProgress from "./components/compProgress";
import {listContainers} from "./manager/containers";
import CompModalBrand from "./components/compModals/compModalBrand";
import {Form} from "react-bootstrap";


function prepareWalletData(account) {
    console.log("props.account", account)
    let clean = {
        neofs: {
            balance: account.neofs != undefined ? account.neofs.balance : 0,
            precision: account.neofs != undefined ? account.neofs.precision : 0
        },
        nep17: {
            GAS: {
                amount: account.nep17 != undefined ? account.nep17.GAS.amount : 0,
                meta: {
                    decimals: account.nep17 != undefined ? account.nep17.GAS.meta.decimals : 0,
                }
            },
            NEO: {
                amount: account.nep17 != undefined  ? account.nep17.NEO.amount : 0
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
        const walletData  = await getAccountInformation()
        const account = prepareWalletData(walletData)
        console.log("setting wallet details to ", account)
        await this.setState({account})

        window.runtime.EventsOn("fresh_wallet", async (newAccount) => {
            console.log("fresh_wallet response", newAccount)
            const walletData  = await getAccountInformation()
            const account = prepareWalletData(walletData)
            console.log("setting wallet details to ", account)
            await this.setState({account})
        })
    }

    fireToast(message) {
        console.log("making toast with ", message)
        window.go.manager.Manager.MakeToast(message)
    }

    setStatusAccount = async (account) => {
        await this.setState({account})
    }
    render() {
        console.log("propogating wallet", this.state.account)
        if (!this.state.account || this.state.account.address == "") { // if true then show the selection page
            return (<div className="col-12">
                <div className="orgContainersGrid">
                    <div className="row">
                        <CompModalBrand
                            title={"Get started"}>
                            <div className="d-flex flex-column align-items-center">
                                <p>Welcome to Greenfinch, to get started you will need a wallet.</p>
                                <p><b>Please first, enter the password you would like to use for the wallet</b></p>
                                <Form.Control id="walletPassword" type="password" placeholder="strong-password" />
                                <button
                                    type="button"
                                    className="atmButtonSimple"
                                    onClick={async () => {await newWallet(document.getElementById("walletPassword").value)}}>
                                    <i className="fas fa-star-shooting"/>Create new wallet
                                </button>
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
                        <TabVisual account={this.state.account}></TabVisual>
                    </section>
                    <CompToast autoDelete={true} autoDeleteTime={3000}></CompToast>
                    <CompProgress></CompProgress>
                </div>
            </>
        );
    }
}
export default App;
