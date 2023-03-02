import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import './style.scss';

export const ToggleType = {
    DEFAULT: 'default'
}

const ButtonToggle = ({ type, initialToggle, toggleName, toggleId, toggleNames, onToggle, toggleDescription, metaContent, isDisabled }) => {

    const [previousToggle, setPreviousToggle] = useState(initialToggle)
    const [isToggled, setIsToggled] = useState(initialToggle);
    const [toggleHeading, setToggleHeading] = useState(isToggled ? toggleNames[0] : toggleNames[1])
    const handleToggle = async () => {
        console.log("value before setting ", isToggled)
        await setIsToggled(!isToggled);
    }

    const CustomContent = () => {
        return metaContent || null;
    };

    useEffect(async () => {
        console.log('UseEffect says Toggle Slider is active:', isToggled)
        console.log("value after setting ", isToggled)

        // if it is true, that means main net, if it is false, that means test net
        if (isToggled != previousToggle) { // hack as it keeps re-rendering the useEffect function
            await setPreviousToggle(isToggled)
            if (isToggled) {
                await setToggleHeading(toggleNames[0])
            } else {
                await setToggleHeading(toggleNames[1])
            }
            onToggle(isToggled)
        }
    })
    
    return (
        <>
        <div className="switchWrapper d-flex flex-column">
            <div className="d-flex flex-row">   
                <div className="atmSwitchHeading d-flex">
                    <h5 className="align-self-center">{toggleHeading}</h5>
                </div>
                <div className="atmSwitchToggle ms-auto">
                    <label className="atmSwitchLabel">
                        <input  
                            type="checkbox"
                            className={`atmInputToggle ${[type]}`}
                            name={toggleName}
                            id={toggleId}
                            checked={isToggled}
                            disabled={isDisabled}
                            onChange={handleToggle}
                            />
                        <span className="atmSwitchSlider utRound"></span>
                    </label>
                </div>
            </div>
            <div className="atmSwitchContent d-flex">
                <p className="temp-small">{toggleDescription}</p>
            </div>
        </div>
        <CustomContent />
    </>
    )
};

export default ButtonToggle;

ButtonToggle.propTypes = {
    type: PropTypes.oneOf(Object.keys(ToggleType)),
    isDisabled: PropTypes.bool,
    toggleHeading: PropTypes.string,
    toggleName: PropTypes.string,
    toggleId: PropTypes.string,
    toggleIds: PropTypes.array
};

ButtonToggle.defaultProps = {
    type: ToggleType.DEFAULT,
    isDisabled: false,
    toggleHeading: "Toggle Me",
    toggleName: "name",
    toggleId: "id",
    toggleIds: ["id", "id"]
};     