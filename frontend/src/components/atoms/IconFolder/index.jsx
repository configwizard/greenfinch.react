import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';

export const IconFolderSize = {
    SMALL: 'small',
    MEDIUM: 'medium',
    LARGE: 'large',
}

export const IconFolderType = {
    NATIVE: 'native',
    SHARED: 'shared',
}

const IconFolder = ({ type, size, pendingDeleted }) => {
    return (
        <div className={`${[type]} ${[size]} atmIconFolder ${pendingDeleted ? "pending-deleted" : null }` } data-type={`${[type]}`}></div>
    )
}
export default IconFolder ;

IconFolder.propTypes = {
    size: PropTypes.oneOf(Object.keys(IconFolderSize)),
    type: PropTypes.oneOf(Object.keys(IconFolderType)),
    pendingDeleted: PropTypes.bool,
};

IconFolder.defaultProps = {
    size: IconFolderSize.MEDIUM,
    type: IconFolderType.NATIVE,
    pendingDeleted: "false",
};  