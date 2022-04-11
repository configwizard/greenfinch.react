import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';

const NavlinkSide = ({ id, linkDestination, label, faClass, disabled }) => {
    return (
        <li className="navlink-side d-flex">
            <a
            id={id}
            href={linkDestination}
            className={"align-self-center"}
            label={label}
            disabled={disabled}>
                <i className={faClass} />
            </a>
        </li>
        )
    };
export default NavlinkSide;

NavlinkSide.propTypes = {
    id: PropTypes.string,
    linkDestination: PropTypes.string.isRequired,
    label: PropTypes.string,
    faClass: PropTypes.string
};

NavlinkSide.defaultProps = {
    label: "Navbar Link",
    faClass: "fas fa-flag"
};
