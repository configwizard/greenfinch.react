import React, { useState } from 'react';
import Moment from 'react-moment';
import { fileSize } from 'humanize-plus';

// Components
import OverlayMenu from '../../../molecules/OverlayMenu';

export function ObjectGrid({onDelete, onObjectSelection, item}) {
    const [showMenu, setShowMenu] = useState(false)
    return (
        <>
            <div className="atmButtonGridHeader d-flex">
                <button 
                    type="button" 
                    className="atmButtonOptions ms-auto" 
                    onClick={() => setShowMenu(!showMenu)}>
                        { !showMenu ? <i className="far fa-ellipsis-h"/> : <i className="far fa-times" style={{"color":"red"}}/> }
                        <OverlayMenu onDelete={onDelete} onObjectSelection={onObjectSelection} id={item.id} filename={item.attributes.FileName} type={item.type} setShowMenu={setShowMenu} show={showMenu}></OverlayMenu>
                </button>
            </div>
            <button 
                type="button"
                className="atmButtonGridContent d-flex flex-column align-items-center justify-content-between"
                onClick={() => onObjectSelection(item.id, item.attributes.FileName)}>
                   <div className="file-icon file-icon-lg" data-type={item.attributes.X_EXT}></div>
                    <span className="atmButtonGridName">{item.attributes.FileName}</span>
            </button>
        </>
    )
}
export function ObjectRow({onDelete, onObjectSelection, item}) { 
    const [showMenu, setShowMenu] = useState(false)
    return (
        <div className="d-flex flex-row align-items-center">
            <div className="atmRowList">
                <button 
                    type="button" 
                    className="atmButtonRowContent" 
                    onClick={() => onObjectSelection(item.id, item.attributes.FileName)}>
                        <i className="fas fa-folder"/>
                        <span className="atmButtonRowName">{item.attributes.FileName}</span>
                </button>
            </div>
            <div className="atmRowList">{fileSize(item.size)}</div>
            <div className="atmRowList"><Moment unix format="DD MMM YY">{item.attributes.Timestamp}</Moment></div>
            <div className="ms-auto">
                <button 
                    type="button"   
                    className="atmButtonOptions" 
                    onClick={() => setShowMenu(!showMenu)}>
                        { !showMenu ? <i className="far fa-ellipsis-h"/> : <i className="far fa-times" style={{"color":"red"}}/> }
                        <OverlayMenu onDelete={onDelete} type={item.type} setShowMenu={setShowMenu} show={showMenu}></OverlayMenu>
                </button>
            </div>
        </div>
    )
}