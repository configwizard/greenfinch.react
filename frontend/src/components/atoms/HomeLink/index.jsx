import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';

const HomeLink = ({ text, faClass, onClick, className }) => {
    return (
            <button
                className={className}
                onClick={onClick}>
                    <i className={faClass} />{text}
            </button>
        )
    };
export default HomeLink;

HomeLink.propTypes = {
    text: PropTypes.string,
    faClass: PropTypes.string,
    onClick: PropTypes.func
};

HomeLink.defaultProps = {
    text: "Homepage link",
    faClass: "fa-sharp fa-solid fa-flag"
};
