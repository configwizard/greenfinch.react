import React from "react";
import gficon from '../../../assets/svg/gf-icon.svg';

import './style.scss';

class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedNetwork: {
                Name: "Test Net"
            }
        }
    }
        async componentDidMount() {
        console.log("mounting header ", this.state.selectedNetwork)
        window.runtime.EventsOn("networkchanged", async (message) => {
            console.log("networkchanged", message)
            await this.setState({selectedNetwork: message})
        })
    }
    render() {
        console.log("status bar updating wallet details", this.props.account)

        // const isWalletLoaded = this.state.isWalletLoaded;
        //{this.props.account.address}

        return (
            <>
                <header>
                    <div className="header-content d-flex">
                        <div className="atmHeaderPower d-flex align-items-center justify-content-center">
                            {this.state.selectedNetwork.Name === "Test Net" ? <span className="testtest"><i className="mainnetOff fa-sharp fa-solid fa-power-off fa-fw"></i></span> : <span className="testmain"><i className="mainnetOff fa-sharp fa-solid fa-power-off fa-fw"></i></span> }
                        </div>
                        <div className="atmStatus">
                            <span className="utUCSmall d-block">Net</span><span>{this.state.selectedNetwork.Name}</span>
                        </div>
                        <div className="atmStatus">
                            <span className="utUCSmall d-block">Wallet</span>{this.props.account.address ? <span>{this.props.account.address}</span> : <span className="utTemp">No wallet loaded</span>}
                        </div>
                        <div className="atmStatus ms-auto">
                            <span className="utUCSmall d-block">NeoFS</span>{this.props.account.address ? <span style={{"color": this.props.account.neoFSBalance < 5 ? this.props.account.neoFSBalance < 2 ? "#E5004C": "#F47A00" : null}}>{this.props.account.neoFSBalance}</span> : <span className="utTemp">-&nbsp;-</span>}
                        </div>
                        <div className="atmHeaderLogo">
                            <img src={gficon} alt="Greenfinch logo"></img>
                        </div>
                    </div>
                </header>
            </>
        );
    }
}

export default Header;