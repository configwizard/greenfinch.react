import React from 'react';
import PropTypes from 'prop-types';
import MiddleEllipsis from 'react-middle-ellipsis';

// Central style sheet for Card Content
import '../_settings/style.scss';

const CardContentObjectGrid = ({ onClick, dataType, objectFile, objectName, pendingDeleted }) => {
    return (
        <button 
            type="button"
            className="molViewObjectsBody d-flex flex-column align-items-center justify-content-between"
            onClick={onClick}>
                { objectFile ? 
                    <figure className={`d-flex align-items-center justify-content-center ${pendingDeleted ? "pending-deleted" : "" }`}>
                        <img className="mw-100 mh-100" src={`data:image/png;base64,${objectFile}`} alt={objectName} /></figure> 
                        : <div className={`file-icon file-icon-lg ${pendingDeleted ? "pending-deleted" : "" }`} data-type={dataType}></div> }
                <MiddleEllipsis>
                    <span className="atmContentName">{objectName}</span>
                </MiddleEllipsis>
        </button>
    )
}
export default CardContentObjectGrid;

CardContentObjectGrid.propTypes = {
    onClick: PropTypes.func,
    objectFile: PropTypes.string,
    dataType: PropTypes.string,
    objectName: PropTypes.string
}

CardContentObjectGrid.defaultProps = {
    objectName: "Object name"
}