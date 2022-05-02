import React from 'react';

// Components
import TemplateHome from '../../components/templates/Home';

const PageHome = ({recentWallets}) => {
    return (
        <TemplateHome recentWallets={recentWallets}/>
    )
}

export default PageHome;
