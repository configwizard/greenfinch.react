import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';

export const IconFileSize = {
    SMALL: 'small',
    MEDIUM: 'medium',
    LARGE: 'large',
}

const IconFile = ({ size, pendingDeleted }) => {
    return (
        <div className={`neo folder-icon ${[size]} ${pendingDeleted ? "pending-deleted" : "" }` }></div>
    )
}
export default IconFile;

IconFile.propTypes = {
    size: PropTypes.oneOf(Object.keys(IconFileSize)),
};

IconFile.defaultProps = {
    size: IconFileSize.MEDIUM
};  