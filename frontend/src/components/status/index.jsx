import React  from "react";

class Status extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        console.dir(this.props);
        if (this.props.resp.neofs === undefined){
            console.log("Waiting...");
            return(<div>Waiting...</div>)
        }
        return (
            <div className="result" id="result">
                <div className="molBlockJSON">
                    <ul>
                        <li>Wallet: {this.props.resp.address}</li>
                        <li>NeoFS: {this.props.resp.neofs.balance}</li>
                    </ul>
                </div>
            </div>
        );
    }
}

export default Status;
