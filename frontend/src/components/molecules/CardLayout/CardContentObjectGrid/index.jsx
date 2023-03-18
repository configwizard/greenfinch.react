import React from 'react';
import PropTypes from 'prop-types';
import MiddleEllipsis from 'react-middle-ellipsis';

// Components
import IconFile from '../../../atoms/IconFile';

// Central style sheet for Card Content
import '../_settings/style.scss';

const CardContentObjectGrid = ({ onClick, dataType, objectFile, objectName, pendingDeleted }) => {
    console.log("OBJECT FILE", objectFile);
    return (
        <button 
            type="button"
            className="molViewObjectsBody d-flex flex-column align-items-center justify-content-between"
            disabled={pendingDeleted ? true : false}
            onClick={pendingDeleted ? null : onClick}>
                { objectFile && (dataType === "jpg" || "jpeg" || "png") ? 
                    <figure className="d-flex align-items-center justify-content-center">
                        <img className="mw-100 mh-100" src={`data:image/png;base64,${objectFile}`} alt={objectName} data-type={dataType} />
                    </figure> 
                : 
                    <IconFile
                        type={dataType}
                        size="medium"/>
                }
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
