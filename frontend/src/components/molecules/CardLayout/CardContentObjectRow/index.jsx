import React from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import { fileSize } from 'humanize-plus';
import MiddleEllipsis from 'react-middle-ellipsis';

// Components

// Central style sheet for Card Content
import '../_settings/style.scss';

const CardContentObjectRow = ({ onClick, dataType, objectFile, objectName, objectSize, uploadedAt }) => {
    return (
        <button 
            type="button" 
            className="molViewObjectsBody"
            onClick={onClick}>
            <div className="d-flex">
                <div className="d-flex align-items-center">
                    { objectFile ?
                        <figure className="atmContentFile d-flex align-items-center justify-content-center">
                            <img className="mw-100 mh-100" src={`data:image/png;base64,${objectFile}`} alt={objectName} />
                        </figure> : <i className="fa-sharp fa-solid fa-folder" data-type={dataType}/>
                    }
                </div>
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