import React from 'react';
import ButtonText from '../../atoms/ButtonText';

import { ObjectGrid, ObjectRow } from './Object';

import './style.scss';

function ViewObjects({shared, onDelete, objectList, onObjectSelection, objectsLoaded, viewMode}) {
    console.log("objectList", objectList)

    if (viewMode === "grid") {
        return (
            <div className="row">
                {objectsLoaded && objectList.length > 0 ? objectList.map((item, i) =>
                    <div className="col-6 col-lg-3" key={i}>
                        <div className="molButtonGrid">
                            <ObjectGrid showOverlayMenu={!shared} onDelete={() => {onDelete(item.id)}} onObjectSelection={onObjectSelection} item={item}></ObjectGrid>
                        </div>
                    </div>
                ) : objectsLoaded ? <div className="atmStatusSmall"><i className="fas fa-exclamation-triangle"/>&nbsp;There are no objects in this container.</div> : <div className="utLoading"><i className="fad fa-spinner fa-spin"/>Loading...</div>}
            </div>
        )
    } else {
        return (
            <div className="row">
                {objectsLoaded && objectList.length > 0 ? objectList.map((item,i) =>
                    <div className="col-12" key={i}>
                        <div className="molButtonRow">
                            <ObjectRow showOverlayMenu={!shared} onDelete={() => {onDelete(item.id)}} onObjectSelection={onObjectSelection} item={item}></ObjectRow>
                        </div>
                    </div>
                ) : objectsLoaded ? <div className="atmStatusSmall"><i className="fas fa-exclamation-triangle"/>&nbsp;There are no objects in this container.</div> : <div className="utLoading"><i className="fad fa-spinner fa-spin"/>Loading...</div>}
            </div>
        )
    }
}
export function ContainerPreviewButton({icon, text, onClick}) {
    return (
        <ButtonText
            type={"default"}
            size={"small"}
            hasIcon={true}
            faClass={icon}
            onClick={onClick}
            text={text}/>
    )
} 

export default ViewObjects;
