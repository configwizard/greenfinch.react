import React from 'react';
import {openInDefaultBrowser, getVersion} from "../../../../manager/manager"

// Components

// Central style sheet for drawers
import '../_settings/style.scss';

const DrawerSettings = (props) => {
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
                    <div className="molBlockDropdown d-flex">
                        {/*
                            <Dropdown></Dropdown>
                        */}
                        {/* <div class="dropdown">
                            <button onclick="myFunction()" class="dropbtn">Dropdown</button>
                            <div id="myDropdown" class="dropdown-content">
                                <a href="#server01">Server 01</a>
                                <a href="#server02">Server 02</a>
                                <a href="#contact03">Server 03</a>
                            </div>
                        </div> */}
                    </div>
                    <div className="molBlockSwitch d-flex">
                        <div className="atmSwitchContent">
                            <h5>Network</h5>
                            <p>Testnet</p>
                            <p className="temp-small">N.B. Testnet/Mainnet disabled for hackathon.</p>
                        </div>
                        {/*
                            <div className="atmSwitchToggle ms-auto">
                                <label className="switch">
                                    <input type="checkbox"/>
                                    <span className="slider round"></span>
                                </label>
                            </div>
                        */}
                    </div>
                    <div className="molBlockSwitch d-flex">
                        <div className="atmSwitchContent">
                            <h5>Local server API</h5>
                            <p className="temp-small">Expose locally public read containers content. This allows other applications to access your public objects. To access it, visit <button onClick={() => openInDefaultBrowser("http://localhost:43520/api/v1/readonly?since=0")}>http://localhost:43520/api/v1/readonly?since=0</button>,<br />where <b>since=...</b> can be used to filter objects by a unix timestamp (in seconds).</p>
                        </div>
                        {/*
                        <div className="atmSwitchToggle ms-auto">
                            <label className="switch">
                                <input type="checkbox"/>
                                <span className="slider round"></span>
                            </label>
                        </div>
                        */}
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
