import React from 'react';
import PropTypes from 'prop-types';

import { NavLink } from 'react-router-dom'; 

import './style.scss';

const NavlinkSide = ({ to, label, faClass, disabled }) => {
    return (
        <li className="navlink-side d-flex">
            <NavLink
                to={to}
                className={({ isActive }) => (isActive ? 'active' : 'inactive')}
                label={label}
                disabled={disabled}>
                    <i className={faClass} />
            </NavLink>
        </li>
        )
    };
export default NavlinkSide;

NavlinkSide.propTypes = {
    to: PropTypes.string.isRequired,
    label: PropTypes.string,
    faClass: PropTypes.string
};

NavlinkSide.defaultProps = {
    label: "Navbar Link",
    faClass: "fas fa-flag"
};
