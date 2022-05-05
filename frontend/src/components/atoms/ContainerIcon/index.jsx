import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';

export const IconSize = {
    SMALL: 'small',
    MEDIUM: 'medium',
    LARGE: 'large',
}

const ContainerIcon = ({ size }) => {
    return (
        <div className={`neo folder-icon ${[size]}`}></div>
    )
}
export default ContainerIcon;

ContainerIcon.propTypes = {
    size: PropTypes.oneOf(Object.keys(IconSize)),
};

ContainerIcon.defaultProps = {
    size: IconSize.MEDIUM
};  