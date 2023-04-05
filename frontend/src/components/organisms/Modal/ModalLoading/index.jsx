import React from 'react';
import PropTypes from 'prop-types';

// Components
import ButtonText from '../../../atoms/ButtonText';

// Central style sheet for modals
import '../_settings/style.scss';

export const ModalSize = {
    SMALL: 'small',
    MEDIUM: 'medium',
}

const CompModalLoading = props => {
    return (
        <div className={`molModalContainer ${props.size}`}>
            <button className="modal__close-btn" onClick={props.unSetModal}>
                <i className="fa-sharp fa-solid fa-xmark"/>
            </button>
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
        </div>
    )
}

CompModalLoading.propTypes = {
    size: PropTypes.oneOf(Object.keys(ModalSize)),
};

CompModalLoading.defaultProps = {
    size: ModalSize.MEDIUM,
}

export default CompModalLoading;
