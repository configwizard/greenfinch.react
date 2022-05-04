import React from 'react';

// Components
import TemplateHome from '../../components/templates/Home';

const PageHome = ({ account, recentWallets }) => {
    return (
        <TemplateHome account={account} recentWallets={recentWallets} />
    );
}

export default PageHome;
