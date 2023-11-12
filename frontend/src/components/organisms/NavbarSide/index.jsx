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
                            faClass={"fa-sharp fa-regular fa-house"}
                            label={"Home"} />
                    </Tooltip>
                    <Tooltip content="Containers" direction="right">
                        <NavlinkSide
                            to={"/containers"}
                            faClass={"fa-sharp fa-regular fa-table-tree"}
                            label={"Containers"} />
                    </Tooltip>
                    <Tooltip content="Contacts" direction="right">
                        <NavlinkSide
                            to={"/contacts"}
                            faClass={"fa-sharp fa-regular fa-address-book"}
                            label={"Contacts"} />
                    </Tooltip>
                    <Tooltip content="Shared with me" direction="right">
                        <NavlinkSide
                            to={"/shared"}
                            faClass={"fa-sharp fa-regular fa-share-nodes"}
                            label={"Shared Containers"} />
                    </Tooltip>
                    <Tooltip content="Websites" direction="right">
                        <NavlinkSide
                            to={"/websites"}
                            faClass={"fa-sharp fa-regular fa-globe"}
                            label={"Websites"} />
                    </Tooltip>
                    <Tooltip content="NFT Management" direction="right">
                        <NavlinkSide
                            to={"/nfts"}
                            faClass={"fa-sharp fa-regular fa-hexagon-vertical-nft-slanted"}
                            label={"NFT Management"} />
                    </Tooltip>
                    <Tooltip content="Wallet Connect" direction="right">
                        <NavlinkSide
                            to={"/wconnect"}
                            faClass={"fal fa-tick"}
                            label={"Wallet Connect"} />
                    </Tooltip>
                    {/*
                    <Tooltip content="Test Page" direction="right">
                        <NavlinkSide
                            to={"/test"}
                            faClass={"fa-sharp fa-regular fa-microscope"}
                            label={"Test"} />
                    </Tooltip>
                    */}
                </ul>
            </div>
            <div>
                <ul className="d-flex flex-column justify-content-center">
                    <Tooltip content="Notifications" direction="right">
                        <NavlinkSide
                            to={"/notification"}
                            faClass={"fa-sharp fa-regular fa-bell"}
                            label={"Notifications"} />
                    </Tooltip>

                    <Tooltip content="Wallet" direction="right">
                        <button type="button" className="navbarSide" data-bs-toggle="offcanvas" data-bs-target="#offcanvasLeft" aria-controls="offcanvasLeft"><i className="fa-sharp fa-regular fa-wallet" /></button>
                        <DrawerWallet refreshAccount={props.refreshAccount} account={props.account} topUpWallet={topUpWallet}></DrawerWallet>
                    </Tooltip>
                    <Tooltip content="Settings" direction="right">
                        <button type="button" className="navbarSide" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight"><i className="fa-sharp fa-regular fa-gear" /></button>
                        <DrawerSettings selectedNetwork={props.selectedNetwork} version={props.version}></DrawerSettings>
                    </Tooltip>
                </ul>
            </div>
        </div>
    );
}

export default NavbarSide;
