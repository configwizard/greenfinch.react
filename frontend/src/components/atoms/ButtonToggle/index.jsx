import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';

export const ToggleSize = {
    SMALL: 'small',
    MEDIUM: 'medium'
}

export const ToggleType = {
    DEFAULT: 'default', 
    CLEAN: 'clean'
}

const ButtonToggle = ({ type, size, buttonClass, disabled, onClick, faClass }) => {
    return (
        <div className="molBlockSwitch d-flex">
            <div className="atmSwitchContent">
                <h5>Mainnet</h5>
            </div>
            <div className="atmSwitchToggle ms-auto">
                <label className="switch">
                    <input type="checkbox" class="toggle-switch-checkbox" name="toggleSwitch" id="toggleSwitch"/>
                    <span className="slider round"></span>
                </label>
            </div>
        </div>
    )
};

export default ButtonToggle;

ButtonToggle.propTypes = {
    type: PropTypes.oneOf(Object.keys(ToggleType)),
    size: PropTypes.oneOf(Object.keys(ToggleSize)),
    buttonClass: PropTypes.string,
    disabled: PropTypes.bool,
    onClick: PropTypes.func,
    faClass: PropTypes.string
};

ButtonToggle.defaultProps = {
    type: ToggleType.DEFAULT,
    size: ToggleSize.MEDIUM,
    buttonClass: '',
    disabled: false,
    faClass: "fas fa-flag"
};     