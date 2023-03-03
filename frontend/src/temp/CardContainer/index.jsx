import React from 'react';
import PropTypes from 'prop-types';

// Components
import IconFolder from '../../atoms/IconFolder';

import './style.scss';

const CardContainer = ({ onClick, containerName, pendingDeleted }) => {
    return (
        <button 
            type="button"
            className="atmButtonGridContent d-flex flex-column align-items-center justify-content-between"
            onClick={onClick}>
                <IconFolder
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