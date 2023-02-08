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


const LoadWallet = ({account, recentWallets, refreshRecentWallets}) => {
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
                            <p>To use Greenfinch, a wallet is required. Either load an exisiting wallet or create a new wallet.</p>
                            <div className="d-flex">
                                <div className="ms-auto">
                                    <ButtonText 
                                        type={"default"}
                                        size={"medium"}
                                        hasIcon={false}
                                        text={"Load existing wallet"}
                                        onClick={
                                            () => {
                                                setModal(
                                                    <CompModalStandard
                                                        title={"Wallet Password"}
                                                        buttonTextPrimary={"Locate wallet"}
                                                        buttonTextSecondary={"Cancel"}
                                                        primaryClicked={async () => {
                                                            await loadWallet(document.getElementById("loadWalletPassword").value);
                                                            await unSetModal()
                                                            await refreshRecentWallets()
                                                        }}
                                                        secondaryClicked={async () => unSetModal()}>
                                                        <Form.Group className="form-div">
                                                            <Form.Label>Enter password for existing wallet:</Form.Label>
                                                            <Form.Control id="loadWalletPassword" type="password" placeholder="Password" />
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
                                                            await unSetModal()
                                                            await refreshRecentWallets()
                                                        }}
                                                        secondaryClicked={async () => unSetModal()}>
                                                        <Form.Group className="form-div">
                                                            <Form.Label>To create a new wallet, you will need a password:</Form.Label>
                                                            <Form.Control id="createWalletPassword" type="password" placeholder="Password" />
                                                        </Form.Group>
                                                        <Form.Group className="form-div">
                                                            <Form.Label>Re-enter password to confirm:</Form.Label>
                                                            <Form.Control id="createWalletPasswordMatch" type="password" placeholder="Password" />
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
                                    recentWallets ? Object.keys(recentWallets).map(function(obj, ) {
                                        console.log("RECENT", obj, recentWallets[obj])
                                        //the absolute path is recentWallets[obj]
                                        const walletName = recentWallets[obj].split('/')[recentWallets[obj].split('/').length -1]
                                        return <div key={obj} className="wallet-recent d-flex align-items-center">
                                            <div className="wallet-name">
                                                {walletName}
                                            </div>
                                            {account && account.address === obj ? <div className="wallet-tag">active</div> : ''}
                                            <div className="ms-auto">
                                                <ButtonText
                                                    type="default"
                                                    size="small"
                                                    hasIcon={false}
                                                    text={"Load this wallet"}
                                                    onClick={
                                                        () => {
                                                            setModal(
                                                                <CompModalStandard
                                                                    title={"Load recent wallet"}
                                                                    buttonTextPrimary={"Confirm"}
                                                                    buttonTextSecondary={"Cancel"}
                                                                    primaryClicked={async () => {
                                                                        loadWalletWithPath(document.getElementById("loadWalletFromPathPassword").value, recentWallets[obj])
                                                                        await unSetModal()
                                                                        }
                                                                    }
                                                                    secondaryClicked={async () => unSetModal()}>
                                                                    <Form.Group className="form-div">
                                                                        <Form.Label>Enter wallet password for <strong>{walletName}</strong>:</Form.Label>
                                                                        <Form.Control id="loadWalletFromPathPassword" type="password" placeholder="Password" />
                                                                    </Form.Group>
                                                                </CompModalStandard>)
                                                        }}
                                                />
                                            </div>
                                        </div>
                                    }) : null
                                }
                        </div>
                    </div>
                </div>
            </>
        );
}

export default LoadWallet;
