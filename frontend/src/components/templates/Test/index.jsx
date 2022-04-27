import React from 'react';

// Components
import HeaderPage from '../../organisms/HeaderPage';

import './style.scss';

const TemplateTest = () => {
    return (
        <div class="templatePage d-flex flex-column flex-grow-1">
            <div class="row">
                <div className="col-12">
                    <HeaderPage 
                        pageTitle={"Test Page"} 
                        hasButton={false} />
                    <div>
                        A page to test components + design.
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TemplateTest;