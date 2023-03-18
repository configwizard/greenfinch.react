import React from 'react';
import PropTypes from 'prop-types';
import MiddleEllipsis from 'react-middle-ellipsis';

// Components
import IconFolder from '../../../atoms/IconFolder';

// Central style sheet for Card Content
import '../_settings/style.scss';

const CardContentContainerGrid = ({ onClick, containerName, pendingDeleted }) => {
    return (
        <button 
            type="button"
            className="molViewContainersBody d-flex flex-column align-items-center justify-content-between"
            disabled={pendingDeleted ? true : false}
            onClick={pendingDeleted ? null : onClick}>
                <IconFolder
                    size={"medium"} 
                    type={"native"} />
                <MiddleEllipsis>
                    <span className="atmContentName">{containerName}</span>
                </MiddleEllipsis>
        </button>
    )
}
export default CardContentContainerGrid;

CardContentContainerGrid.propTypes = {
    onClick: PropTypes.func,
    containerName: PropTypes.string
}

CardContentContainerGrid.defaultProps = {
    containerName: "Container name"
}