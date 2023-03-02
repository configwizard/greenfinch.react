import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';

// https://github.com/Mind-over-Tech/bloom-frontend/blob/master/src/components/atoms/PillButton.js
// https://cheesecakelabs.com/blog/css-architecture-reactjs/

// change this up to clean, default/primary(modal) and secondary 

export const ButtonSize = {
    SMALL: 'small',
    MEDIUM: 'medium',
    LARGE: 'large',
}

export const ButtonType = {
    DEFAULT: 'default', 
    CLEAN: 'clean',
    PRIMARY: 'primary',
    SECONDARY: 'secondary',
}

const ButtonText = ({ type, size, buttonClass, isDisabled, onClick, hasIcon, faClass, text }) => {
  return (
    <button
        type="button"
        className={`atmButtonText ${[type]} ${[size]} ${buttonClass}`}
        disabled={isDisabled} 
        onClick={onClick} >
            {
                hasIcon && (
                    <i className={faClass} />
                )
            }
            {text}
    </button>
  )
};

export default ButtonText;

ButtonText.propTypes = {
    type: PropTypes.oneOf(Object.keys(ButtonType)),
    size: PropTypes.oneOf(Object.keys(ButtonSize)),
    buttonClass: PropTypes.string,
    isDisabled: PropTypes.bool,
    onClick: PropTypes.func,
    hasIcon: PropTypes.bool,
    faClass: PropTypes.string,
    text: PropTypes.string
};

ButtonText.defaultProps = {
    type: ButtonType.DEFAULT,
    size: ButtonSize.MEDIUM,
    isDisabled: false,
    hasIcon: true,
    buttonClass: "",
    faClass: "fas fa-flag",
    text: "lipsum vie"
};                            