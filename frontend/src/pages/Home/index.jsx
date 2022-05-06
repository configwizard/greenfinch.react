import React from 'react';

// Components
import TemplateHome from '../../components/templates/Home';

const PageHome = ({ account, recentWallets, refreshRecentWallets }) => {
    return (
        <TemplateHome account={account} recentWallets={recentWallets} refreshRecentWallets={refreshRecentWallets} />
    );
}

export default PageHome;
