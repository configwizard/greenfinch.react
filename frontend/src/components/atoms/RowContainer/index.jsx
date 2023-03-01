import React from 'react';
import PropTypes from 'prop-types';

import Moment from 'react-moment';
import { fileSize } from 'humanize-plus';

// Components
import ContainerIcon from '../../atoms/ContainerIcon';

import './style.scss';

const RowContainer = ({ onClick, containerName, containerSize, containerOrigin, pendingDeleted }) => {
    return (
        <>
            <div className="atmRowList">
                <button 
                    type="button" 
                    className="atmButtonRowContent" 
                    onClick={onClick}>
                        <ContainerIcon
                            size={"small"}
                            pendingDeleted={pendingDeleted} />
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