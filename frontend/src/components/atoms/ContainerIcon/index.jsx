import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';

export const IconSize = {
    SMALL: 'small',
    MEDIUM: 'medium',
    LARGE: 'large',
}

const ContainerIcon = ({ size, pendingDeleted }) => {
    return (
        <div className={`neo folder-icon ${[size]} ${pendingDeleted ? "pending-deleted" : "" }` }></div>
    )
}
export default ContainerIcon;

ContainerIcon.propTypes = {
    size: PropTypes.oneOf(Object.keys(IconSize)),
};

ContainerIcon.defaultProps = {
    size: IconSize.MEDIUM
};  