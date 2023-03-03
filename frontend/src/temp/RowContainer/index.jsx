import React from 'react';
import PropTypes from 'prop-types';

import Moment from 'react-moment';
import { fileSize } from 'humanize-plus';

// Components
import IconFolder from '../../atoms/IconFolder';

import './style.scss';

const RowContainer = ({ onClick, containerName, containerSize, containerOrigin, pendingDeleted }) => {
    return (
        <>
            <div>
                <button 
                    type="button" 
                    onClick={onClick}>
                        <IconFolder
                            size={"small"}
                            pendingDeleted={pendingDeleted} />
                        <span>{containerName}</span>
                </button>
            </div>
            <div>{fileSize(containerSize)}</div>
            <div><Moment unix format="DD MMM YY">{containerOrigin}</Moment></div>
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