import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';

const NoContent = ({ text }) => {
    return (
            <div className="no-content"><i className="fas fa-exclamation-triangle"/>{text}</div>
        )
    };
export default NoContent;

NoContent.propTypes = {
    text: PropTypes.string
};

NoContent.defaultProps = {
    text: "Homepage link"
};
