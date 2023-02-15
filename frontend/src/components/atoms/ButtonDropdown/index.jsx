import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import './style.scss';

export const DropdownSize = {
    ICON: 'icon',
    TEXT: 'text'
}

export const DropdownType = {
    DEFAULT: 'default'
}

const ButtonDropdown = ({ trigger, menu }) => {
    
    const [isOpen, setIsOpen] = React.useState(false);
    const handleOpen = () => { setIsOpen(!isOpen); };

    useEffect(() => console.log('UseEffect says Dropdown is open:',isOpen))
  
    return (
        <div className="atmDropdownContent">
            {React.cloneElement(trigger, {
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
    type: PropTypes.oneOf(Object.keys(DropdownType)),
    size: PropTypes.oneOf(Object.keys(DropdownSize)),
    buttonClass: PropTypes.string,
    disabled: PropTypes.bool,
    onClick: PropTypes.func,
    faClass: PropTypes.string
};

ButtonDropdown.defaultProps = {
    type: DropdownType.DEFAULT,
    size: DropdownSize.TEXT,
    buttonClass: '',
    disabled: false,
    faClass: "fas fa-flag"
};  