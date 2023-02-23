import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';

const InDevelopment = ({ text }) => {
    return (
            <div className="atmInDevelopment d-flex flex-column align-items-center">
                <i className="fa-2x fa-solid fa-sharp fa-pen-ruler"/>
                <span>{text}</span>
            </div>
        )
    };
export default InDevelopment;

InDevelopment.propTypes = {
    text: PropTypes.string
};

InDevelopment.defaultProps = {
    text: "Homepage link"
};
