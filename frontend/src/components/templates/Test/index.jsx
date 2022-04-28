import React from 'react';

// Components
import HeaderPage from '../../organisms/HeaderPage';

// Central style sheet for templates
import '../_settings/style.scss';

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
                        hasIcon={true}
                        faClass={"fas fa-vial"}
                        buttonText={"Test button"}
                        buttonAction={TestButtonAction} />
                    <div class="row">
                        <div class="col-12">
                            <div className="templateWrapper">
                                <div className="templateContainer">
                                <p>A page to test components + design.</p>
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