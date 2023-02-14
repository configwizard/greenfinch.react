import React, { useState, useEffect } from 'react';
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

const ButtonToggle = ({ size, type, toggleText, toggleName, toggleId, disabled, onClick }) => {

    const [isToggled, setIsToggled] = useState(false);
    const onToggle = () => setIsToggled(!isToggled);

    useEffect(() => console.log('UseEffect says:',isToggled))
    
    return (
        <div className="molBlockSwitch d-flex">
            <div className="atmSwitchContent d-flex">
                <h5 className="align-self-center">{toggleText}</h5>
            </div>
            <div className="atmSwitchToggle ms-auto">
                <label className="switch">
                    <input  
                        type="checkbox" 
                        class="atmInputToggle" 
                        name={toggleName}
                        id={toggleId}
                        checked={isToggled} 
                        onChange={onToggle}
                        />
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
    disabled: PropTypes.bool,
    onClick: PropTypes.func,
    toggleText: PropTypes.string,
    toggleName: PropTypes.string,
    toggleId: PropTypes.string 
};

ButtonToggle.defaultProps = {
    type: ToggleType.DEFAULT,
    size: ToggleSize.MEDIUM,
    toggleText: "Toggle Me",
    disabled: false
};     