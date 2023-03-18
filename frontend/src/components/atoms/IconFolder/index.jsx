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

const IconFolder = ({ type, size }) => {
    return (
        <div className={`atmIconFolder ${[type]} ${[size]}`}></div>
    )
}
export default IconFolder ;

IconFolder.propTypes = {
    size: PropTypes.oneOf(Object.keys(IconFolderSize)),
    type: PropTypes.oneOf(Object.keys(IconFolderType)).isRequired,
};

IconFolder.defaultProps = {
    size: IconFolderSize.MEDIUM,
    type: IconFolderType.NATIVE,
};  