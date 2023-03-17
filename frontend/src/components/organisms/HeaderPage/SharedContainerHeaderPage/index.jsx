import React from 'react';
import PropTypes from 'prop-types';

// Components
import HeadingGeneral from '../../../atoms/HeadingGeneral';
import ButtonText from '../../../atoms/ButtonText';
import { useModal } from '../../../organisms/Modal/ModalContext';

import '../style.scss';

const SharedContainerHeaderPage = ({ pageTitle, hasButton, hasButtonIcon, isButtonDisabled, faClass, buttonText, buttonAction, loadSharedContainer }) => {
    const { setModal, unSetModal } = useModal();
    return (
        <div className="HeaderPageWrapper">
            <div className="HeaderPageInner d-flex align-items-center">
                <div>
                    <HeadingGeneral
                        level={"h1"}
                        isUppercase={false}
                        text={pageTitle}
                    />
                </div>
                <div className="ms-auto">
                    { hasButton ?
                        <ButtonText
                            size={"small"}
                            type={"default"}
                            hasIcon={hasButtonIcon}
                            isDisabled={isButtonDisabled}
                            faClass={faClass}
                            text={buttonText}
                            onClick={() => loadSharedContainer(setModal, unSetModal)} /> 
                        : null }
                </div>
            </div>
        </div>
    );
}

export default SharedContainerHeaderPage;

HeadingGeneral.propTypes = {
    pageTitle: PropTypes.string,
};

HeadingGeneral.defaultProps = {
    pageTitle: "Lorem Ipsum"
};

ButtonText.propTypes = {
    hasButton: PropTypes.bool,
    hasIcon: PropTypes.bool,
    isDisabled: PropTypes.bool,
    iconClass: PropTypes.string
};

ButtonText.defaultProps = {
    hasButton: true,
    hasIcon: true,
    isDisabled: false
}
