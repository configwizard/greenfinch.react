import React from "react";

class Status extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        if ((this.props.account.neofs === undefined) ||
            (this.props.account.nep17 === undefined) ||
            (this.props.account.nep17.GAS === undefined) ||
            (this.props.account.nep17.GAS.meta === undefined) ||
            (this.props.account.nep17.NEO === undefined)) {
                console.log("Waiting...");
                return(<div>Waiting...</div>)
            }
        //
        // //TODO: Don't think you need Number()
        let b = Number((this.props.account.neofs.balance));
        let p = Number((this.props.account.neofs.precision));
        let m = Math.pow(10,p);
        let g = Number(b/m).toFixed(2);

        return (
            <>
                <div className="d-flex">
                    <div className="atmStatus">
                        <span className="utUCSmall d-block">Mode</span> Mocker
                    </div>
                    <div className="atmStatus">
                        <span className="utUCSmall d-block">Net</span> Testnet
                    </div>
                    <div className="atmStatus">
                        <span className="utUCSmall d-block">Wallet</span> {this.props.account.address}
                    </div>
                    <div className="atmStatus ms-auto">
                        <span className="utUCSmall d-block">NeoFS</span><span style={{"color": g < 7 ? "orange": null}}>{g}</span>
                    </div>
                </div>
            </>
        );
    }
}

export default Status;
