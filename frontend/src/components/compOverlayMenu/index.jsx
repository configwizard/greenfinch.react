import React from "react";
import onClickOutside from "react-onclickoutside";

function CompOverlayMenu(props) {
    //leave this for the time being - it should allow us to click outside to close like the dropdown, but currently not working
    CompOverlayMenu.handleClickOutside = () => props.setShowMenu(false);
    return (
        props.show ? <div className="utTest" onClick={() => props.setShowMenu(false)}>
            <div className="utOverlayMenuSmall" onClick={e => e.stopPropagation()}>
                <nav class="nav flex-column align-items-start">
                    <button className="nav-link active" onClick=""><i className="fas fa-download"/>&nbsp;Download</button>
                    <button className="nav-link" onClick=""><i className="fas fa-trash-alt"/>&nbsp;Delete</button>
                    <button className="nav-link" onClick=""><i className="fas fa-edit"/>&nbsp;Rename</button>
                    <button className="nav-link disabled">Disabled</button>
                </nav>
                {/* <button onClick={async () => {console.log("click close"); await this.props.setShow(false)}} className="atmButtonIcon">Close</button> */}
            </div>
        </div> : null
    )
}


const clickOutsideConfig = {
    handleClickOutside: () => CompOverlayMenu.handleClickOutside,

};

export default onClickOutside(CompOverlayMenu, clickOutsideConfig);
// export default CompOverlayMenu;
