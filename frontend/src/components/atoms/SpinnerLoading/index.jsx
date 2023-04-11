import React from 'react';
import PropTypes from 'prop-types';

import './_settings/style.scss';

export const SpinnerSize = {
    SMALL: 'small',
    MEDIUM: 'medium',
    LARGE: 'large',
}

const SpinnerLoading = ({ size, hasText, text, isVisible }) => {
    return (
        isVisible ? (
            <div className={`atmSpinnerLoading ${[size]}`}>
                <div class="dot-flashing"></div>
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
    size: PropTypes.oneOf(Object.keys(SpinnerSize)),
    hasText: PropTypes.bool,
    text: PropTypes.string,
    isVisible: PropTypes.bool, 
};

SpinnerLoading.defaultProps = {
    size: SpinnerSize.SMALL,
    isVisible: false,
    hasText: true,
    text: "Loading...",
};