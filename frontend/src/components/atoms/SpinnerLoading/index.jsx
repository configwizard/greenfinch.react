import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';

export const SpinnerSize = {
    SMALL: 'small',
    MEDIUM: 'medium',
    LARGE: 'large',
}

const SpinnerLoading = ({ size, faClass, text, isVisible }) => {
    return (
        isVisible ? (
            <div className="atmSpinnerLoading">
                <i className="fad fa-spinner fa-spin"/>
                icon
                <span>{text}</span>
            </div>
        )
            : null
        )
    };
export default SpinnerLoading;

SpinnerLoading.propTypes = {
    size: PropTypes.oneOf(Object.keys(SpinnerSize)),
    text: PropTypes.string,
    isVisible: PropTypes.bool,
};

SpinnerLoading.defaultProps = {
    size: SpinnerSize.SMALL,
    isVisible: false,
    text: "Loading...",
};