import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';

const ButtonIcon = ({ buttonClass, disabled, onClick, iconClasses }) => {
  return (
    <button
        type="button"
        className={buttonClass}
        disabled={disabled} 
        onClick={onClick}>
            <i className={iconClasses} />
    </button>
  )
};

export default ButtonIcon;

ButtonIcon.propTypes = {
    buttonClass: PropTypes.string,
    disabled: PropTypes.bool,
    onClick: PropTypes.func,
    iconClasses: PropTypes.string
};

ButtonIcon.defaultProps = {
    buttonClass: "atmButtonIcon",
    disabled: false,
    iconClasses: "fas fa-flag"
};                            