import React from "react";

import './style.scss';

class Header extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        console.log("status bar updating wallet details", this.props.account)

        // const isWalletLoaded = this.state.isWalletLoaded;
        //{this.props.account.address}

        return (
            <>
                <header>
                    <div className="header-content d-flex">
                        <div className="atmStatus">
                            <span className="utUCSmall d-block">Net</span><span>Testnet</span>
                        </div>
                        <div className="atmStatus">
                            <span className="utUCSmall d-block">Wallet</span><span>{this.props.account.address ? this.props.account.address : 'No wallet loaded'}</span>
                        </div>
                        <div className="atmStatus ms-auto">
                            <span className="utUCSmall d-block">NeoFS</span><span style={{"color": this.props.account.neoFSBalance < 5 ? this.props.account.neoFSBalance < 2 ? "red": "orange" : null}}>{this.props.account.neoFSBalance}</span>
                        </div>
                    </div>
                </header>
            </>
        );
    }
}

export default Header;