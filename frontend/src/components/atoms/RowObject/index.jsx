import React from 'react';
import PropTypes from 'prop-types';

import Moment from 'react-moment';
import { fileSize } from 'humanize-plus';

import MiddleEllipsis from 'react-middle-ellipsis';

import './style.scss';

const RowObject = ({ onClick, dataType, objectFile, objectName, objectSize, objectOrigin }) => {
    return (
        <>
            <button 
                type="button" 
                className="atmButtonRowContent"
                onClick={onClick}>
                
                <div className="atmRowList d-flex flex-row flex-grow-1">
                    <div class="imagewrapper d-flex align-items-center">
                        { objectFile ? <figure className="atmRowFile d-flex align-items-center justify-content-center"><img className="mw-100 mh-100" src={`data:image/png;base64,${objectFile}`} alt={objectName} /></figure> : <i className="fas fa-folder" data-type={dataType}/> }
                    </div>
                    <div className="setwidth">
                        <MiddleEllipsis>
                            <span className="atmButtonRowName">{objectName}</span>
                        </MiddleEllipsis>
                    </div>
                    <div>{fileSize(objectSize)}</div>
                    <div><Moment unix format="DD MMM YY">{objectOrigin}</Moment></div>
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
    objectOrigin: PropTypes.number
}

RowObject.defaultProps = {
    objectName: "Object name"
}