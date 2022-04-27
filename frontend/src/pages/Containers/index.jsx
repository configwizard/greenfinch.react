import React from 'react';

import { Form } from 'react-bootstrap';

// Actual
import { getAccountInformation, loadWallet, newWallet } from '../../manager/manager.js'

// Mocker
// import { getAccountInformation, loadWallet, newWallet } from '../../mocker/manager.js'

// Components
import ButtonText from '../../components/atoms/ButtonText';
import ProgressBar from '../../components/molecules/ProgressBar';
import ToastMessage from '../../components/molecules/Toast';
import CompModalBrand from '../../components/organisms/Modal/ModalBrand';
import Containers from '../../components/templates/Containers';

class PageContainers extends React.Component {

    fireToast(message) {
        console.log("making toast with ", message)
        window.go.manager.Manager.MakeToast(message)
    }
    
    render() {
        console.log("propogating wallet", this.props.account)
        if (!this.props.account || this.props.account.address === "") { // if true then show the selection page
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
                <Containers account={this.props.account} refreshAccount={this.props.setStatusAccount}></Containers>
                <ToastMessage autoDelete={true} autoDeleteTime={3000}></ToastMessage>
                <ProgressBar></ProgressBar>
            </>
        );
    }
}
export default PageContainers;