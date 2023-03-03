import React from 'react';
import PropTypes from 'prop-types';

// Components
import IconFolder from '../../../atoms/IconFolder';

// Central style sheet for Card Content (molecule)
import '../_settings/style.scss';

const CardContentBody = (onClick, containerName, pendingDeleted) => {
    return (
        <div className="molCardContentBody d-flex flex-row align-items-center">
            <button 
                type="button"
                className="molViewContainersBody d-flex flex-column align-items-center justify-content-between"
                onClick={onClick}>
                    <IconFolder
                        size={"medium"}
                        pendingDeleted={pendingDeleted} />
                    <span className="atmContentName">{containerName}</span>
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