import React from 'react';

// Components


import './style.scss';

const Settings = () => {
    return (
        <>
            {/* This is what was needed for the a drawer to appear on click of cog:
                    <button type="button" className="atmButtonIconClean" data-bs-toggle="offcanvas" data-bs-target="#offcanvasLeft" aria-controls="offcanvasLeft"><i className="far fa-cog" /></button>
            */}

            {/* To sort: Offcanvas right; need to do classes and text */}

            <div className="offcanvas offcanvas-end" tabIndex="-1" id="offcanvasRight" aria-labelledby="offcanvasRightLabel">
                <div className="offcanvas-header d-flex align-items-center">
                    <h4 id="offcanvasRightLabel">Account Settings</h4>
                    <button type="button" className="atmButtonIconClean" data-bs-dismiss="offcanvas" aria-label="Close"><i className="fas fa-times"/></button>
                </div>
                <div className="offcanvas-body">
                    <div className="molBlockDropdown d-flex">
                        <Dropdown></Dropdown>
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
                            <h5>Option</h5>
                            <p>Explanation goes here under the design of the title and toggle. And what if there is tons to say?</p>
                        </div>
                        <div className="atmSwitchToggle ms-auto">
                            <label className="switch">
                                <input type="checkbox"/>
                                <span className="slider round"></span>
                            </label>
                        </div>
                    </div>
                    <div className="molBlockSwitch d-flex">
                        <div className="atmSwitchContent">
                            <h5>Option</h5>
                            <p>Explanation goes here under the design of the title and toggle.</p>
                        </div>
                        <div className="atmSwitchToggle ms-auto">
                            <label className="switch">
                                <input type="checkbox"/>
                                <span className="slider round"></span>
                            </label>
                        </div>
                    </div>
                    <div className="molBlockSwitch d-flex">
                        <div className="atmSwitchContent">
                            <h5>Option</h5>
                            <p>Explanation goes here under the design of the title.</p>
                        </div>
                        <div className="atmSwitchToggle ms-auto">
                            <label className="switch">
                                <input type="checkbox"/>
                                <span className="slider round"></span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Settings;