import React from 'react';
import { Form } from "react-bootstrap";
import {transferGasToContact, copyTextToClipboard, makeCopyToast} from "../../../manager/manager.js"

// Components
import ButtonText from '../../atoms/ButtonText';
import HeadingGeneral from '../../atoms/HeadingGeneral';
import HeaderPage from '../../organisms/HeaderPage';
import LoadWallet from '../../organisms/LoadWallet';
import { SectionHomepage, SectionSupport } from '../../organisms/HomeSections';

import {openInDefaultBrowser} from "../../../manager/manager";

// Central style sheet for templates
import '../_settings/style.scss';

const TemplateHome = ({ account, recentWallets, refreshRecentWallets, selectedNetwork, walletId }) => {
    let walletDonation = "Nfv6SYe5QiAxpeSzpy11NWKyoyDSHp47f1"
    console.log("NETWORK", selectedNetwork);
    return (
        <div className="templatePage d-flex flex-column flex-grow-1">
            <div className="row">
                <div className="col-12">
                    <HeaderPage 
                        pageTitle={"Welcome to Greenfinch"} 
                        hasButton={false} />
                    <div className="row">
                        <div className="col-6">
                            <div className="templateWrapper">
                                <div className="templateInner">
                                    <SectionHomepage
                                        titleLevel={"h3"}
                                        sectionTitle={"Quick links"} />
                                    <SectionSupport
                                        titleLevel={"h3"}
                                        sectionTitle={"Help and support"} />
                                    <div>
                                        <HeadingGeneral 
                                            level={"h3"}
                                            isUppercase={false}
                                            text={"Get started on Testnet"} />
                                        <ol className="home-ol">
                                            <li>Click &lsquo;Create new wallet&rsquo;</li>
                                            <li>Copy your wallet address (starting with 'N')</li>
                                            <li>Go to the <button onClick={() => openInDefaultBrowser("https://neowish.ngd.network/#/")}>N3 TestNet Faucet</button></li>
                                            <li>Input your N3 address</li>
                                            <li>Verify account via GitHub and ReCaptcha</li>
                                            <li>In Greenfinch, open your wallet (<i className="fa-sharp fa-regular fa-wallet"/>), transfer some GAS to NeoFS</li>
                                        </ol>
                                        <p className="home-sm">N.B. The N3 TestNet Faucet page provides 50 NEO and 50 GAS from testnet for one NEO address and one IP address every 24 hours.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="templateWrapper">
                                <div className="templateInner">

                                    <div className="d-flex">
                                        <div>
                                            <HeadingGeneral 
                                                level={"h3"}
                                                isUppercase={false}
                                                text={"Support Greenfinch"} />
                                        </div>
                                    </div>
                                    <div className="section-wallet">
                                        <div className="row">
                                            <div className="col-2">
                                                <i className="fa-3x fa-sharp fa-solid fa-hand-holding-dollar"/>
                                            </div>
                                            <div className="col-10">
                                                <HeadingGeneral 
                                                    level={"h5"}
                                                    isUppercase={true}
                                                    text={"Donations"}/>            
                                                { 
                                                    selectedNetwork !== null && selectedNetwork.Name === "Main Net" ? 
                                                        <p>For Greenfinch to grow, we need your support. Please consider donating today. Alternatively send donations direct to our wallet address below.</p>
                                                    : 
                                                    <p>Please switch to Main Net to make valuable donations to the team.</p>
                                                }
                                                <Form.Group className="form-div">
                                                    <Form.Control 
                                                        type="number"
                                                        disabled={selectedNetwork !== null && selectedNetwork.Name === "Main Net" && account.address ? false : true }
                                                        placeholder="e.g 10 GAS" 
                                                        id={"donateAmount"}/>
                                                </Form.Group>
                                                <div className="d-flex align-items-center">
                                                    <div className="atmWalletDonation">
                                                    { 
                                                        selectedNetwork !== null && selectedNetwork.Name === "Main Net" ? 
                                                        <>
                                                            <i className="fa-sharp fa-solid fa-wallet"/>
                                                            <span className="utCopyable" onClick={() => {copyTextToClipboard(walletDonation); makeCopyToast("Copied to clipboard")}}>{walletDonation}</span>
                                                        </>
                                                        : null
                                                    }
                                                    </div>
                                                    <div className="ms-auto">
                                                        <ButtonText 
                                                            type={"default"}
                                                            size={"medium"}
                                                            hasIcon={false}
                                                            text={"Donate"}
                                                            isDisabled={selectedNetwork !== null && selectedNetwork.Name === "Main Net" && account.address ? false : true }
                                                            onClick={async () => {await transferGasToContact({walletDonation}, document.getElementById("donateAmount").value);}}/>  
                                                    </div>
                                                </div>
                                        </div>
                                        </div>
                                    </div>

                                    <div className="d-flex">
                                        <div>
                                            <HeadingGeneral 
                                                level={"h3"}
                                                isUppercase={false}
                                                text={"Wallet management"} />
                                        </div>
                                    </div>   
                                    <LoadWallet
                                        account={account}
                                        walletId={walletId}
                                        recentWallets={recentWallets}
                                        refreshRecentWallets={refreshRecentWallets} />
                                </div>
                            </div>
                        </div>
                    </div>
                        
                </div>
            </div>
        </div>
    );
}

export default TemplateHome;
