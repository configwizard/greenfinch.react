// components/dropdown.component.js
import React, { useState } from "react";
import onClickOutside from "react-onclickoutside";
import './style.css';
function DropDown(props) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState('');
    const toggle = () => setIsOpen(!isOpen);

    DropDown.handleClickOutside = () => setIsOpen(false);

    const selectOption = (value) => {
        setSelectedValue(value);
        setIsOpen(false);
    }

    const optionData = [{
        id: 1,
        text: 'Profile'
    }, {
        id: 2,
        text: 'Timeline'
    }, {
        id: 3,
        text: 'Settings'
    }, {
        id: 4,
        text: 'Log out'
    }]


    return (
        <div className="dd-wrapper">
            <div onClick={toggle} className="dd-selected">
                {selectedValue ? 'Selected: ' + selectedValue : 'Select Option'}
            </div>
            {
                isOpen ?
                    <ul className="dd-items-wrapper">
                        {optionData.map((option) =>
                            <li className={option.text === selectedValue ? 'dd-item active' : 'dd-item'} key={option.id} onClick={() => selectOption(option.text)}>
                                <div>{option.text}</div>
                            </li>
                        )}
                    </ul>
                    : null
            }

        </div>
    );
};

const clickOutsideConfig = {
    handleClickOutside: () => DropDown.handleClickOutside,

};

export default onClickOutside(DropDown, clickOutsideConfig);
