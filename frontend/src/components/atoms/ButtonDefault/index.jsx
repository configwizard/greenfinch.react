import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';

// https://github.com/Mind-over-Tech/bloom-frontend/blob/master/src/components/atoms/PillButton.js

// import { Button, Flex, Box } from 'rebass/styled-components';
// import Icon from './Icon';
// import Typography from 'components/atoms/Typography';
// constantas = themes

const ButtonDefault = ({ buttonClass, disabled, onClick, iconIncluded, faClass, text }) => {
  return (
    <button
        type="button"
        className={buttonClass}
        disabled={disabled} 
        onClick={onClick} >
            {
                iconIncluded && (
                    <i className={faClass} />
                )
            }
            {text}
    </button>
  )
};

export default ButtonDefault;

ButtonDefault.propTypes = {
    buttonClass: PropTypes.string,
    disabled: PropTypes.bool,
    onClick: PropTypes.func,
    iconIncluded: PropTypes.bool,
    faClass: PropTypes.string,
    text: PropTypes.string  
};

ButtonDefault.defaultProps = {
    buttonClass: "atmButtonDefault",
    disabled: false,
    iconIncluded: false,
    faClass: "fas fa-flag",
    text: "button text"
};                            