import React from 'react';

// Components
import TemplateHome from '../../components/templates/Home';

const PageHome = ({ account, recentWallets, refreshRecentWallets, selectedNetwork }) => {
    return (
        <TemplateHome account={account} recentWallets={recentWallets} refreshRecentWallets={refreshRecentWallets} selectedNetwork={selectedNetwork} />
    );
}

export default PageHome;
