import React from 'react';

// Components
import ButtonText from '../../../atoms/ButtonText';
import SpinnerLoading from '../../../atoms/SpinnerLoading';
import { ViewObjectsGrid, ViewObjectsRow } from './ViewObjectsLayout';

// Central style sheet for ViewObjects
import '../_settings/style.scss';

function ViewObjects({shared, onDelete, onDownload, objectList, onObjectSelection, objectsLoaded, viewMode }) {
    console.log("objectList", objectList)
    if (viewMode === "grid") {
        return (
            <div className="row g-2 mt-0">
                {objectsLoaded && objectList.length > 0 ? objectList.map((item, i) =>
                    <div className="col-6 col-md-4 col-xl-3" key={i}>
                        <ViewObjectsGrid 
                            onDelete={onDelete !== undefined ? () => {onDelete(item.id)} : null} //set to null if nothing to call
                            onDownload={() => {onDownload(item.attributes.FileName, item.id)}}
                            onObjectSelection={onObjectSelection}
                            item={item}
                            hasCheckbox={false} 
                            hasDropdown={!shared}/>
                    </div>
                ) : objectsLoaded ? 
                    <div className="atmStatusSmall"><i className="fa-sharp fa-solid fa-triangle-exclamation"/>&nbsp;There are no objects in this container.</div> 
                    : 
                    <SpinnerLoading hasText={true} text={"Loading..."} size={"small"}/>
                }
            </div>
        )
    } else {
        return (
            <div className="row g-2 mt-0">
                {objectsLoaded && objectList.length > 0 ? objectList.map((item,i) =>
                    <div className="col-12 mt-0" key={i}>
                        <ViewObjectsRow 
                            onDelete={() => {onDelete(item.id)}} 
                            onObjectSelection={onObjectSelection} 
                            item={item} 
                            hasCheckbox={false} 
                            hasDropdown={!shared}/>
                    </div>
                ) : objectsLoaded ? 
                    <div className="atmStatusSmall"><i className="fa-sharp fa-solid fa-triangle-exclamation"/>&nbsp;There are no objects in this container.</div> 
                    : 
                    <SpinnerLoading hasText={true} text={"Loading..."} size={"small"}/>
                }
            </div>
        )
    }
}
export function ButtonContentAction({icon, text, onClick}) {
    return (
        <ButtonText
            type={"default"}
            size={"small"}
            hasIcon={true}
            faClass={icon}
            isDisabled={false}
            onClick={onClick}
            text={text}/>
    )
} 

export default ViewObjects;