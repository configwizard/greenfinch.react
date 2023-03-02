import React, { useState } from 'react';

// Components
import CardContentObjectGrid from '../../../../molecules/CardLayout/CardContentObjectGrid';
import CardContentObjectRow from '../../../../molecules/CardLayout/CardContentObjectRow';
import OverlayMenu from '../../../../molecules/OverlayMenu';

// Central style sheet for ViewObjects
import '../../_settings/style.scss';

export function ViewObjectsGrid({showOverlayMenu, onDelete, onObjectSelection, item}) {
    const [showMenu, setShowMenu] = useState(false)
    console.log("item", item)
    return (
        <section className="orgViewObjectsGrid molButtonGrid">{/* old class === MolButtonGrid */}
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
                </div> 
            : null }
            <CardContentObjectGrid
                onClick={() => onObjectSelection(item.id, item.attributes.FileName, item.attributes.Thumbnail, item.size, item.attributes.Timestamp)}
                objectFile={item.attributes.Thumbnail}
                dataType={item.attributes.X_EXT}
                objectName={item.attributes.FileName}>
                pendingDeleted={item.PendingDeleted}
            </CardContentObjectGrid>
        </section>
    )
}
export function ViewObjectsRow({showOverlayMenu, onDelete, onObjectSelection, item}) {
    const [showMenu, setShowMenu] = useState(false)
    return (
        <section className="orgViewObjectsRow molButtonRow">{/* old class === MolButtonRow */}
            <div className="d-flex flex-row">
                <div className="atmRowCheck"><input type="checkbox"/></div>
                <div className="atmRowList flex-grow-1">
                    <CardContentObjectRow
                        onClick={() => onObjectSelection(item.id, item.attributes.FileName, item.attributes.Thumbnail, item.size, item.attributes.Timestamp)}
                        objectFile={item.attributes.Thumbnail}
                        objectName={item.attributes.FileName}
                        objectSize={item.size}
                        uploadedAt={item.attributes.Timestamp}>
                    </CardContentObjectRow>
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
        </section>
    )
}