import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';

const CardObject = ({ onClick, dataType, objectFile, objectName, pendingDeleted }) => {
    return (
        <button 
            type="button"
            className={`atmButtonGridContent d-flex flex-column align-items-center justify-content-between`}
            onClick={onClick}>
            { objectFile ? <figure className={`d-flex align-items-center justify-content-center ${pendingDeleted ? "pending-deleted" : "" }`}><img className="mw-100 mh-100" src={`data:image/png;base64,${objectFile}`} alt={objectName} /></figure> : <div className={`file-icon file-icon-lg ${pendingDeleted ? "pending-deleted" : "" }`} data-type={dataType}></div> }
                <span className="atmButtonGridName">{objectName}</span>
        </button>
    )
}
export default CardObject;

CardObject.propTypes = {
    onClick: PropTypes.func,
    objectFile: PropTypes.string,
    dataType: PropTypes.string,
    objectName: PropTypes.string
}

CardObject.defaultProps = {
    objectName: "Object name"
}