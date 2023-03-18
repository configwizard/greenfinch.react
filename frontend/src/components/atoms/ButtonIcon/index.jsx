import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';

export const ButtonSize = {
    SMALL: 'small',
    MEDIUM: 'medium',
    LARGE: 'large',
}

export const ButtonType = {
    DEFAULT: 'default', 
    CLEAN: 'clean',
    SECONDARY: 'secondary',
}

const ButtonIcon = ({ type, size, buttonClass, isDisabled, onClick, faClass }) => {
    return (
        <button
            type="button"
            className={`atmButtonIcon ${[type]} ${[size]} ${buttonClass}`}
            disabled={isDisabled} 
            onClick={onClick}>
                <i className={faClass} />
        </button>
    )
};

export default ButtonIcon;

ButtonIcon.propTypes = {
    type: PropTypes.oneOf(Object.keys(ButtonType)),
    size: PropTypes.oneOf(Object.keys(ButtonSize)),
    buttonClass: PropTypes.string,
    isDisabled: PropTypes.bool,
    onClick: PropTypes.func,
    faClass: PropTypes.string
};

ButtonIcon.defaultProps = {
    type: ButtonType.DEFAULT,
    size: ButtonSize.MEDIUM,
    buttonClass: "",
    isDisabled: false,
    faClass: "fa-sharp fa-solid fa-flag"
};                            