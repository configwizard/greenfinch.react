import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';

export const ElementSize = {
    SMALL: 'small',
    MEDIUM: 'medium',
    LARGE: 'large',
}

const RowElement = ({ size, isUppercase, text }) => {
    return (
        <span
            className={`rowElement ${[size]}`}>
            {text}
        </span>
    )
};

export default RowElement;

RowElement.propTypes = {
    size: PropTypes.oneOf(Object.keys(ElementSize)),
    isUppercase: PropTypes.bool,
    text: PropTypes.string
};

RowElement.defaultProps = {
    size: ElementSize.MEDIUM,
    isUppercase: false,
    text: "Row Element"
};                            