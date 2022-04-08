import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';

const ButtonIcon = ({ buttonClasses, buttonSize, hasBackground, disabled, onClick, iconClasses }) => {
  return (
        <>
            { buttonSize === "small" && (
                hasBackground ?
                <button
                    type="button"
                    className={`atmButtonIcon atmButtonSmall ${buttonClasses}`}
                    disabled={disabled} 
                    onClick={onClick}>
                        <i className={iconClasses} />
                </button>
                : 
                <button
                    type="button"
                    className={`atmButtonIconClean atmButtonSmall ${buttonClasses}`}
                    disabled={disabled} 
                    onClick={onClick}>
                        <i className={iconClasses} />
                </button>
            )}
            { buttonSize === "medium" && (
                hasBackground ?
                <button
                    type="button"
                    className={`atmButtonIcon atmButtonMedium ${buttonClasses}`}
                    disabled={disabled} 
                    onClick={onClick}>
                        <i className={iconClasses} />
                </button>
                : 
                <button
                    type="button"
                    className={`atmButtonIconClean atmButtonMedium ${buttonClasses}`}
                    disabled={disabled} 
                    onClick={onClick}>
                        <i className={iconClasses} />
                </button> 
            )}
            { buttonSize === "large" && (
                hasBackground ?
                <button
                    type="button"
                    className={`atmButtonIcon atmButtonLarge ${buttonClasses}`}
                    disabled={disabled} 
                    onClick={onClick}>
                        <i className={iconClasses} />
                </button>
                : 
                <button
                    type="button"
                    className={`atmButtonIconClean atmButtonLarge ${buttonClasses}`}
                    disabled={disabled} 
                    onClick={onClick}>
                        <i className={iconClasses} />
                </button> 
            )}
        </>
    )
};

export default ButtonIcon;

ButtonIcon.propTypes = {
    buttonClasses: PropTypes.string,
    buttonSize: PropTypes.string,
    hasBackground: PropTypes.bool,
    disabled: PropTypes.bool,
    onClick: PropTypes.func,
    iconClasses: PropTypes.string
};

ButtonIcon.defaultProps = {
    buttonClasses: "atmButtonIcon",
    buttonSize: "medium",
    hasBackground: true,
    disabled: false,
    iconClasses: "fas fa-flag"
};                            