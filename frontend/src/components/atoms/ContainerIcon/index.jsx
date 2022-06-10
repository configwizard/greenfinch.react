import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';

export const ContainerIconSize = {
    SMALL: 'small',
    MEDIUM: 'medium',
    LARGE: 'large',
}

export const ContainerIconType = {
    NEO: 'neo',
}

const ContainerIcon = ({ type, size }) => {
    return (
        <div className={`containerIcon ${[type]} ${[size]}`}></div>
    )
}

export default ContainerIcon;

ContainerIcon.propTypes = {
    size: PropTypes.oneOf(Object.keys(ContainerIconSize)),
    type: PropTypes.oneOf(Object.keys(ContainerIconType))
};

ContainerIcon.defaultProps = {
    size: ContainerIconSize.MEDIUM,
    type: ContainerIconType.Neo
};