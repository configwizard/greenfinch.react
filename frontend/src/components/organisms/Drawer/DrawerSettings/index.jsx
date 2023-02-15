import React from 'react';
import {openInDefaultBrowser, getVersion} from "../../../../manager/manager"

// Components
import ButtonToggle from '../../../atoms/ButtonToggle';
import ButtonDropdown from '../../../atoms/ButtonDropdown';

// Central style sheet for drawers
import '../_settings/style.scss';

const DrawerSettings = (props) => {
    const handleMenuOne = () => {
        console.log('clicked one');
    };
    const handleMenuTwo = () => {
        console.log('clicked two');
    };
    const handleMenuThree = () => {
        console.log('clicked three');
    };

    return (
        <>
            <div className="offcanvas offcanvas-end" tabIndex="-1" id="offcanvasRight" aria-labelledby="offcanvasRightLabel">
                <div className="offcanvas-header d-flex align-items-center">
                    <h4 id="offcanvasRightLabel"><i className="fas fa-lg fa-cog"/>&nbsp;Account Settings</h4>
                    <button type="button" className="button-offcanvas" data-bs-dismiss="offcanvas" aria-label="Close"><i className="fas fa-lg fa-times"/></button>
                </div>
                <div className="offcanvas-body">

                    <div className="molDrawerRow">
                        <ButtonToggle 
                           size={"small"}
                           type={"default"}
                           toggleHeading={"Main Net"}
                           toogleName={"default"}
                           toggleId={"default"} />
                    </div>

                    <div className="molDrawerRow">
                        <ButtonDropdown
                            size={"small"}
                            type={"default"}
                            trigger={<button className="utDropdown">Select...</button>}
                            menu={[
                            <button onClick={handleMenuOne}>Menu 1</button>,
                            <button onClick={handleMenuTwo}>Menu 2</button>,
                            <button onClick={handleMenuThree}>Menu 3</button>,
                            ]} />
                    </div>

                    <div className="molDrawerRow">
                        <div className="atmSwitchContent">
                            <h5>Local server API</h5>
                            <p className="temp-small">Expose locally public read containers content. This allows other applications to access your public objects. To access it, visit <button onClick={() => openInDefaultBrowser("http://localhost:43520/api/v1/readonly?since=0")}>http://localhost:43520/api/v1/readonly?since=0</button>,<br />where <b>since=...</b> can be used to filter objects by a unix timestamp (in seconds).</p>
                        </div>
                    </div>

                    <div className="molDrawerRow">
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
