import React  from "react";
// import JSONView from 'react-json-view';

function ObjectView({objectList, onObjectSelection, viewMode}) {
    console.log("objectList", objectList)
    if (viewMode === "grid") {
        return (
            <div className="row">
                {objectList.length > 0 ? objectList.map((item,i) =>
                    <div className="col-6 col-lg-3 col-xl-2" key={i}>
                        <div className="molButtonGrid">
                            <button 
                                type="button"
                                className="atmButtonGridContent d-flex flex-column align-items-center justify-content-between"
                                onClick={()=> {onObjectSelection(item.id, item.attributes.FileName)}}>
                                    <div class="file-icon file-icon-lg" data-type="png"></div>
                                    <span className="atmButtonGridName">{item.attributes.FileName}</span>
                            </button>
                        </div>
                    </div>
                ) : <div className="atmStatusSmall"><i className="fas fa-exclamation-triangle"/>&nbsp;There are no objects in this container.</div>}
            </div>
        )
    } else {
        return (
            <div className="row">
                {objectList.length > 0 ? objectList.map((item,i) =>
                    <div className="col-12" key={i}>
                        <div className="molButtonRow">
                            <div className="d-flex flex-row align-items-center">
                                <div>
                                    <button
                                        type="button"
                                        className="atmButtonRowContent" 
                                        onClick={()=> onObjectSelection(item.id, item.attributes.FileName)}>
                                            <i className="fas fa-file"/>
                                            <span className="atmButtonRowName">{item.attributes.FileName}</span>
                                    </button>
                                </div>
                                <div className="ms-auto">
                                    &nbsp; {/* placeholder for layout purposes */}    
                                </div>
                            </div>
                        </div>
                    </div>
                ) : <div className="atmStatusSmall"><i className="fas fa-exclamation-triangle"/>&nbsp;There are no objects in this container.</div>}
            </div>
        )
    }
}
// research https://blog.logrocket.com/create-a-drag-and-drop-component-with-react-dropzone/
export function DragAndDrop({onObjectUpload}) {
    //drag and drop
    return (
        <div className="molBlockUpload d-flex align-items-center justify-content-center">
            <div className="atmBlockUpload d-flex flex-column align-items-center justify-content-center">
                <i className="fas fa-2x fa-upload"/>
                {/* Add input here for file upload */}
                <p><button type="button" className="atmButtonText" title="Choose a file" onClick={onObjectUpload}>Choose a file</button> or drag it here</p>
                {/* drag and drop upload componet (look for onEvent, onUpload... and console.log 'event' and can find a path) */}
                {/* https://stackoverflow.com/questions/58880171/get-file-path-from-drop-event/64616487#64616487 */}
            </div>
        </div>
    )
}

export default ObjectView;


