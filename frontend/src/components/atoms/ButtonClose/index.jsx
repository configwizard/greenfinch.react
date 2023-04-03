import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';

export const IconSize = {
    SMALL: 'small',
    MEDIUM: 'medium',
}

export const CloseType = {
    DIV: 'div',
}

const ButtonClose = ({ onClick, size, type }) => {
    return (
        <div className={`atmButtonClose ${[size]} ${[type]}`}>
            <i className="fa-sharp fa-solid fa-xmark" onClick={onClick} />
        </div>
    )
}


export const ButtonCancel = ({ onClick, size, type }) => {
    return (
        <div className={`atmButtonClose ${[size]} ${[type]}`}>
            <i className="fa-sharp fa-solid fa-stop" onClick={onClick} />
        </div>
    )
}


export default ButtonClose;

ButtonClose.propTypes = {
    size: PropTypes.oneOf(Object.keys(IconSize)),
    type: PropTypes.oneOf(Object.keys(CloseType)),
    onClick: PropTypes.func
};

ButtonClose.defaultProps = {
    size: IconSize.SMALL,
    type: CloseType.DIV,
};