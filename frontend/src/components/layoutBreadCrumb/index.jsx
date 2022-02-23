import React, { useState } from "react";

import CompWallet from "../compWallet";

function BreadCrumb() {
    const [show, setShow] = useState(false)
    return (
        <div className="molBlockBread d-flex align-items-center">
            {/* TODO: This is manually added for now*/}
            <div>
                <span className="atmBreadWallet"><i className="fas fa-lg fa-wallet"/>NQtxsStXxadvtRyz2B1yJXTXCeEoxsUJBkxW</span><span>Containers&nbsp;&nbsp;<i className="fas fa-caret-right"/>&nbsp;&nbsp;_</span>{/* breadcrumb horizontal */}
            </div>
            <div className="ms-auto">
                <button type="button" className="atmButtonIconClean utButtonWallet" onClick={() => setShow(true)}><i className="far fa-wallet" />
                    <CompWallet onClose={() => setShow(false)} show={show}></CompWallet>
                </button>
                <button type="button" className="atmButtonIconClean" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight"><i className="far fa-cog" /></button>

                {/* Offcanvas right: need to do classes and text */}
                    <div className="offcanvas offcanvas-end" tabindex="-1" id="offcanvasRight" aria-labelledby="offcanvasRightLabel">
                        <div className="offcanvas-header d-flex align-items-center">
                            <h4 id="offcanvasRightLabel">Account Settings</h4>
                            <button type="button" className="atmButtonIconClean" data-bs-dismiss="offcanvas" aria-label="Close"><i className="fas fa-times"/></button>
                        </div>
                        <div className="offcanvas-body">
                            <div className="molBlockDropdown d-flex">
                                <div class="dropdown">
                                    <button onclick="myFunction()" class="dropbtn">Dropdown</button>
                                    <div id="myDropdown" class="dropdown-content">
                                        <a href="#server01">Server 01</a>
                                        <a href="#server02">Server 02</a>
                                        <a href="#contact03">Server 03</a>
                                    </div>
                                </div>
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

            </div>
        </div>
    );
}

export default BreadCrumb;