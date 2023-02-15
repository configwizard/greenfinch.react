import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import './style.scss';



export const DropdownSize = {
    DEFAULT: 'default'
}

export const DropdownType = {
    ICON: 'icon',
    TEXT: 'text'
}

const ButtonDropdown = ({ triggerText, menu }) => {

    const [isOpen, setIsOpen] = React.useState(false);
    const handleOpen = () => { setIsOpen(!isOpen); };

    useEffect(() => console.log('UseEffect says Dropdown is open:',isOpen))
  
    return (
        <div className="atmDropdownContent">
            {React.cloneElement(<button className="buttonDropdown">{triggerText}</button>, {
                onClick: handleOpen,
            })}
            {isOpen ? (
                <ul className="atmDropdownMenu">
                    {menu.map((menuItem, index) => (
                        <li key={index} className="atmDropdownMenuItem">
                            {React.cloneElement(menuItem, {
                                onClick: () => {
                                    menuItem.props.onClick();
                                    setIsOpen(false);
                                },
                            })}
                        </li>
                    ))}
                </ul>
            ) : null}
        </div>
    )
};

export default ButtonDropdown;

ButtonDropdown.propTypes = {
    size: PropTypes.oneOf(Object.keys(DropdownSize)),
    type: PropTypes.oneOf(Object.keys(DropdownType)),
    buttonClass: PropTypes.string,
    disabled: PropTypes.bool,
    onClick: PropTypes.func,
    faClass: PropTypes.string
};

ButtonDropdown.defaultProps = {
    size: DropdownType.DEFAULT,
    text: DropdownSize.TEXT,
    buttonClass: '',
    disabled: false,
    faClass: "fas fa-flag"
};  