import React  from "react";
// import JSONView from 'react-json-view';

function ObjectView({objectList, onObjectSelection, viewMode}) {
    console.log("objectList", objectList) 
    if (viewMode === "grid") {
        return (
            <div className="row">
                {objectList.map((item,i) => 
                    <div className="col-6 col-lg-4 col-xl-2" key={i}>
                        <button className="molContainersButtonGrid d-flex flex-column align-items-center justify-content-between" onClick={()=> onObjectSelection(item.id)}>
                            {/* 
                            <div className="atmButtonOptions">
                                <i className="far fa-ellipsis-h"/>
                            </div>
                            <i className="fas fa-3x fa-draw-square"/> */ }
                            <div class="file-icon file-icon-lg" data-type="doc"></div>
                            <span className="atmContainerName">{item.name}</span>
                        </button>
                    </div>
                )}
            </div>
        )
    } else {
        return (
            <div className="row">
                {objectList.map((item,i) => 
                    <div className="col-12" key={i}>
                        <button className="molContainersButtonRow d-flex flex-row align-items-center" onClick={()=> onObjectSelection(item.id)}>
                            <i className="fas fa-file"/>
                            <span className="atmContainerName">{item.name}</span>
                        </button>
                    </div>
                )}
            </div>
        )
    }
}

export default ObjectView;


