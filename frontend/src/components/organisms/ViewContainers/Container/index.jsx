import React, { useState } from 'react';
import Moment from 'react-moment';
import { fileSize } from 'humanize-plus';

// Components
import OverlayMenu from '../../../molecules/OverlayMenu';

export function ContainerGrid(props) {
    const [showMenu, setShowMenu] = useState(false)
    return (
        <>
            <div className="atmButtonGridHeader d-flex">
                <button 
                    type="button" 
                    className="atmButtonOptions ms-auto" 
                    onClick={() => setShowMenu(!showMenu)}>
                        { !showMenu ? <i className="far fa-ellipsis-h"/> : <i className="far fa-times" style={{"color":"red"}}/> }
                        <OverlayMenu type={props.item.type} onDelete={props.onDelete} setShowMenu={setShowMenu} show={showMenu}></OverlayMenu>
                </button>
            </div>
            <button 
                type="button"
                className="atmButtonGridContent d-flex flex-column align-items-center justify-content-between"
                onClick={() => props.onContainerSelection(props.item.id, props.item.attributes.FileName)}>
                    <div className="neo folder-icon"></div>
                    <span className="atmButtonGridName">{props.item.attributes.FileName}</span>
            </button>
        </>
    )
}
export function ContainerRow(props) {
    const [showMenu, setShowMenu] = useState(false)
    return (
        <div className="d-flex flex-row align-items-center">
            <div className="atmRowList">
                <button 
                    type="button" 
                    className="atmButtonRowContent" 
                    onClick={() => props.onContainerSelection(props.item.id, props.item.attributes.FileName)}>
                        <i className="fas fa-folder"/>
                        <span className="atmButtonRowName">{props.item.attributes.FileName}</span>
                </button>
            </div>
            <div className="atmRowList">{fileSize(props.item.size)}</div>
            <div className="atmRowList"><Moment unix format="DD MMM YY">{props.item.attributes.Timestamp}</Moment></div>
            <div className="ms-auto">
                <button 
                    type="button"   
                    className="atmButtonOptions" 
                    onClick={() => setShowMenu(!showMenu)}>
                        { !showMenu ? <i className="far fa-ellipsis-h"/> : <i className="far fa-times" style={{"color":"red"}}/> }
                        <OverlayMenu type={props.item.type} nDelete={props.onDelete} setShowMenu={setShowMenu} show={showMenu}></OverlayMenu>
                </button>
            </div>
        </div>
    )
}
