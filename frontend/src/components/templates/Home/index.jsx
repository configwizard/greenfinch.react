import React from 'react';

// Components
import HeaderPage from '../../organisms/HeaderPage';
import PlaceholderHP from '../../organisms/TestHomePage';

import './style.scss';

const TemplateHome = () => {
    return (
        <div class="templatePage d-flex flex-column flex-grow-1">
            <div class="row">
                <div className="col-12">
                    <HeaderPage 
                        pageTitle={"Greenfinch"} 
                        hasButton={false}/>
                        <PlaceholderHP />
                </div>
            </div>
        </div>
    );
}

export default TemplateHome;