import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';

export const InfoBoxType = {
    INFO: 'info',
    WARNING: 'warning',
}

const InfoBox = ({ size, text }) => {
    return (
        <div className={`atmInfoBox ${[size]}`}>
            <span>{text}</span>
        </div>
    )
}
export default InfoBox;

InfoBox.propTypes = {
    size: PropTypes.oneOf(Object.keys(InfoBoxType)),
};

InfoBox.defaultProps = {
    size: InfoBoxType.INFO
};  