import React from 'react';
import PropTypes from 'prop-types';

import Moment from 'react-moment';
import { fileSize } from 'humanize-plus';

import './style.scss';

const RowObject = ({ onClick, objectName, objectSize, objectOrigin }) => {
    return (
        <>
             <div className="atmRowList">
                <button 
                    type="button" 
                    className="atmButtonRowContent"
                    onClick={onClick}
                    >
                        <i className="fas fa-folder"/>
                        <span className="atmButtonRowName">{objectName}</span>
                </button>
            </div>
            <div className="atmRowList">{fileSize(objectSize)}</div>
            <div className="atmRowList"><Moment unix format="DD MMM YY">{objectOrigin}</Moment></div>
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