import React from "react";

class Status extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        console.dir(this.props);
        if ((this.props.resp.neofs === undefined) || 
            (this.props.resp.nep17 === undefined) || 
            (this.props.resp.nep17.GAS === undefined) || 
            (this.props.resp.nep17.GAS.meta === undefined) || 
            (this.props.resp.nep17.NEO === undefined)) {
            console.log("Waiting...");
            return(<div>Waiting...</div>)
        }

        //TODO: Don't think you need Number()
        var b = Number((this.props.resp.neofs.balance));
        var p = Number((this.props.resp.neofs.precision));
        var m = Math.pow(10,p);
        var g = Number(b/m).toFixed(2);

        var gs = Number((this.props.resp.nep17.GAS.amount));
        var dp = Number((this.props.resp.nep17.GAS.meta.decimals));
        var ms = Math.pow(10,dp);
        var gb = Number(gs/ms).toFixed(2); //TODO: Check that this is 10 to the power... 

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
                        <span className="utUCSmall d-block">Wallet</span> {this.props.resp.address}
                    </div>
                    <div className="atmStatus ms-auto">
                        <span className="utUCSmall d-block ">NeoFS</span>{g}
                    </div>
                    {/*
                        <div className="orgBlockData d-flex">
                            <div className="d-flex flex-column">
                                <div className="molBlockData">
                                    <span className="utUnit">GAS</span><span className="utNum">{gb}</span>
                                </div>
                                <div className="molBlockData">
                                    <span className="utUnit">NEO</span><span className="utNum">{this.props.resp.nep17.NEO.amount}</span>
                                </div>
                            </div>
                            <div className="d-flex flex-column">
                                <div className="molBlockData align-self-stretch">
                                    <span className="utUnit">NeoFS</span><span className="utNum">{g}</span>
                                </div>
                            </div>
                        </div>
                    */}
                </div>
            </>
        );
    }
}

export default Status;
