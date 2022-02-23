import React from "react";

const CompOverlayMenu = props => {
    
    if(!props.show) {
        return null
    }

    /* Helpful: https://medium.com/tinyso/how-to-create-a-modal-component-in-react-from-basic-to-advanced-a3357a2a716a */
    
    return (
        <div className="utTest" onClick={props.onClose}>
            <div className="utOverlayMenuSmall" onClick={e => e.stopPropagation()}>
                <nav class="nav flex-column align-items-start">
                    <button className="nav-link active" onClick=""><i className="fas fa-download"/>&nbsp;Download</button>
                    <button className="nav-link" onClick=""><i className="fas fa-trash-alt"/>&nbsp;Delete</button>
                    <button className="nav-link" onClick=""><i className="fas fa-edit"/>&nbsp;Rename</button>
                    <button className="nav-link disabled">Disabled</button>
                </nav>
                {/* <button onClick={async () => {console.log("click close"); await this.props.setShow(false)}} className="atmButtonIcon">Close</button> */}
            </div>
        </div>
    )
}

export default CompOverlayMenu;