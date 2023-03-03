import React from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import { fileSize } from 'humanize-plus';
import MiddleEllipsis from 'react-middle-ellipsis';

// Components
import IconFolder from '../../../atoms/IconFolder';

// Central style sheet for Card Content
import '../_settings/style.scss';

const CardContentContainerRow = ({ onClick, containerName, containerSize, containerOrigin, pendingDeleted }) => {
    return (
        <>
            <button 
                type="button" 
                className="molViewContainersBody" 
                onClick={onClick}>
                    <IconFolder
                        size={"small"}
                        pendingDeleted={pendingDeleted} />
                    <MiddleEllipsis>
                        <span className="atmContentName">{containerName}</span>
                    </MiddleEllipsis>
                <div className="atmContentDefault">{fileSize(containerSize)}</div>
                <div className="atmContentDefault"><Moment unix format="DD MMM YY">{containerOrigin}</Moment></div>
            </button>
        </>
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