import React  from "react";
// import JSONView from 'react-json-view';

function ContainerView({containerList, viewMode, onContainerSelection}) {
    console.log("onContainerSelection", onContainerSelection) 
    if (viewMode == "grid") {
        return (
        <div>
        <h4 className="atmContainerTitle">Cohtainers</h4>
        {containerList.map((item,i) => 
            <div className="col-6 col-lg-4 col-xl-2" key={i}>
                <button className="molContainersButtonGrid d-flex flex-column align-items-center justify-content-between" onClick={() => onContainerSelection(item.id)}>
                    <div className="atmButtonOptions">
                        <i className="far fa-ellipsis-h"/>
                    </div>
                    <i className="fas fa-3x fa-archive"/>
                    <span className="atmContainerName">{item.name}</span>
                </button>
            </div>
        )}
        </div>
        )
    } else {
        return (
            <div>
                <div className="row">
                <h4 className="atmContainerTitle">Containers</h4>
                {containerList.map((item,i) => 
                    <div className="col-12" key={i}>
                        <button className="molContainersButtonRow d-flex flex-row align-items-center" onClick={() => onContainerSelection(item.id)}> 
                            <i className="fas fa-archive"/>
                            <span className="atmContainerName">{item.name}</span>
                        </button>
                    </div>
                )}
                </div>
            </div>
        )

    }
}

export default ContainerView;


