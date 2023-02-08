import React from 'react';

import { topUpNeoFS } from "../../../manager/manager";

// Components
import NavlinkSide from '../../atoms/NavlinkSide';
import Tooltip from '../../atoms/Tooltip';

import DrawerSettings from '../Drawer/DrawerSettings';
import DrawerWallet from '../Drawer/DrawerWallet';

import './style.scss';

const NavbarSide = (props) => {
    function topUpWallet(amount) {
        console.log("top up amount", amount)
        alert("topping up amount " + amount)

        const result = topUpNeoFS(amount)
        console.log(result)
    }
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
                    <Tooltip content="Contacts" direction="right">
                        <NavlinkSide
                            to={"/contacts"}
                            faClass={"fal fa-address-book"}
                            label={"Contacts"} />
                    </Tooltip>
                    <Tooltip content="Shared with me" direction="right">
                        <NavlinkSide
                            to={"/shared"}
                            faClass={"fal fa-share-alt"}
                            label={"Shared Containers"} />
                    </Tooltip>
                    <Tooltip content="Websites" direction="right">
                        <NavlinkSide
                            to={"/websites"}
                            faClass={"fal fa-globe"}
                            label={"Websites"} />
                    </Tooltip>
                    <Tooltip content="NFT Management" direction="right">
                        <NavlinkSide
                            to={"/nfts"}
                            faClass={"fal fa-hexagon"}
                            label={"NFT Management"} />
                    </Tooltip>
                </ul>
            </div>
            <div>
                <ul className="d-flex flex-column justify-content-center">

                    <Tooltip content="Notifications" direction="right">
                        <NavlinkSide
                            to={"/notifications"}
                            faClass={"fal fa-bell"}
                            label={"Notifications"} />
                    </Tooltip>

                    <Tooltip content="Wallet" direction="right">
                        <button type="button" className="navbarSide" data-bs-toggle="offcanvas" data-bs-target="#offcanvasLeft" aria-controls="offcanvasLeft"><i className="fal fa-wallet" /></button>
                        <DrawerWallet refreshAccount={props.refreshAccount} account={props.account} topUpWallet={topUpWallet}></DrawerWallet>
                        {/*
                            <NavlinkSide
                                to={"/toassign02"}
                                faClass={"fal fa-wallet"}
                                label={"Wallet"} />
                        */}
                    </Tooltip>
                    <Tooltip content="Settings" direction="right">
                        <button type="button" className="navbarSide" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight"><i className="fal fa-cog" /></button>
                        <DrawerSettings version={props.version}></DrawerSettings>
                        {/*
                        <NavlinkSide
                            to={"/toassign03"}
                            faClass={"fal fa-cog"}
                            label={"Settings"} />
                        */}
                    </Tooltip>
                </ul>
            </div>
        </div>
    );
}

export default NavbarSide;
