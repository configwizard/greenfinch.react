import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';

const NoContent = ({ text, textAction, textClick }) => {
    return (
        <div class="atmNoContent d-flex flex-column align-items-center">
            <i className="fa-2x fa-solid fa-sharp fa-triangle-exclamation"/>
            <span>{text}</span>
            <span><button type="button" class="atmSimpleText" onClick={textClick}>{textAction}</button></span>
        </div>
        )
    };
export default NoContent;

NoContent.propTypes = {
    text: PropTypes.string,
    textAction: PropTypes.string,
    textClick: PropTypes.func,
};

NoContent.defaultProps = {
    text: "Instructional text",
    textAction: "Click here to do something fun"
};
