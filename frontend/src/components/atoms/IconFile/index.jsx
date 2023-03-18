import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';

export const IconFileSize = {
    SMALL: 'small',
    MEDIUM: 'medium',
    LARGE: 'large',
}

export const IconFileType = {
    GENERIC: null,
    AI: '.ai',
    DOCX: '.docx',
    INDD: '.indd',
    MP4: '.mp4',
    PSD: '.psd',
    SVG: '.svg',
    TXT: '.txt',
    XLS: '.xls',
}

const IconFile = ({ type, size }) => {
    return (
        <div className={`atmIconFile ${[type]} ${[size]}` } data-type={`${[type]}`}></div>
    )
}
export default IconFile;

IconFile.propTypes = {
    size: PropTypes.oneOf(Object.keys(IconFileSize)),
    type: PropTypes.oneOf(Object.keys(IconFileType)),
};

IconFile.defaultProps = {
    size: IconFileSize.MEDIUM,
    type: IconFileType.GENERIC,
};  