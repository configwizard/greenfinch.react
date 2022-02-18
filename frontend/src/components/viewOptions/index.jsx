import React from "react";
import {createContainer} from "../../mocker/containers.js";

function ControlBar({containers, selectedContainer, onSelected, changeView, viewMode}) {
    console.log("containerList", containers)

    return (
        <div className="row">
            <div className="col-12">
                <div className="molContainersHeader d-flex align-items-center">
                    <div className="molButtonGroup">
                        <span className="atmContainerTitle">
                            {selectedContainer ? "Objects - " : "Containers - "}{viewMode === 'grid' ? "Grid View" : "List View"}
                        </span>
                    </div>
                    <div className="ms-auto molButtonGroup">
                        <button type="button" className={`atmButtonSimple ${selectedContainer ? "utInactive" : "utActive"}`} onClick={async () => createContainer("my container")}><i className="fas fa-plus-circle"/>New container</button>
                    </div>
                    <div className="molButtonGroup">
                        <button type="button" className={`atmButtonIcon ${selectedContainer ? "utActive" : "utInactive"}`} onClick=""><i className="fas fa-arrow-alt-to-left" /></button>
                    </div>
                    <div className="molButtonGroup">
                        <button type="button" className={`atmButtonIcon ${viewMode === 'grid' ? "utLive" : "utReady"}`} onClick={()=>{changeView("grid")}}><i className="fas fa-th-large" /></button>
                        <button type="button" className={`atmButtonIcon ${viewMode === 'grid' ? "utReady" : "utLive"}`} onClick={()=>{changeView("list")}}><i className="fas fa-list" /></button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ControlBar;
