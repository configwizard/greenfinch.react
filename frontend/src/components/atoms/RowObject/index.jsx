import React from 'react';
import PropTypes from 'prop-types';

import Moment from 'react-moment';
import { fileSize } from 'humanize-plus';

import MiddleEllipsis from 'react-middle-ellipsis';

import './style.scss';

const RowObject = ({ onClick, dataType, objectFile, objectName, objectSize, uploadedAt }) => {
    return (
        <>
            <button 
                type="button" 
                className="atmButtonRowContent"
                onClick={onClick}>
                
                <div className="atmRowList d-flex flex-row flex-grow-1 align-items-center">
                    <div className="atmRowImage d-flex">
                        { objectFile ? <figure className="atmRowFile d-flex align-items-center justify-content-center"><img className="mw-100 mh-100" src={`data:image/png;base64,${objectFile}`} alt={objectName} /></figure> : <i className="fas fa-folder" data-type={dataType}/> }
                    </div>
                    <div className="atmRowName">
                        <MiddleEllipsis>
                            <span className="atmButtonRowName">{objectName}</span>
                        </MiddleEllipsis>
                    </div>
                    <div className="atmRowDefault">{fileSize(objectSize)}</div>
                    <div className="atmRowDefault"><Moment unix format="DD MMM YY">{uploadedAt}</Moment></div>
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