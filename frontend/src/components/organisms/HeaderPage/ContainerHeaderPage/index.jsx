import React from 'react';
import PropTypes from 'prop-types';

// Components
import HeadingGeneral from '../../../atoms/HeadingGeneral';
import ButtonText from '../../../atoms/ButtonText';
import { useModal } from '../../../organisms/Modal/ModalContext';

import '../style.scss';

const ContainerHeaderPage = ({ pageTitle, hasButton, hasIcon, faClass, buttonText, isButtonDisabled, createNewContainer }) => {
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
                            hasIcon={hasIcon}
                            faClass={faClass}
                            isDisabled={isButtonDisabled}
                            text={buttonText}
                            onClick={() => createNewContainer(setModal, unSetModal)} /> 
                        : null }
                    <ButtonText
                        size={"small"}
                        type={"default"}
                        hasIcon={true}
                        faClass={"fa-sharp fa-solid fa-rotate"}
                        isDisabled={false}
                        text={"Force sync"} />
                </div>
            </div>
        </div>
    );
}

export default ContainerHeaderPage;

HeadingGeneral.propTypes = {
    pageTitle: PropTypes.string,
};

HeadingGeneral.defaultProps = {
    pageTitle: "Lorem Ipsum"
};

ButtonText.propTypes = {
    hasButton: PropTypes.bool,
    hasIcon: PropTypes.bool,
    iconClass: PropTypes.string,
};

ButtonText.defaultProps = {
    hasButton: true,
    hasIcon: true
}
