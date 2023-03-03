import React from 'react';
import PropTypes from 'prop-types';

import Moment from 'react-moment';
import { fileSize } from 'humanize-plus';

import MiddleEllipsis from 'react-middle-ellipsis';

const RowObject = ({ onClick, dataType, objectFile, objectName, objectSize, uploadedAt }) => {
    return (
        <>
            <button 
                type="button" 
                onClick={onClick}>
                
                <div className="d-flex flex-row flex-grow-1 align-items-center">
                    <div className="d-flex">
                        { objectFile ? <figure className="d-flex align-items-center justify-content-center"><img className="mw-100 mh-100" src={`data:image/png;base64,${objectFile}`} alt={objectName} /></figure> : <i className="fas fa-folder" data-type={dataType}/> }
                    </div>
                    <div>
                        <MiddleEllipsis>
                            <span>{objectName}</span>
                        </MiddleEllipsis>
                    </div>
                    <div>{fileSize(objectSize)}</div>
                    <div><Moment unix format="DD MMM YY">{uploadedAt}</Moment></div>
                </div>
            </button>  
        </>
    )
}
export default RowObject;

RowObject.propTypes = {
    onClick: PropTypes.func,
    objectName: PropTypes.string,
    objectSize: PropTypes.number,
    uploadedAt: PropTypes.number
}

RowObject.defaultProps = {
    objectName: "Object name"
}