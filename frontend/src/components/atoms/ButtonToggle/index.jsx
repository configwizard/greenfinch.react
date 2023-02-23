import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import './style.scss';
import {setNetwork} from "../../../manager/manager";

export const ToggleType = {
    DEFAULT: 'default'
}

const ButtonToggle = ({ type, toggleName, toggleId }) => {

    const [previousToggle, setPreviousToggle] = useState(false)
    const [isToggled, setIsToggled] = useState(false);
    const [toggleHeading, setToggleHeading] = useState(isToggled ? "Main Net" : "Test Net")
    const handleToggle = async () => {
        console.log("value before setting ", isToggled)
        await setIsToggled(!isToggled);
    }

    useEffect(async () => {
        console.log('UseEffect says Toggle Slider is active:', isToggled)
        console.log("value after setting ", isToggled)
        //if its true, that means mainnet, if its false, that means testnet
        if (isToggled != previousToggle) { //hack as it keeps re rendering the useEffect function
            await setPreviousToggle(isToggled)
            if (isToggled) {
                console.log("setting mainnet")
                await setToggleHeading("Main Net")
                await setNetwork("mainnet")
            } else {
                console.log("setting testnet")
                await setToggleHeading("Test Net")
                await setNetwork("testnet")
            }
        }
    })
    
    return (
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