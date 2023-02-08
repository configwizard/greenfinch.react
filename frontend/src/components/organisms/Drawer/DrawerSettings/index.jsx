import React from 'react';
import {openInDefaultBrowser, getVersion} from "../../../../manager/manager"

// Components

// Central style sheet for drawers
import '../_settings/style.scss';

const DrawerSettings = (props) => {

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => {
        setOpen(!open);
    };

    return (
        <>
            {/* This is what was needed for the a drawer to appear on click of cog:
                    <button type="button" className="atmButtonIconClean" data-bs-toggle="offcanvas" data-bs-target="#offcanvasLeft" aria-controls="offcanvasLeft"><i className="far fa-cog" /></button>
            */}

            {/* To sort: Offcanvas left; need to do classes and text */}

            <div className="offcanvas offcanvas-end" tabIndex="-1" id="offcanvasRight" aria-labelledby="offcanvasRightLabel">
                <div className="offcanvas-header d-flex align-items-center">
                    <h4 id="offcanvasRightLabel"><i className="fas fa-lg fa-cog"/>&nbsp;Account Settings</h4>
                    <button type="button" className="button-offcanvas" data-bs-dismiss="offcanvas" aria-label="Close"><i className="fas fa-times"/></button>
                </div>
                <div className="offcanvas-body">

                    {/* Switch toggle element, to become a component */}
                    <div className="molBlockSwitch d-flex">
                        <div className="atmSwitchContent">
                            <h5>Mainnet</h5>
                        </div>
                        <div className="atmSwitchToggle ms-auto">
                            <label className="switch">
                                <input type="checkbox"/>
                                <span className="slider round"></span>
                            </label>
                        </div>
                    </div>

                    {/* Dropdown element, to become a component 
                    https://www.robinwieruch.de/react-dropdown/ */}
                    <div className="molBlockDropdown d-flex">
                        <div className="atmDropdownContent">
                            <button onClick={handleOpen}>Dropdown</button>
                            {open ? (
                                <ul className="atmDropdownMenu">
                                    <li className="atmDropdownMenuItem">
                                        <button>Menu 1</button>
                                    </li>
                                    <li className="atmDropdownMenuItem">
                                        <button>Menu 2</button>
                                    </li>
                                </ul>
                            ) : null}
                        </div>
                        <div className="atmSwitchToggle ms-auto">
                            {open ? <div>Is Open</div> : <div>Is Closed</div>}
                        </div>
                    </div>
                    <div className="molBlockSwitch d-flex">
                        <div className="atmSwitchContent">
                            <h5>Local server API</h5>
                            <p className="temp-small">Expose locally public read containers content. This allows other applications to access your public objects. To access it, visit <button onClick={() => openInDefaultBrowser("http://localhost:43520/api/v1/readonly?since=0")}>http://localhost:43520/api/v1/readonly?since=0</button>,<br />where <b>since=...</b> can be used to filter objects by a unix timestamp (in seconds).</p>
                        </div>
                    </div>
                    <div className="molBlockSwitch d-flex">
                        <div className="atmSwitchContent">
                            <h5>Version</h5>
                            <p>{props.version}</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default DrawerSettings;
