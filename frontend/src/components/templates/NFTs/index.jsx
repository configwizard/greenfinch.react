import React from 'react';

// Components
import InDevelopment from '../../atoms/InDevelopment';
import HeaderPage from '../../organisms/HeaderPage';

// Central style sheet for templates
import '../_settings/style.scss';

const TemplateNFTs = () => {
    return (
        <div className="templatePage d-flex flex-column flex-grow-1">
            <div className="row">
                <div className="col-12">
                    <HeaderPage 
                        pageTitle={"NFT Management"}
                        hasButton={false} /> 
                    <div className="row">
                        <div className="col-12">
                            <div className="templateWrapper">
                                <InDevelopment
                                    text={"This functionality is currently in development and is coming soon."}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TemplateNFTs;