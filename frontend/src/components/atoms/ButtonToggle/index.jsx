import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import './style.scss';

export const ToggleType = {
    DEFAULT: 'default'
}

const ButtonToggle = ({ type, toggleHeading, toggleName, toggleId }) => {

    const [isToggled, setIsToggled] = useState(false);
    const handleToggle = () => setIsToggled(!isToggled);

    useEffect(() => console.log('UseEffect says Toggle Slider is active:',isToggled))
    
    return (
        <div className="switchWrapper d-flex">
            <div className="atmSwitchHeading d-flex">
                <h5 className="align-self-center">{toggleHeading}</h5>
            </div>
            <div className="atmSwitchToggle ms-auto">
                <label className="atmSwitchLabel">
                    <input  
                        type="checkbox"
                        class={`atmInputToggle ${[type]}`}
                        name={toggleName}
                        id={toggleId}
                        checked={isToggled} 
                        onChange={handleToggle}
                        />
                    <span className="atmSwitchSlider utRound"></span>
                </label>
            </div>
        </div>
    )
};

export default ButtonToggle;

ButtonToggle.propTypes = {
    type: PropTypes.oneOf(Object.keys(ToggleType)),
    toggleHeading: PropTypes.string,
    toggleName: PropTypes.string,
    toggleId: PropTypes.string 
};

ButtonToggle.defaultProps = {
    type: ToggleType.DEFAULT,
    toggleHeading: "Toggle Me",
    toggleName: "name",
    toggleId: "id"
};     