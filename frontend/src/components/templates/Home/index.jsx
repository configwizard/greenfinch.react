import React from 'react';

// Components
import HeadingGeneral from '../../atoms/HeadingGeneral';
import HeaderPage from '../../organisms/HeaderPage';
import LoadWallet from '../../organisms/LoadWallet';
import {SectionHomepage, SectionSupport} from '../../organisms/HomeSections';

// Central style sheet for templates
import '../_settings/style.scss';

const TemplateHome = ({ account, recentWallets }) => {
    return (
        <div class="templatePage d-flex flex-column flex-grow-1">
            <div class="row">
                <div className="col-12">
                    <HeaderPage 
                        pageTitle={"Welcome to Greenfinch"} 
                        hasButton={false}/>
                    <div class="row">
                        <div class="col-6">
                            <div className="templateWrapper">
                                <div className="templateContainer">
                                    <SectionHomepage
                                        titleLevel={"h3"}
                                        sectionTitle={"Get started"} />
                                    <SectionSupport
                                        titleLevel={"h3"}
                                        sectionTitle={"Help and support"} />
                                </div>
                            </div>
                        </div>
                        <div class="col-6">
                            <div className="templateWrapper">
                                <div className="templateContainer">
                                    <div className="d-flex">
                                        <div>
                                            <HeadingGeneral 
                                                level={"h3"}
                                                isUppercase={false}
                                                text={"Wallet management"} />
                                        </div>
                                        {/*
                                            <div className="ms-auto">
                                                <ButtonText 
                                                    type={"Default"}
                                                    size={"small"}
                                                    text={"Add new wallet"}
                                                    disabled={true}
                                                    hasIcon={false} />
                                            </div>
                                        */}
                                    </div>   
                                    <LoadWallet
                                        account={account}
                                        recentWallets={recentWallets}/>
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
