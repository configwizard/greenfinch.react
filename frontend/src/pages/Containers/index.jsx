import React from 'react';

// Components
import Containers from '../../components/templates/Containers';

class PageContainers extends React.Component {
    render() {
        console.log("propogating wallet", this.props.account)
        return (
            <Containers setLock={this.props.setLock} lockUI={this.props.lockUI} account={this.props.account} refreshAccount={this.props.setStatusAccount}/>
        );
    }
}
export default PageContainers;
