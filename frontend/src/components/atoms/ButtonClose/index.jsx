import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';

export const IconSize = {
    SMALL: 'small',
    MEDIUM: 'medium',
}

const ButtonClose = ({ onClick, size }) => {
    return (
        <div className={`atmButtonClose ${[size]}`}>
            <i className="fa-sharp fa-solid fa-xmark" onClick={onClick} />
        </div>
    )
}

export default ButtonClose;

ButtonClose.propTypes = {
    size: PropTypes.oneOf(Object.keys(IconSize)),
    onClick: PropTypes.func
};

ButtonClose.defaultProps = {
    size: IconSize.SMALL,
};