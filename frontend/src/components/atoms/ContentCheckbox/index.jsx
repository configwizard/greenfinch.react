import React from 'react';

import './style.scss';

const ContentCheckbox = () => {
    return (
        <div className="atmContentCheckbox d-flex align-items-center justify-content-center">
            <div className="form-check">
                <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault"/>
            </div>
        </div>
    )
}

export default ContentCheckbox;