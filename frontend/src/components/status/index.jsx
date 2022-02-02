import React  from "react";

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
                    <div className="molBlockData">Wallet: {this.props.resp.address}</div>
                </div>
                <div className="d-flex justify-content-between">
                    <div className="molBlockData"><span className="utUnit">NeoFS</span><span className="utNum">{g}</span></div>
                    <div className="molBlockData"><span className="utUnit">GAS</span><span className="utNum">{gb}</span></div>
                    <div className="molBlockData"><span className="utUnit">NEO</span><span className="utNum">{this.props.resp.nep17.NEO.amount}</span></div>
                </div>
            </>
        );
    }
}

export default Status;