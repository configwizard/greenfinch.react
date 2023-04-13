import React from 'react';
import PropTypes from 'prop-types';

import './_settings/style.scss';

export const LoadingSize = {
    SMALL: 'small',
    MEDIUM: 'medium',
    LARGE: 'large',
}

export const LoadingType = {
    FLASH: 'dot-flashing',
    SPIN: 'dot-spin',
}

const SpinnerLoading = ({ size, type, hasText, text, isVisible }) => {
    return (
        isVisible ? (
            <div className={`atmSpinnerLoading ${[size]}`}>
                <div class={`${[type]}`}></div>
                { hasText ? 
                    <span>{text}</span>
                : null }
            </div>
        )
            : null
        )
    };
export default SpinnerLoading;

SpinnerLoading.propTypes = {
    size: PropTypes.oneOf(Object.keys(LoadingSize)),
    type: PropTypes.oneOf(Object.keys(LoadingType)),
    hasText: PropTypes.bool,
    text: PropTypes.string,
    isVisible: PropTypes.bool, 
};

SpinnerLoading.defaultProps = {
    size: LoadingSize.SMALL,
    type: LoadingType.FLASH,
    isVisible: false,
    hasText: true,
    text: "Loading...",
};