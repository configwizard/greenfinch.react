import React from 'react';
import PropTypes from 'prop-types';

// Components
import ContainerIcon from '../../atoms/ContainerIcon';

import './style.scss';

const CardContainer = ({ onClick, containerName, pendingDeleted }) => {
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
export default CardContainer;

CardContainer.propTypes = {
    onClick: PropTypes.func,
    containerName: PropTypes.string
}

CardContainer.defaultProps = {
    containerName: "Container name"
}