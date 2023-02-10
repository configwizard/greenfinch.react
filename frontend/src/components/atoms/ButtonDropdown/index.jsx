import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';

export const DropdownSize = {
    SMALL: 'small',
    MEDIUM: 'medium'
}

export const DropdownType = {
    DEFAULT: 'default', 
    CLEAN: 'clean'
}

const ButtonDropdown = ({ trigger, menu }) => {
    const [open, setOpen] = React.useState(false);
  
    const handleOpen = () => {
      setOpen(!open);
    };
  
    return (
        <div className="atmDropdownContent">
            {React.cloneElement(trigger, {
                onClick: handleOpen,
            })}
            {open ? (
                <ul className="atmDropdownMenu">
                    {menu.map((menuItem, index) => (
                        <li key={index} className="atmDropdownMenuItem">
                            {React.cloneElement(menuItem, {
                                onClick: () => {
                                    menuItem.props.onClick();
                                    setOpen(false);
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
    size: DropdownSize.MEDIUM,
    buttonClass: '',
    disabled: false,
    faClass: "fas fa-flag"
};  