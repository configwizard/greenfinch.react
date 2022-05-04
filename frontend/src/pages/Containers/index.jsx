import React from 'react';

// Components
import Containers from '../../components/templates/Containers';

class PageContainers extends React.Component {
    //
    // fireToast(message) {
    //     console.log("making toast with ", message)
    //     window.go.manager.Manager.MakeToast(message)
    // }
    //
    render() {
        console.log("propogating wallet", this.props.account)
        return (
            <>
                <Containers account={this.props.account} refreshAccount={this.props.setStatusAccount}></Containers>
            </>
        );
    }
}
export default PageContainers;
