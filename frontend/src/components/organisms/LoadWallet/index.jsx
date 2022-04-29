import React from 'react';

// Actual
import { loadWallet, newWallet } from '../../../manager/manager.js'

// Components
import ButtonText from '../../atoms/ButtonText';
import HeadingGeneral from '../../atoms/HeadingGeneral';

import './style.scss';


class LoadWallet extends React.Component {
    render() {
        console.log("propogating wallet", this.props.account)
        return (
            <div className="section-wallet">
                <div className="row">
                    <div className="col-2">
                        <i className="fas fa-4x fa-exclamation-triangle"/>
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
                                    onClick={async () => {await loadWallet(document.getElementById("walletPassword").value)}} />
                                <ButtonText 
                                    type={"default"}
                                    size={"medium"}
                                    hasIcon={false}
                                    text={"Create new wallet"}
                                    onClick={async () => {await newWallet(document.getElementById("walletPassword").value)}} />
                            </div>
                        </div>
                    </div>
                </div>

                
            </div>
        );
    }
}

export default LoadWallet;