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

export const LoadingTheme = {
    LIGHT: 'dot-light',
    DARK: 'dot-dark',
}

const SpinnerLoading = ({ size, type, theme, hasText, text, isVisible }) => {
    return (
        isVisible ? (
            <div className={`atmSpinnerWrapper ${[size]} ${[theme]}`}>
                <div className="atmSpinnerInner d-flex align-items-center justify-content-center">
                    <div class={`${[type]}`}></div>
                </div>
                { hasText ? 
                    <div className="atmSpinnerText">{text}</div>
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
    theme: PropTypes.oneOf(Object.keys(LoadingTheme)),
    hasText: PropTypes.bool,
    text: PropTypes.string,
    isVisible: PropTypes.bool, 
};

SpinnerLoading.defaultProps = {
    size: LoadingSize.SMALL,
    type: LoadingType.FLASH,
    theme: LoadingTheme.LIGHT,
    isVisible: false,
    hasText: true,
    text: "Loading...",
};