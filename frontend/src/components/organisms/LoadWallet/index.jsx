import React from 'react';
import { useModal } from '../../organisms/Modal/ModalContext';
// Actual
import {
    loadWallet,
    loadWalletWithoutPassword,
    loadWalletWithPath,
    newWallet,
    newWalletFromWIF,
    saveWalletWithoutPassword
} from '../../../manager/manager.js'

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
                        <i className="fa-3x fa-sharp fa-solid fa-triangle-exclamation"/>
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
                                    isDisabled={false}
                                    onClick={
                                        async () => {
                                            try {
                                                let walletPath = await loadWalletWithoutPassword()
                                                if (walletPath === "") return
                                                setModal(
                                                    <CompModalStandard
                                                        title={"Wallet Password"}
                                                        buttonTextPrimary={"Locate wallet"}
                                                        buttonTextSecondary={"Cancel"}
                                                        primaryClicked={async () => {
                                                            console.log("waiting to load wallet with path ", walletPath)
                                                            await loadWalletWithPath(document.getElementById("loadWalletPassword").value, walletPath);
                                                            await unSetModal()
                                                            await refreshRecentWallets()
                                                        }}
                                                        secondaryClicked={async () => unSetModal()}>
                                                        <Form.Group className="form-div">
                                                            <Form.Label>Enter password for existing wallet:</Form.Label>
                                                            <Form.Control id="loadWalletPassword" type="password" placeholder="Password" />
                                                        </Form.Group>
                                                    </CompModalStandard>)
                                            } catch (e) {
                                                console.log("error loading wallet path ", e)
                                            }
                                        }}/>
                                <ButtonText
                                    type={"default"}
                                    size={"medium"}
                                    hasIcon={false}
                                    text={"Create new wallet"}
                                    isDisabled={false}
                                    onClick={
                                        async () => {
                                            try {
                                                let walletPath = await saveWalletWithoutPassword()
                                                if (walletPath === "") return
                                            setModal(
                                                <CompModalStandard
                                                    title={"Wallet Password"}
                                                    buttonTextPrimary={"Create"}
                                                    buttonTextSecondary={"Cancel"}
                                                    primaryClicked={async () => {
                                                        if (document.getElementById("createWalletPassword").value === document.getElementById("createWalletPasswordMatch").value) {
                                                            await newWallet(document.getElementById("createWalletPassword").value, walletPath)
                                                        } else {
                                                            alert("passwords do no match")
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
                                            } catch (e) {
                                                console.log("error loading wallet path ", e)
                                            }
                                        }}/>
                                <ButtonText
                                    type={"default"}
                                    size={"medium"}
                                    hasIcon={false}
                                    text={"Create a wallet from WIF"}
                                    isDisabled={false}
                                    onClick={
                                        async () => {
                                            try {
                                                let walletPath = await saveWalletWithoutPassword()
                                                if (walletPath === "") return
                                                setModal(
                                                    <CompModalStandard
                                                        title={"Wallet Password"}
                                                        buttonTextPrimary={"Create"}
                                                        buttonTextSecondary={"Cancel"}
                                                        primaryClicked={async () => {
                                                            if (document.getElementById("createWalletPassword").value === document.getElementById("createWalletPasswordMatch").value) {
                                                                await newWalletFromWIF(document.getElementById("createWalletPassword").value, document.getElementById("createWalletFromWIF").value, walletPath)
                                                            } else {
                                                                alert("passwords do no match")
                                                            }
                                                            await unSetModal()
                                                            await refreshRecentWallets()
                                                        }}
                                                        secondaryClicked={async () => unSetModal()}>
                                                        <Form.Group className="form-div">
                                                            <Form.Label>Enter your WIF</Form.Label>
                                                            <Form.Control id="createWalletFromWIF" type="password" placeholder="WIF" />
                                                        </Form.Group>
                                                        <Form.Group className="form-div">
                                                            <Form.Label>To create a new wallet, you will need a password:</Form.Label>
                                                            <Form.Control id="createWalletPassword" type="password" placeholder="Password" />
                                                        </Form.Group>
                                                        <Form.Group className="form-div">
                                                            <Form.Label>Re-enter password to confirm:</Form.Label>
                                                            <Form.Control id="createWalletPasswordMatch" type="password" placeholder="Password" />
                                                        </Form.Group>
                                                    </CompModalStandard>)
                                            } catch (e) {
                                                console.log("error loading wallet path ", e)
                                            }
                                        }}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="section-wallet">
                <div className="row">
                    <div className="col-2">
                        <i className="fa-3x fa-sharp fa-solid fa-wallet"/>
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
                                    const walletName = recentWallets[obj].Name//recentWallets[obj].split('/')[recentWallets[obj].split('/').length -1]
                                    return <div key={obj} className="wallet-recent d-flex align-items-center">
                                        <div className="wallet-name">
                                            {walletName}
                                        </div>
                                        {account && account.address === obj ? <div className="wallet-tag">active</div> : null}
                                        <div className="ms-auto">
                                            {/*
                                            <ButtonText
                                                type="secondary"
                                                size="small"
                                                hasIcon={false}
                                                text={"Forget wallet"}
                                                isDisabled={false}
                                                // empty onClick
                                            />
                                            */}
                                            <ButtonText
                                                type="default"
                                                size="small" 
                                                hasIcon={false}
                                                text={"Load wallet"}
                                                isDisabled={false}
                                                onClick={
                                                    () => {
                                                        setModal(
                                                            <CompModalStandard
                                                                title={"Load recent wallet"}
                                                                buttonTextPrimary={"Confirm"}
                                                                buttonTextSecondary={"Cancel"}
                                                                primaryClicked={async () => {
                                                                    loadWalletWithPath(document.getElementById("loadWalletFromPathPassword").value, recentWallets[obj].Path)
                                                                    await unSetModal()
                                                                    }
                                                                }
                                                                secondaryClicked={async () => unSetModal()}>
                                                                <Form.Group className="form-div">
                                                                    <Form.Label>To load a recent wallet, enter wallet password:</Form.Label>
                                                                    <Form.Control id="loadWalletFromPathPassword" type="password" placeholder="Password" />
                                                                </Form.Group>
                                                            </CompModalStandard>)
                                                    }}
                                            />
                                        </div>
                                    </div>
                                }) : <p>There are no recent wallets to load.</p>
                            }
                    </div>
                </div>
            </div>
        </>
    );
}

export default LoadWallet;
