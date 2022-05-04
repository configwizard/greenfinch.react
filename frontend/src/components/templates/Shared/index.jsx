import React from 'react';

// Components
import HeaderPage from '../../organisms/HeaderPage';

// Central style sheet for templates
import '../_settings/style.scss';

function TestButtonAction() {
    console.log("Button clicked, test page")
}
const TemplateShared = () => {
    return (
        <div class="templatePage d-flex flex-column flex-grow-1">
            <div class="row">
                <div className="col-12">
                    <HeaderPage
                        pageTitle={"Containers shared with me"}
                        hasButton={false} />
                    <div class="row">
                        <div class="col-12">
                            <div className="templateWrapper">
                                <div className="templateContainer">
                                    <p>Add container IDs that have been shared with you</p>
                                    <p>input box here</p>
                                    <p>todo: add the grid/row containers (copy pasted from the normal page)</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TemplateShared;
