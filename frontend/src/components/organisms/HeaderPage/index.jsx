import React from 'react';
import PropTypes from 'prop-types';

// Components
import HeadingGeneral from '../../atoms/HeadingGeneral';
import ButtonText from '../../atoms/ButtonText';

import './style.scss';

const HeaderPage = ({ pageTitle, hasButton, buttonText, buttonAction }) => {
    return (
        <div className="HeaderPageWrapper">
            <div className="HeaderPage d-flex align-items-center">
                <div>
                    <HeadingGeneral
                        level={"h1"}
                        isUppercase={false}
                        text={pageTitle}
                    />
                </div>
                <div className="ms-auto">
                    { hasButton ? <ButtonText
                        size={"medium"}
                        type={"default"}
                        text={buttonText}
                        onClick={buttonAction}
                        hasIcon={true}
                    /> : null }
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
    hasButton: PropTypes.bool
};

ButtonText.defaultProps = {
    hasButton: true
}