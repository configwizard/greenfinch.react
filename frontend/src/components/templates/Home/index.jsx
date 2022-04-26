import React from 'react';

// Components
import HeaderPage from '../../organisms/HeaderPage';
import HomePage from '../../organisms/HomePage';

import './style.scss';

const TemplateHome = () => {
    return (
        <div class="templatePage d-flex flex-column flex-grow-1">
            <div class="row">
                <div className="col-12">
                    <HeaderPage 
                        pageTitle={"Greenfinch"} />
                    <HomePage/>
                </div>
            </div>
        </div>
    );
}

export default TemplateHome;