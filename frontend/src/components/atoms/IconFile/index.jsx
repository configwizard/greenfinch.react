import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';

export const IconFileSize = {
    SMALL: 'small',
    MEDIUM: 'medium',
    LARGE: 'large',
}

export const IconFileType = {
    GENERIC: 'generic',
    AI: 'ai',
    DOCX: 'docx',
    INDD: 'indd',
    MP4: 'mp4',
    PSD: 'psd',
    SVG: 'svg',
    TXT: 'txt',
    XLS: 'xls',
}

const IconFile = ({ type, size,  pendingDeleted }) => {
    return (
        <div className={`file-icon ${[type]} ${[size]} ${pendingDeleted ? "pending-deleted" : null }` } data-type={`${[type]}`}></div>
    )
}
export default IconFile;

IconFile.propTypes = {
    size: PropTypes.oneOf(Object.keys(IconFileSize)),
    type: PropTypes.oneOf(Object.keys(IconFileType)),
    pendingDeleted: PropTypes.bool,
};

IconFile.defaultProps = {
    size: IconFileSize.MEDIUM,
    type: IconFileType.GENERIC,
    pendingDeleted: "false",
};  