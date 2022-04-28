import React from 'react';

// Components
import HeaderPage from '../../organisms/HeaderPage';

import LoadWallet from '../../organisms/LoadWallet';
import SectionHomepage from '../../organisms/SectionHomepage';

// Central style sheet for templates
import '../_settings/style.scss';

const TemplateHome = () => {
    return (
        <div class="templatePage d-flex flex-column flex-grow-1">
            <div class="row">
                <div className="col-12">
                    <HeaderPage 
                        pageTitle={"Welcome to Greenfinch"} 
                        hasButton={false}/>

                    <div class="row">
                        <div class="col-6">
                            <div className="templateWrapper">
                                <div className="templateContainer">
                                    <SectionHomepage 
                                        sectionTitle={"Get started"}
                                        />
                                    <SectionHomepage 
                                        sectionTitle={"Recent"}
                                        />
                                </div>
                            </div>
                        </div>
                        <div class="col-6">
                            <div className="templateWrapper">
                                <div className="templateContainer">
                                    <LoadWallet 
                                        sectiontitle={"Recent"}
                                        />
                                </div>
                            </div>
                        </div>
                    </div>
                        
                </div>
            </div>
        </div>
    );
}

export default TemplateHome;