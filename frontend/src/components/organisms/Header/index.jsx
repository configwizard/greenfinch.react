import React from "react";

import './style.scss';

class Header extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        console.log("status bar updating wallet details", this.props.account)

        return (
            <>
                <header>
                    <div className="header-content d-flex">
                        <div className="atmStatus">
                            <span className="utUCSmall d-block">Net</span> Testnet
                        </div>
                        <div className="atmStatus">
                            <span className="utUCSmall d-block">Wallet</span> {this.props.account.address}
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