import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';

export const IconFolderSize = {
    SMALL: 'small',
    MEDIUM: 'medium',
    LARGE: 'large',
}

const IconFolder = ({ size, pendingDeleted }) => {
    return (
        <div className={`neo folder-icon ${[size]} ${pendingDeleted ? "pending-deleted" : "" }` }></div>
    )
}
export default IconFolder ;

IconFolder.propTypes = {
    size: PropTypes.oneOf(Object.keys( IconFolderSize)),
};

IconFolder.defaultProps = {
    size:  IconFolderSize.MEDIUM
};  