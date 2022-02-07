import React  from "react";
// import JSONView from 'react-json-view';

class Wallet extends React.Component {
    constructor(props) {
        super(props);

    }

    render() {
        return (
            <div className="result" id="result">
                <h2 className="atmTitle">Balance</h2>
                <div className="molBlockJSON">x
                    {/*
                        <JSONView id="json-pretty" src={this.props.resp}></JSONView>
                    */}
                </div>
            </div>
        );
    }
}

export default Wallet;
