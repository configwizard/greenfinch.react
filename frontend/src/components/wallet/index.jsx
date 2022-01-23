import React  from "react";
import JSONView from 'react-json-view';

class Wallet extends React.Component {
    constructor(props) {
        super(props);

    }

    render() {
        return (
            <div>
                <div className="result" id="result">Balance 👇
                    <JSONView id="json-pretty" src={this.props.resp}></JSONView>
                </div>
            </div>
        );
    }
}

export default Wallet;
