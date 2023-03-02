import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';

const NoContent = ({ text, textAction, textClick, addAction }) => {
    return (
        <div className="atmNoContent d-flex flex-column align-items-center">
            <i className="fa-2x fa-solid fa-sharp fa-triangle-exclamation"/>
            <span>{text}</span>
            {addAction ? 
                <span><button type="button" className="atmSimpleText" onClick={textClick}>{textAction}</button></span> 
            : null
            }
        </div>
        )
    };
export default NoContent;

NoContent.propTypes = {
    text: PropTypes.string.isRequired,
    addAction: PropTypes.bool,
    textAction: PropTypes.string,
    textClick: PropTypes.func,
};

NoContent.defaultProps = {
    text: "Instructional text",
    addAction: true,
    textAction: "Click here to do something fun"
};
