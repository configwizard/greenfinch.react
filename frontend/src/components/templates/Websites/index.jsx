import React from 'react';

// Components
import HeaderPage from '../../organisms/HeaderPage';
import TestHomepage from '../../organisms/TestHomepage';

// Central style sheet for templates
import '../_settings/style.scss';

function TestButtonAction() {
    console.log("Button clicked, website page")
}

const TemplateWebsites = () => {
    return (
        <div class="templatePage d-flex flex-column flex-grow-1">
            <div class="row">
                <div className="col-12">
                    <HeaderPage 
                        pageTitle={"Containers as websites"}
                        hasButton={true}
                        hasIcon={true}
                        faClass={"fas fa-plus-circle"}
                        buttonText={"Add new website"}
                        buttonAction={TestButtonAction} />
                        
                    <div class="row">
                        <div class="col-12">
                            <div className="templateWrapper">
                                <div className="templateContainer">
                                    <TestHomepage></TestHomepage>
                                </div>
                            </div>
                        </div>
                    </div>
                
                </div>
            </div>
        </div>
    );
}

export default TemplateWebsites;