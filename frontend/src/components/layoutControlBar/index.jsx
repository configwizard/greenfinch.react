import React from "react";
import {createContainer} from "../../mocker/containers.js";

function ControlBar({containers, onSelected, changeView, viewMode}) {
    console.log("containerList", containers)

    return (
        <div className="row">
            <div className="col-12">
                <div className="molContainersHeader d-flex">
                    <div>
                        <h2 className="atmContainerTitle">{/* if viewMode === 'x' show here. */}
                            ...
                        </h2>
                    </div>
                    <div className="ms-auto">
                        <button type="button" className={`atmButtonIcon ${viewMode ? "active" : "inactive"}`} onClick={()=>{changeView("grid")}}><i className="fas fa-th-large" /></button>
                        <button type="button" className={`atmButtonIcon ${viewMode ? "active" : "inactive"}`} onClick={()=>{changeView("list")}}><i className="fas fa-list" /></button>
                        {/* <button type="button" className="atmButtonIcon" onClick={()=>{changeView("grid")}}><i className="fas fa-th-large" /></button> */}
                        {/* <button type="button" className="atmButtonIcon" onClick={()=>{changeView("list")}}><i className="fas fa-list" /></button> */}
                        <button type="button" className="atmButtonSimple" onClick={async () => createContainer("my container")}><i className="fas fa-plus-circle"/>New container</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ControlBar;
