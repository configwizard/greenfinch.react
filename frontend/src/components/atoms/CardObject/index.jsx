import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';

const CardObject = ({ onClick, dataType, objectName }) => {
    return (
        <button 
            type="button"
            className="atmButtonGridContent d-flex flex-column align-items-center justify-content-between"
            onClick={onClick}>
                <div className="file-icon file-icon-lg" data-type={dataType}></div>
                <span className="atmButtonGridName">{objectName}</span>
        </button>
    )
}
export default CardObject;

CardObject.propTypes = {
    onClick: PropTypes.func,
    dataType: PropTypes.string,
    objectName: PropTypes.string
}

CardObject.defaultProps = {
    objectName: "Object name"
}