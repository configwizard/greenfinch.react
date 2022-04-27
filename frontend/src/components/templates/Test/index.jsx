import React from 'react';

// Components
import HeaderPage from '../../organisms/HeaderPage';

import './style.scss';

function TestButtonAction() {
    console.log("Button clicked, test page")
}
const TemplateTest = () => {
    return (
        <div class="templatePage d-flex flex-column flex-grow-1">
            <div class="row">
                <div className="col-12">
                    <HeaderPage 
                        pageTitle={"Test Page"}
                        hasButton={true}
                        buttonText={"Test button in place"}
                        buttonAction={TestButtonAction} />
                    <div>
                        A page to test components + design.
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TemplateTest;