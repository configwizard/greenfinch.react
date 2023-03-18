import React from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import { fileSize } from 'humanize-plus';
import MiddleEllipsis from 'react-middle-ellipsis';

// Components
import IconFile from '../../../atoms/IconFile';

// Central style sheet for Card Content
import '../_settings/style.scss';

const CardContentObjectRow = ({ onClick, dataType, objectFile, objectName, objectSize, uploadedAt, pendingDeleted }) => {
    return (
        <button 
            type="button" 
            className="molViewObjectsBody"
            disabled={pendingDeleted ? true : false}
            onClick={pendingDeleted ? null : onClick}>
            <div className="d-flex">
                { objectFile && (dataType === "jpg" || "jpeg" || "png") ?
                    <div className="d-flex align-items-center">
                        <figure className="atmContentFile d-flex align-items-center justify-content-center">
                            <img className="mw-100 mh-100" src={`data:image/png;base64,${objectFile}`} alt={objectName} data-type={dataType} />
                        </figure>
                    </div>
                : 
                    <div className="atmContentFileIcon d-flex align-items-center justify-content-center">
                        <IconFile
                            type={dataType}
                            size="small" />
                    </div>
                }
                <div className="d-flex align-items-center flex-grow-1">
                    <div className="atmContentNameWrapper me-auto">
                        <MiddleEllipsis>
                            <span className="atmContentName">{objectName}</span>
                        </MiddleEllipsis>
                    </div>
                    <div className="atmContentDefault d-none d-xxl-flex"><Moment unix format="DD MMM YY">{uploadedAt}</Moment></div>
                    <div className="atmContentDefault d-none d-xl-flex">{fileSize(objectSize)}</div>
                </div>
            </div>

        </button>
    )
}
export default CardContentObjectRow;

CardContentObjectRow.propTypes = {
    onClick: PropTypes.func,
    objectName: PropTypes.string,
    objectSize: PropTypes.number,
    uploadedAt: PropTypes.number
}

CardContentObjectRow.defaultProps = {
    objectName: "Object name"
}