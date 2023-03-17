import React from 'react';

// Components
import SharedContainers from "../../components/templates/Shared";

class PageShared extends React.Component {
    render() {
        console.log("propogating wallet", this.props.account)
        return (
            <SharedContainers account={this.props.account}/>
        );
    }
}
export default PageShared;
