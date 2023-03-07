import React from 'react';
import PropTypes from 'prop-types';

import { Link } from 'react-router-dom'; 

import './style.scss';

const NoContent = ({ text, textAction, textClick, addAction, isPageLink, to, label }) => {
    return (
        <div className="atmNoContent d-flex flex-column align-items-center">
            <i className="fa-2x fa-solid fa-sharp fa-triangle-exclamation"/>
            <span>{text}</span>
            {addAction ? 
                <span><button type="button" className="atmSimpleText" onClick={textClick}>{textAction}</button></span> 
            : null
            }
            {isPageLink ? 
                <Link to={to}>{label}</Link>
            : null
            }
        </div>
        )
    };
export default NoContent;

NoContent.propTypes = {
    text: PropTypes.string.isRequired,
    addAction: PropTypes.bool,
    isPageLink: PropTypes.bool,
    textAction: PropTypes.string,
    textClick: PropTypes.func,
};

NoContent.defaultProps = {
    text: "Instructional text",
    addAction: true,
    isPageLink: false,
    textAction: "Click here to do something fun"
};
