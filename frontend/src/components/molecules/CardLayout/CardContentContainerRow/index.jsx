import React from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import { fileSize } from 'humanize-plus';
import MiddleEllipsis from 'react-middle-ellipsis';

// Components

// Central style sheet for Card Content
import '../_settings/style.scss';

const CardContentContainerRow = ({ onClick, containerName, containerSize, containerOrigin, pendingDeleted }) => {
    return (
        <button 
            type="button" 
            className="molViewContainersBody" 
            onClick={onClick}>
            <div className="d-flex flex-row flex-md-grow-1">
                <div className="align-self-center">
                    <i className="fa-sharp fa-solid fa-folder"/>
                </div>
                <div className="align-self-center">
                    <MiddleEllipsis>
                        <span className="atmContentName">{containerName}</span>
                    </MiddleEllipsis>
                </div>
                <div className="atmContentDefault align-self-center">{fileSize(containerSize)}</div>
                <div className="atmContentDefault align-self-center"><Moment unix format="DD MMM YY">{containerOrigin}</Moment></div>
            </div>
        </button>
    )
}
export default CardContentContainerRow;

CardContentContainerRow.propTypes = {
    onClick: PropTypes.func,
    containerName: PropTypes.string,
    containerSize: PropTypes.number,
    containerOrigin: PropTypes.number
}

CardContentContainerRow.defaultProps = {
    containerName: "Container name"
}