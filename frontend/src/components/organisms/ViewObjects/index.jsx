import React from 'react';
import ButtonText from '../../atoms/ButtonText';

import { ObjectGrid, ObjectRow } from './Object';

import './style.scss';

function ViewObjects({onDelete, objectList, onObjectSelection, objectsLoaded, viewMode}) {
    console.log("objectList", objectList)

    if (viewMode === "grid") {
        return (
            <>
                {objectsLoaded && objectList.length > 0 ? objectList.map((item, i) =>
                    <div className="col-6 col-lg-3" key={i}>
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
