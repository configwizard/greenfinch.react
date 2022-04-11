import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';

const ButtonIcon = ({ buttonClass, buttonSize, hasBackground, disabled, onClick, faClass }) => {
  return (
        <>
            { buttonSize === "small" && (
                hasBackground ?
                <button
                    type="button"
                    className={`atmButtonIcon atmButtonSmall ${buttonClass}`}
                    disabled={disabled} 
                    onClick={onClick}>
                        <i className={faClass} />
                </button>
                : 
                <button
                    type="button"
                    className={`atmButtonIconClean atmButtonSmall ${buttonClass}`}
                    disabled={disabled} 
                    onClick={onClick}>
                        <i className={faClass} />
                </button>
            )}
            { buttonSize === "medium" && (
                hasBackground ?
                <button
                    type="button"
                    className={`atmButtonIcon atmButtonMedium ${buttonClass}`}
                    disabled={disabled} 
                    onClick={onClick}>
                        <i className={faClass} />
                </button>
                : 
                <button
                    type="button"
                    className={`atmButtonIconClean atmButtonMedium ${buttonClass}`}
                    disabled={disabled} 
                    onClick={onClick}>
                        <i className={faClass} />
                </button> 
            )}
            { buttonSize === "large" && (
                hasBackground ?
                <button
                    type="button"
                    className={`atmButtonIcon atmButtonLarge ${buttonClass}`}
                    disabled={disabled} 
                    onClick={onClick}>
                        <i className={faClass} />
                </button>
                : 
                <button
                    type="button"
                    className={`atmButtonIconClean atmButtonLarge ${buttonClass}`}
                    disabled={disabled} 
                    onClick={onClick}>
                        <i className={faClass} />
                </button> 
            )}
        </>
    )
};

export default ButtonIcon;

ButtonIcon.propTypes = {
    buttonClass: PropTypes.string,
    buttonSize: PropTypes.string,
    hasBackground: PropTypes.bool,
    disabled: PropTypes.bool,
    onClick: PropTypes.func,
    faClass: PropTypes.string
};

ButtonIcon.defaultProps = {
    buttonClass: "atmButtonIcon",
    buttonSize: "medium",
    hasBackground: true,
    disabled: false,
    faClass: "fas fa-flag"
};                            