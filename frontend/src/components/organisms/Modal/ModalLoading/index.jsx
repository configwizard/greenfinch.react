import React from 'react';

// Components
import ButtonText from '../../../atoms/ButtonText';

// Central style sheet for modals
import '../_settings/style.scss';

const CompModalLoading = props => {
    return (
        <section className="orgModalLoading">
            <div className="molModalHeader d-flex align-items-center justify-content-center">
                <i className="fa-sharp fa-6x fa-solid fa-spinner fa-spin-pulse"/> 
                <span>Loading...</span>
            </div>
            <div className="molModalBody"> 
                <h2>{props.title}</h2>
                {props.children}
            </div>
            <div className="molModalFooter">
                <div className="buttonStackHorizontal d-flex">
                    <div className="ms-auto">
                        {props.hasSecondaryButton ?  
                            <ButtonText
                                type="secondary"
                                size="medium"
                                hasIcon={false}
                                text={props.buttonTextSecondary}
                                isDisabled={false}
                                onClick={() => {props.secondaryClicked()}} />
                                : null
                        }
                        <ButtonText
                            type="primary"
                            size="medium"
                            hasIcon={false}
                            text={props.buttonTextPrimary}
                            isDisabled={false}
                            onClick={() => {props.primaryClicked()}} />
                    </div>
                </div>
            </div>
        </section>
    )
}

export default CompModalLoading;
