import React from 'react';
import PropTypes from 'prop-types';

// Components
import HeadingGeneral from '../../atoms/HeadingGeneral';
import ButtonText from '../../atoms/ButtonText';

import './style.scss';

const HeaderPage = ({ pageTitle, hasButton, hasIcon, faClass, buttonText, buttonAction }) => {
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
                            text={buttonText}
                            onClick={buttonAction} /> 
                        : null }
                </div>
            </div>
        </div>
    );
}

export default HeaderPage;

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