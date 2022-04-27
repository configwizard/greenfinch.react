import React from 'react';
import PropTypes from 'prop-types';

import Moment from 'react-moment';
import { fileSize } from 'humanize-plus';

import './style.scss';

const RowContainer = ({ onClick, containerName, containerSize, containerOrigin }) => {
    return (
        <>
            <div className="atmRowList">
                <button 
                    type="button" 
                    className="atmButtonRowContent" 
                    onClick={onClick}>
                        <i className="fas fa-folder"/>
                        <span className="atmButtonRowName">{containerName}</span>
                </button>
            </div>
            <div className="atmRowList">{fileSize(containerSize)}</div>
            <div className="atmRowList"><Moment unix format="DD MMM YY">{containerOrigin}</Moment></div>
        </>
    )
}
export default RowContainer;

RowContainer.propTypes = {
    onClick: PropTypes.func,
    containerName: PropTypes.string,
    containerSize: PropTypes.number,
    containerOrigin: PropTypes.number
}

RowContainer.defaultProps = {
    containerName: "Container name"
}