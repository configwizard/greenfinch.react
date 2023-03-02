import React from 'react';
import PropTypes from 'prop-types';

// Components
import ContainerIcon from '../../../atoms/ContainerIcon';

// Central style sheet for Card Content (molecule)
import '../_settings/style.scss';

const CardContentBody = (onClick, containerName, pendingDeleted) => {
    return (
        <div className="molCardContentBody d-flex flex-row align-items-center">
            <button 
                type="button"
                className="atmButtonGridContent d-flex flex-column align-items-center justify-content-between"
                onClick={onClick}>
                    <ContainerIcon
                        size={"medium"}
                        pendingDeleted={pendingDeleted} />
                    <span>{containerName}</span>
            </button>
        </div>
    )
}

export default CardContentBody;

CardContentBody.propTypes = {
    onClick: PropTypes.func,
    contentName: PropTypes.string
}

CardContentBody.defaultProps = {
    contentName: "Content name"
}