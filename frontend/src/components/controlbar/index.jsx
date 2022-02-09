import React  from "react";
// import JSONView from 'react-json-view';
import {createContainer} from "../../mocker/containers.js";

function ControlBar({containers, onSelected, changeView}) {
    console.log("containerList", containers)
    return (
        <div className="row">
        <div className="col-12">
            <div className="molContainersHeader d-flex">
                <div>
                    <h2 className="atmContainerTitle">Containers</h2>
                </div>
                <div className="ms-auto">
                    <button className="atmButtonIcon active" onClick={()=>{changeView("grid")}}><i className="fas fa-th-large" /></button>
                    <button className="atmButtonIcon" onClick={()=>{changeView("list")}}><i className="fas fa-list" /></button>
                    <button className="atmButtonSimple" onClick={async () => createContainer("my container")}><i className="fas fa-archive"/>New container</button>
                </div>
            </div>
        </div>
    </div>
    );
}

export default ControlBar;



