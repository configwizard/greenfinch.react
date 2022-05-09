import React from 'react';

// Components
import NoContent from '../../atoms/NoContent';
import HeaderPage from '../../organisms/HeaderPage';

// Central style sheet for templates
import '../_settings/style.scss';

function TestButtonAction() {
    console.log("Button clicked, website page")
}

const TemplateNFTs = () => {
    return (
        <div class="templatePage d-flex flex-column flex-grow-1">
            <div class="row">
                <div className="col-12">
                    <HeaderPage 
                        pageTitle={"NFT Management"}
                        hasButton={false}
                        hasIcon={true}
                        faClass={"fas fa-plus-circle"}
                        buttonText={"Add new website"}
                        buttonAction={TestButtonAction} /> 
                        
                    <div class="row">
                        <div class="col-12">
                            <div className="templateWrapper">
                                <div className="templateContainer">
                                    <NoContent
                                        text={"This functionality is currently in development and is coming soon."}/>
                                </div>
                            </div>
                        </div>
                    </div>
                
                </div>
            </div>
        </div>
    );
}

export default TemplateNFTs;