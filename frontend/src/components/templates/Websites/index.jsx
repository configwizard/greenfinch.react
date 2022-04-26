import React from 'react';

// Components
import HeaderPage from '../../organisms/HeaderPage';

import './style.scss';

const TemplateWebsites = () => {
    return (
        <div class="templatePage d-flex flex-column flex-grow-1">
            <div class="row">
                <div className="col-12">
                    <HeaderPage 
                        pageTitle={"Containers as websites"} 
                        hasButton={true} />
                    <div>
                        List of website containers here.
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TemplateWebsites;