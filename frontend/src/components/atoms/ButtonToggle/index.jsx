import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import './style.scss';
import {openInDefaultBrowser} from "../../../manager/manager";

export const ToggleType = {
    DEFAULT: 'default'
}

const ButtonToggle = ({ type, initialToggle, toggleName, toggleId, toggleNames, onToggle, metaContent }) => {

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

        //if its true, that means mainnet, if its false, that means testnet
        if (isToggled != previousToggle) { //hack as it keeps re rendering the useEffect function
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
        <div className="switchWrapper d-flex">
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
                        onChange={handleToggle}
                        />
                    <span className="atmSwitchSlider utRound"></span>
                </label>
            </div>
        </div>
        <CustomContent />
    </>
    )
};

export default ButtonToggle;

ButtonToggle.propTypes = {
    type: PropTypes.oneOf(Object.keys(ToggleType)),
    toggleHeading: PropTypes.string,
    toggleName: PropTypes.string,
    toggleId: PropTypes.string,
    toggleIds: PropTypes.array
};

ButtonToggle.defaultProps = {
    type: ToggleType.DEFAULT,
    toggleHeading: "Toggle Me",
    toggleName: "name",
    toggleId: "id",
    toggleIds: ["id", "id"]
};     