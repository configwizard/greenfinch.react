import React from 'react';
import { useModal } from '../../organisms/Modal/ModalContext';
// Actual
import { loadWallet, loadWalletWithPath, newWallet} from '../../../manager/manager.js'

// Components
import ButtonText from '../../atoms/ButtonText';
import HeadingGeneral from '../../atoms/HeadingGeneral';

import './style.scss';
import CompModalStandard from "../Modal/ModalStandard";
import {Form} from "react-bootstrap";


const LoadWallet = ({account, recentWallets}) => {
        const { setModal, unSetModal } = useModal()
        console.log("propogating wallet", account, recentWallets)
        return (
            <>
                <div className="section-wallet">
                    <div className="row">
                        <div className="col-2">
                            <i className="fas fa-3x fa-exclamation-triangle"/>
                        </div>
                        <div className="col-10">
                            <HeadingGeneral 
                                level={"h5"}
                                isUppercase={true}
                                text={"Get started"}
                            />            
                            <p>To use Greenfinch, a wallet is required. Either load up a previous wallet or create a new wallet now.</p>
                            <div className="d-flex">
                                <div className="ms-auto">
                                    <ButtonText 
                                        type={"default"}
                                        size={"medium"}
                                        hasIcon={false}
                                        text={"Load wallet"}
                                        onClick={
                                            () => {
                                                setModal(
                                                    <CompModalStandard
                                                        title={"Wallet Password"}
                                                        buttonTextPrimary={"Unlock"}
                                                        buttonTextSecondary={"Cancel"}
                                                        primaryClicked={async () => {await loadWallet(document.getElementById("loadWalletPassword").value); unSetModal()}}
                                                        secondaryClicked={async () => unSetModal()}>
                                                        <Form.Group className="form-div">
                                                            <Form.Label>Password</Form.Label>
                                                            <Form.Control id="loadWalletPassword" type="password" />
                                                        </Form.Group>
                                                    </CompModalStandard>)
                                            }}/>
                                    <ButtonText
                                        type={"default"}
                                        size={"medium"}
                                        hasIcon={false}
                                        text={"Create new wallet"}
                                        onClick={
                                            () => {
                                                setModal(
                                                    <CompModalStandard
                                                        title={"Wallet Password"}
                                                        buttonTextPrimary={"Create"}
                                                        buttonTextSecondary={"Cancel"}
                                                        primaryClicked={async () => {
                                                            if (document.getElementById("createWalletPassword").value === document.getElementById("createWalletPasswordMatch").value) {
                                                                await newWallet(document.getElementById("createWalletPassword").value)
                                                            }
                                                            unSetModal()
                                                        }}
                                                        secondaryClicked={async () => unSetModal()}>
                                                        <Form.Group className="form-div">
                                                            <Form.Label>Password</Form.Label>
                                                            <Form.Control id="createWalletPassword" type="password" />
                                                        </Form.Group>
                                                        <Form.Group className="form-div">
                                                            <Form.Label>Re-enter Password</Form.Label>
                                                            <Form.Control id="createWalletPasswordMatch" type="password" />
                                                        </Form.Group>
                                                    </CompModalStandard>)
                                            }}/>
                                </div>
                            </div>
                        </div>
                    </div>

                    
                </div>
                <div className="section-wallet">
                    <div className="row">
                        <div className="col-2">
                            <i className="fas fa-3x fa-wallet"/>
                        </div>
                        <div className="col-10">
                             <HeadingGeneral 
                                level={"h5"}
                                isUppercase={true}
                                text={"Recent wallets"} />
                            {
                                Object.keys(recentWallets.recentWallets).map(function(obj, ) {
                                    console.log("RECENT", obj, recentWallets.recentWallets[obj])
                                    //the absolute path is recentWallets.recentWallets[obj]
                                    const walletName = recentWallets.recentWallets[obj].split('/')[recentWallets.recentWallets[obj].split('/').length -1]
                                    return <div key={obj} className="d-flex align-items-center">
                                        <div className="wallet-name">
                                            {account && account.address == obj ? "current wallet" - walletName : walletName}
                                        </div>
                                        <div className="ms-auto">
                                            <ButtonText
                                                type="default"
                                                size="small"
                                                hasIcon={false}
                                                text={"Load wallet"}
                                                onClick={
                                                    () => {
                                                        setModal(
                                                            <CompModalStandard
                                                                title={"Wallet Password"}
                                                                buttonTextPrimary={"Load"}
                                                                buttonTextSecondary={"Cancel"}
                                                                primaryClicked={async () => {
                                                                    await loadWalletWithPath(document.getElementById("loadWalletFromPathPassword").value, recentWallets.recentWallets[obj])
                                                                    unSetModal()
                                                                    }
                                                                }
                                                                secondaryClicked={async () => unSetModal()}>
                                                                <Form.Group className="form-div">
                                                                    <Form.Label>Password</Form.Label>
                                                                    <Form.Control id="loadWalletFromPathPassword" type="password" />
                                                                </Form.Group>
                                                            </CompModalStandard>)
                                                    }}
                                            />
                                        </div>
                                    </div>
                                })
                            }
                        </div>
                    </div>
                </div>
            </>
        );
}

export default LoadWallet;
