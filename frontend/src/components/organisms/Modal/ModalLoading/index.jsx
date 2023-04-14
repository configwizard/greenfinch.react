import React from 'react';
import PropTypes from 'prop-types';

// Components
import ButtonText from '../../../atoms/ButtonText';
import SpinnerLoading from '../../../atoms/SpinnerLoading';

// Central style sheet for modals
import '../_settings/style.scss';

export const ModalSize = {
    SMALL: 'small',
    MEDIUM: 'medium',
}

const CompModalLoading = props => {
    return (
        <>
            {props.hasCloseWrapper ?
                <button className="molModalWrapper" onClick={props.unSetModal} />
                : <div className="molModalWrapper"></div>
            }
            <div className={`molModalContainer ${props.size}`}>
                {props.hasCloseCorner ? 
                    <button className="modal__close-btn" onClick={props.unSetModal}>
                        <i className="fa-sharp fa-solid fa-xmark"/>
                    </button>
                : null }
                <section className="orgModalLoading">
                    <div className="molModalHeader d-flex align-items-center justify-content-center">
                        <SpinnerLoading 
                            size={"medium"} 
                            type={"dot-spin"} 
                            theme={"light"} 
                            hasText={true} 
                            isVisible={true} 
                            text={props.loadingMessage}/>
                    </div>
                    { props.children ?
                        <div className="molModalBody"> 
                            {props.children}
                        </div>
                    : null }
                    { props.hasPrimaryButton ? 
                        <div className="molModalFooter">
                            <div className="d-flex align-items-center justify-content-center">
                                <ButtonText
                                    type="secondary"
                                    size="medium"
                                    hasIcon={false}
                                    text={props.buttonTextPrimary}
                                    isDisabled={false}
                                    onClick={() => {props.primaryClicked()}} />
                            </div>
                        </div>
                        : null
                    } 
                </section>
            </div>
        </>
    )
}

CompModalLoading.propTypes = {
    size: PropTypes.oneOf(Object.keys(ModalSize)),
    hasCloseWrapper: PropTypes.bool,
    hasCloseCorner: PropTypes.bool,
};

CompModalLoading.defaultProps = {
    size: ModalSize.MEDIUM,
    hasCloseWrapper: false,
    hasCloseButton: false,
}

export default CompModalLoading;