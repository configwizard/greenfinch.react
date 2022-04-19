import React from 'react';
import {Link, Route, useRouteMatch} from 'react-router-dom';

// Components
import NavlinkSide from '../../atoms/NavlinkSide';
import Tooltip from '../../atoms/Tooltip';

import './style.scss';

export default function NavbarSide() {
    return (
        <div className="org-navbar-side d-flex flex-column align-items-start">
            <div className="mb-auto">
                <ul className="d-flex flex-column justify-content-center">
                    <Tooltip content="Home" direction="right">
                        <NavlinkSide
                            id={"navLinkHome"}
                            faClass={"fal fa-home"}
                            label={"Home"} />
                    </Tooltip>
                    <Tooltip content="Containers" direction="right">
                        <NavlinkSide
                            id={"navLinkContainers"}
                            faClass={"fal fa-copy"}
                            label={"Containers"} />
                    </Tooltip>
                    <Tooltip content="Websites" direction="right">
                        <NavlinkSide
                            id={"navLinkWebsites"}
                            faClass={"fal fa-globe"}
                            label={"Search"} />
                    </Tooltip>
                </ul>
            </div>
            <div>
                <ul className="d-flex flex-column justify-content-center">
                    <Tooltip content="Notifications" direction="right">
                        <NavlinkSide
                            id={"navLinkNotifications"}
                            faClass={"fal fa-bell"}
                            label={"Notifications"} />
                    </Tooltip>
                    <Tooltip content="Wallet" direction="right">
                        <NavlinkSide
                            id={"navLinkWallet"}
                            faClass={"fal fa-wallet"}
                            label={"Wallet"} />
                    </Tooltip>
                    <Tooltip content="Settings" direction="right">
                        <NavlinkSide
                            id={"navLinkSettings"}
                            faClass={"fal fa-cog"}
                            label={"Settings"} />
                    </Tooltip>
                </ul>
            </div>
        </div>

    );
}