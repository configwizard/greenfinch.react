import React from 'react';

// Components
import HeaderPage from '../../organisms/HeaderPage';

// Central style sheet for templates
import '../_settings/style.scss';

import TestContent from '../../organisms/TestContent';

function TestButtonAction() {
    console.log("Button clicked, test page")
}
const TemplateTest = () => {
    return (
        <div className="templatePage d-flex flex-column flex-grow-1">
            <div className="row">
                <div className="col-12">
                    <HeaderPage
                        pageTitle={"Test Page"}
                        hasButton={true}
                        hasButtonIcon={true}
                        isButtonDisabled={true}
                        faClass={"fas fa-vial"}
                        buttonText={"Test button"}
                        buttonAction={TestButtonAction} />
                   <div className="row g-0">
                        <div className="col-6">
                            <div className="templateWrapper">
                                <div className="templateInner">
                                    <p>A page to test components + design.</p>
                                    <TestContent></TestContent>
                                </div>
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="templateWrapper">
                                <div className="templateInner">
                                    <TestContent></TestContent>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TemplateTest;