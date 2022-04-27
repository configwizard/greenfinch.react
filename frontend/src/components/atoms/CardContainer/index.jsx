import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';

const CardContainer = ({ onClick, containerName }) => {
    return (
        <button 
            type="button"
            className="atmButtonGridContent d-flex flex-column align-items-center justify-content-between"
            onClick={onClick}>
                <div className="neo folder-icon"></div>
                <span className="atmButtonGridName">{containerName}</span>
        </button>
    )
}
export default CardContainer;

CardContainer.propTypes = {
    onClick: PropTypes.func,
    containerName: PropTypes.string
}

CardContainer.defaultProps = {
    containerName: "Container name"
}