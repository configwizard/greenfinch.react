import React  from "react";
import Moment from "react-moment";
import ByteConverter from "byte-converter-react";

import {ObjectGrid, ObjectRow} from "./object"

// import JSONView from 'react-json-view';

function ObjectView({onDelete, onObjectSelection, viewMode, objectList}) {
    /* what actually props looks like
        props = {
            onObjectSelection = fnuction....
            onDelete = function...
        }
    
        oldschool extract children:
        const onDelete = props.onDelete
        const onObjectSelection = props.onObjectSelection
        
        new school:
        const {onDelete, onObjectSelection} = props
   */
    console.log("objectList", objectList)

    if (viewMode === "grid") {
        return (
            <div id="objectGridView" className="row">
                {objectList.map((item, i) =>
                    <div className="col-6 col-lg-3 col-xl-2" key={i}>
                        <div className="molButtonGrid">
                            <ObjectGrid onDelete={() => {onDelete(item.id)}} onObjectSelection={onObjectSelection} item={item}></ObjectGrid>
                        </div>
                    </div>
                )}
            </div>
        )
        /* return (
            <>
                {objectsLoaded && objectList.length > 0 ? objectList.map((item,i) =>
                    <div className="col-6 col-lg-3 col-xl-2" key={i}>
                        <div className="molButtonGrid">
                            <button 
                                type="button"
                                className="atmButtonGridContent d-flex flex-column align-items-center justify-content-between"
                                onClick={()=> {onObjectSelection(item.id, item.attributes.FileName)}}>
                                    <div class="file-icon file-icon-lg" data-type={item.attributes.X_EXT}></div>
                                    <span className="atmButtonGridName">{item.attributes.FileName}</span>
                            </button>
                        </div>
                    </div>
                   /* Add a loading component here, otherwise 'no objects' show
                ) : objectsLoaded ? <div className="atmStatusSmall"><i className="fas fa-exclamation-triangle"/>&nbsp;There are no objects in this container.</div> : <div className="utLoading"><i className="fad fa-spinner fa-spin"/>Loading...</div>}
            </>           
        ) */
    } else {
        return (
            <div className="row">
                {objectList.map((item, i) =>
                    <div className="col-12" key={i}> 
                        <div className="molButtonRow">
                            <ObjectRow onDelete={() => {onDelete(item.id)}} onObjectSelection={onObjectSelection} item={item}></ObjectRow>
                        </div>
                    </div>
                )}
            </div>
           /*  <>
                {objectList.length > 0 ? objectList.map((item,i) =>
                    <div className="col-12" key={i}>
                        <div className="molButtonRow">
                            <div className="d-flex flex-row align-items-center">
                                <div className="atmRowList">
                                    <button
                                        type="button"
                                        className="atmButtonRowContent" 
                                        onClick={()=> onObjectSelection(item.id, item.attributes.FileName)}>
                                            <i className="fas fa-file"/>
                                            <span className="atmButtonRowName">{item.attributes.FileName}</span> 
                                    </button>
                                </div>
                                <div className="atmRowList"><ByteConverter suffix inUnit="B" outUnit="KB">{item.size}</ByteConverter></div>
                                <div className="atmRowList"><Moment unix format="DD MMM YY">{item.attributes.Timestamp}</Moment></div>
                                <div className="ms-auto">
                                    &nbsp; {/* placeholder for layout purposes
                                </div>
                            </div>
                        </div>
                    </div>
                ) : <div className="atmStatusSmall"><i className="fas fa-exclamation-triangle"/>&nbsp;There are no objects in this container.</div>}
            </> */
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


