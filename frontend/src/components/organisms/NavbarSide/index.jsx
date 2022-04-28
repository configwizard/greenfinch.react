import React from 'react';

// Components
import NavlinkSide from '../../atoms/NavlinkSide';
import Tooltip from '../../atoms/Tooltip';

import './style.scss';

const NavbarSide = () => {
    return (
        <div className="org-navbar-side d-flex flex-column align-items-start">
            <div className="mb-auto">
                <ul className="d-flex flex-column justify-content-center">
                    <Tooltip content="Home" direction="right">
                        <NavlinkSide
                            to={"/"}
                            faClass={"fal fa-home"}
                            label={"Home"} />
                    </Tooltip>
                    <Tooltip content="Containers" direction="right">
                        <NavlinkSide
                            to={"/containers"}
                            faClass={"fal fa-copy"}
                            label={"Containers"} />
                    </Tooltip>
                    <Tooltip content="Websites" direction="right">
                        <NavlinkSide
                            to={"/websites"}
                            faClass={"fal fa-globe"}
                            label={"Websites"} />
                    </Tooltip>
                    <Tooltip content="Contacts" direction="right">
                        <NavlinkSide
                            to={"/contacts"}
                            faClass={"fal fa-address-book"}
                            label={"Contacts"} />
                    </Tooltip>
                    <Tooltip content="Test" direction="right">
                        <NavlinkSide
                            to={"/test"}
                            faClass={"fas fa-vial"}
                            label={"Test"} />
                    </Tooltip>
                </ul>
            </div>
            <div>
                <ul className="d-flex flex-column justify-content-center">
                    <Tooltip content="Notifications" direction="right">
                        <NavlinkSide
                            to={"/toassign01"}
                            faClass={"fal fa-bell"}
                            label={"Notifications"} />
                    </Tooltip>
                    <Tooltip content="Wallet" direction="right">
                        <NavlinkSide
                            to={"/toassign02"}
                            faClass={"fal fa-wallet"}
                            label={"Wallet"} />
                    </Tooltip>
                    <Tooltip content="Settings" direction="right">
                        <NavlinkSide
                            to={"/toassign03"}
                            faClass={"fal fa-cog"}
                            label={"Settings"} />
                    </Tooltip>
                </ul>
            </div>
        </div>
    );
}

export default NavbarSide;