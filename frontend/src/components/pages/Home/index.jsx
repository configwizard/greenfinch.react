import React from 'react';
import './style.scss';

import { Form } from 'react-bootstrap';

// Actual
import { getAccountInformation, loadWallet, newWallet } from '../../../manager/manager.js'

// Mocker
// import { getAccountInformation, loadWallet, newWallet } from '../../../mocker/manager.js'

// Components
import ButtonText from '../../atoms/ButtonText';
import ProgressBar from '../../molecules/ProgressBar';
import ToastMessage from '../../molecules/Toast';
import CompModalBrand from '../../organisms/Modal/ModalBrand';
import Artboard from '../../templates/Artboard';

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
class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {account: null};
    }
    async componentDidMount() {
        window.runtime.EventsOn("fresh_wallet", async (newAccount) => {
            console.log("fresh_wallet response", newAccount)
            const walletData  = await getAccountInformation()
            const account = prepareWalletData(walletData)
            console.log("setting wallet details to ", account)
            await this.setState({account})
        })
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
                                    <p><strong>Please first, enter the password you would like to use for the wallet.</strong></p>
                                    <Form.Control id="walletPassword" type="password" placeholder="strong-password" />
                                    <ButtonText
                                        buttonClass={"atmButtonText"}
                                        hasIcon={true}
                                        faClass={"fas fa-star-shooting"} 
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
                    <ToastMessage autoDelete={true} autoDeleteTime={3000}></ToastMessage>
                </div>
            )
        }
        return (
            <>
            <Artboard account={this.state.account} refreshAccount={this.setStatusAccount}></Artboard>
            <ToastMessage autoDelete={true} autoDeleteTime={3000}></ToastMessage>
            <ProgressBar></ProgressBar>
            </>
        );
    }
}
export default Home;