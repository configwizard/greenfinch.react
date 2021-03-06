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
}

const ButtonIcon = ({ type, size, buttonClass, disabled, onClick, faClass }) => {
    return (
        <button
            type="button"
            className={`buttonIcon ${[type]} ${[size]} ${buttonClass}`}
            disabled={disabled} 
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
    disabled: PropTypes.bool,
    onClick: PropTypes.func,
    faClass: PropTypes.string
};

ButtonIcon.defaultProps = {
    type: ButtonType.DEFAULT,
    size: ButtonSize.MEDIUM,
    buttonClass: '',
    disabled: false,
    faClass: "fas fa-flag"
};                            