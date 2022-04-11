import React from "react";

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
                            id={"item01"}
                            faClass={"fal fa-home"}
                            label={"Home"} />
                    </Tooltip>
                    <Tooltip content="Search" direction="top">
                        <NavlinkSide
                            id={"item01"}
                            faClass={"fal fa-search"}
                            label={"Search"} />
                    </Tooltip>
                    <Tooltip content="Containers" direction="bottom">
                        <NavlinkSide
                            id={"item01"}
                            faClass={"fal fa-copy"}
                            label={"Containers"} />
                    </Tooltip>
                </ul>
            </div>
            <div>
                <ul className="d-flex flex-column justify-content-center">
                    <Tooltip content="Settings" direction="left">
                        <NavlinkSide
                            id={"item01"}
                            faClass={"fal fa-cog"}
                            label={"Settings"} />
                    </Tooltip>
                </ul>
            </div>
        </div>

    );
}