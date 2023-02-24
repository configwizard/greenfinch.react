import React from 'react';

// Components
import ButtonText from '../../atoms/ButtonText';
import HeadingGeneral from '../../atoms/HeadingGeneral';
import HeaderPage from '../../organisms/HeaderPage';
import LoadWallet from '../../organisms/LoadWallet';
import { SectionHomepage, SectionSupport } from '../../organisms/HomeSections';

import {openInDefaultBrowser} from "../../../manager/manager";

// Central style sheet for templates
import '../_settings/style.scss';

function DonateButtonAction() {
    console.log("Donate Button clicked.")
}

const TemplateHome = ({ makeToast, account, recentWallets, refreshRecentWallets }) => {
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
                                        sectionTitle={"Get started"} />
                                    <SectionSupport
                                        titleLevel={"h3"}
                                        sectionTitle={"Help and support"} />
                                    <div>
                                        <HeadingGeneral 
                                            level={"h3"}
                                            isUppercase={false}
                                            text={"Create new wallet"} />
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
                                                    text={"Donations"}
                                                />            
                                                <p>For Greenfinch to grow, we need your support. Please consider donating today.</p>
                                                <div className="d-flex">
                                                    <div className="ms-auto">
                                                        <ButtonText 
                                                            type={"default"}
                                                            size={"medium"}
                                                            hasIcon={false}
                                                            text={"Donate"}
                                                            onClick={DonateButtonAction}/>  
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
