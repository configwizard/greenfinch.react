import React from 'react';
import PropTypes from 'prop-types';

// Components
import ContainerIcon from '../../../atoms/ContainerIcon';

// Central style sheet for Card Content
import '../_settings/style.scss';

const CardContentContainerGrid = ({ onClick, containerName, pendingDeleted }) => {
    return (
        <button 
            type="button"
            className="atmButtonGridContent d-flex flex-column align-items-center justify-content-between"
            onClick={onClick}>
                <ContainerIcon
                    size={"medium"}
                    pendingDeleted={pendingDeleted} />
                <span className="atmButtonGridName">{containerName}</span>
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