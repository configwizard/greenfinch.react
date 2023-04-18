import React from 'react';

// Components
import TemplateHome from '../../components/templates/Home';

const PageHome = ({ lockUI, setLock, account, recentWallets, refreshRecentWallets, selectedNetwork }) => {
    return (
        <TemplateHome lockUI={lockUI} setLock={setLock} account={account} recentWallets={recentWallets} refreshRecentWallets={refreshRecentWallets} selectedNetwork={selectedNetwork} />
    );
}

export default PageHome;
