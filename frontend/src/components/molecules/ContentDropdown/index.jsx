import React from 'react';

import './style.scss';

export const ContentDropdownSize = {
    DEFAULT: 'default'
}

export const ContentDropdownType = {
    ICON: 'icon'
}

const ContentDropdown = (props) => {
    return (
        <>
            <div className="molContentDropdown d-flex align-items-center justify-content-center">
                <button className="btn dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <i className="fa-sharp fa-solid fa-ellipsis"/>
                </button>
                <ul className="dropdown-menu">
                    <li>
                        {props.children}
                    </li>
                </ul>
            </div>
        </>
    )
};

export default ContentDropdown;