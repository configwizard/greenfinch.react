import React, { useState } from 'react';

// Components
import CardObject from '../../../atoms/CardObject';
import RowObject from '../../../atoms/RowObject';
import OverlayMenu from '../../../molecules/OverlayMenu';

export function ObjectGrid({showOverlayMenu, onDelete, onObjectSelection, item}) {
    const [showMenu, setShowMenu] = useState(false)
    console.log("item", item)
    return (
        <>
            {showOverlayMenu ?
            <div className="atmButtonGridHeader d-flex">{/* Overlaymenu option */}
                <button 
                    type="button" 
                    className="atmButtonOptions ms-auto" 
                    onClick={() => setShowMenu(!showMenu)}>
                        <i className="far fa-ellipsis-h"/>
                        {/* { !showMenu ? <i className="far fa-ellipsis-h"/> : <i className="far fa-times" style={{"color":"red"}}/> } */}
                        <OverlayMenu 
                            onDelete={onDelete} 
                            onObjectSelection={onObjectSelection} 
                            id={item.id}
                            filename={item.attributes.FileName} 
                            type={item.type} 
                            setShowMenu={setShowMenu} 
                            show={showMenu}>
                        </OverlayMenu>
                </button>
            </div> : null }
            <CardObject
                onClick={() => onObjectSelection(item.id, item.attributes.FileName, item.attributes.Thumbnail, item.size, item.attributes.Timestamp)}
                objectFile={item.attributes.Thumbnail}
                dataType={item.attributes.X_EXT}
                objectName={item.attributes.FileName}>
            </CardObject>
        </>
    )
}
export function ObjectRow({showOverlayMenu, onDelete, onObjectSelection, item}) {
    const [showMenu, setShowMenu] = useState(false)
    return (
        <div className="d-flex flex-row">
            <div className="atmRowCheck"><input type="checkbox"/></div>
            <div className="atmRowList flex-grow-1">
                <RowObject
                    onClick={() => onObjectSelection(item.id, item.attributes.FileName, item.attributes.Thumbnail, item.size, item.attributes.Timestamp)}
                    objectFile={item.attributes.Thumbnail}
                    objectName={item.attributes.FileName}
                    objectSize={item.size}
                    objectOrigin={item.attributes.Timestamp}>
                </RowObject>
                {/* https://codepen.io/aaw3k/pen/zYBxEWX */}
            </div>
            {showOverlayMenu ?
                <div className="atmRowMenu d-flex flex-column">
                    <div className="align-self-end">
                        <button 
                            type="button"   
                            className="atmButtonOptions" 
                            onClick={() => setShowMenu(!showMenu)}>
                                <i className="far fa-ellipsis-h"/>
                                {/* { !showMenu ? <i className="far fa-ellipsis-h"/> : <i className="far fa-times" style={{"color":"red"}}/> } */}
                                <OverlayMenu onDelete={onDelete} type={item.type} setShowMenu={setShowMenu} show={showMenu}></OverlayMenu>
                        </button>
                    </div>
                </div> : null 
            }
        </div>
    )
}