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

        // Don't think you need Number()
        var b = Number((this.props.resp.neofs.balance));
        var p = Number((this.props.resp.neofs.precision));
        var m = Math.pow(10,p);
        var g = Number(b/m);

        var gs = Number((this.props.resp.nep17.GAS.amount));
        var dp = Number((this.props.resp.nep17.GAS.meta.decimals));
        var ms = Math.pow(10,dp);
        var gb = Number(gs/ms); // Check that this is 10 to the power... 

        return (
            <div className="result" id="result">
                <div className="molBlockJSON">
                    <ul>
                        <li>Wallet: {this.props.resp.address}</li>
                        <li>NeoFS Balance: {g}</li>
                        <li>GAS: {gb}</li>
                        <li>NEO: {this.props.resp.nep17.NEO.amount}</li>
                    </ul>   
                </div>
            </div>
        );
    }
}

export default Status;
