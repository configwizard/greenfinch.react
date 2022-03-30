import React  from "react";
import Moment from "react-moment";
import ByteConverter from "byte-converter-react";

import {ObjectGrid, ObjectRow} from "./object"
import {ContainerGrid} from "../viewContainers/container";

// import JSONView from 'react-json-view';

function ObjectView({onDelete, objectList, onObjectSelection, objectsLoaded, viewMode}) {
    console.log("objectList", objectList)

    if (viewMode === "grid") {
        return (
            <>
                {objectsLoaded && objectList.length > 0 ? objectList.map((item, i) =>
                    <div className="col-6 col-lg-3 col-xl-2" key={i}>
                        <div className="molButtonGrid">
                            <ObjectGrid onDelete={() => {onDelete(item.id)}} onObjectSelection={onObjectSelection} item={item}></ObjectGrid>
                        </div>
                    </div>
                ) : objectsLoaded ? <div className="atmStatusSmall"><i className="fas fa-exclamation-triangle"/>&nbsp;There are no objects in this container.</div> : <div className="utLoading"><i className="fad fa-spinner fa-spin"/>Loading...</div>}
            </>
        )
    } else {
        return (
            <>
            {objectsLoaded && objectList.length > 0 ? objectList.map((item,i) =>
                <div className="row">
                        <div className="col-12" key={i}>
                            <div className="molButtonRow">
                                <ObjectRow onDelete={() => {onDelete(item.id)}} onObjectSelection={onObjectSelection} item={item}></ObjectRow>
                            </div>
                        </div>
                </div>
            ) : objectsLoaded ? <div className="atmStatusSmall"><i className="fas fa-exclamation-triangle"/>&nbsp;There are no objects in this container.</div> : <div className="utLoading"><i className="fad fa-spinner fa-spin"/>Loading...</div>}
            </>
        )
    }
}
export function FileUpload({onObjectUpload}) {
    return (
        <div className="molBlockUpload d-flex align-items-center justify-content-center">
            <div className="atmBlockUpload d-flex flex-column align-items-center justify-content-center">
                {/* <i className="fas fa-upload"/> */}
                <button 
                    type="button" 
                    className="atmButtonText" 
                    title="Upload a file" 
                    onClick={onObjectUpload}>
                        Upload a file
                </button>
            </div>
        </div>
    )
} 

export default ObjectView;


