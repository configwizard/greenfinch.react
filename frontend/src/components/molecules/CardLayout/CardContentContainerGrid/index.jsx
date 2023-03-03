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
            className="atmButtonGridContent d-flex flex-column align-items-center justify-content-between"
            onClick={onClick}>
                <IconFolder
                    size={"medium"}
                    pendingDeleted={pendingDeleted} />
                <MiddleEllipsis>
                    <span className="atmButtonGridName">{containerName}</span>
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