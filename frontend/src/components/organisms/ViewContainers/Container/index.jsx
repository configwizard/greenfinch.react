import React, { useState } from 'react';

// Components
import CardContainer from '../../../atoms/CardContainer';
import RowContainer from '../../../atoms/RowContainer';
import OverlayMenu from '../../../molecules/OverlayMenu';

export function ContainerGrid(props) {
    const [showMenu, setShowMenu] = useState(false)
    return (
        <>
            {/* whole thing is an organism */}
            {/* This is a molecule */}
            <div className="atmButtonGridHeader d-flex">{/* Overlaymenu option */}
                <button 
                    type="button" 
                    className="atmButtonOptions ms-auto" 
                    onClick={() => setShowMenu(!showMenu)}>
                        { !showMenu ? <i className="far fa-ellipsis-h"/> : <i className="far fa-times" style={{"color":"red"}}/> }
                        <OverlayMenu 
                            type={props.item.type} 
                            onDelete={props.onDelete} 
                            setShowMenu={setShowMenu} 
                            show={showMenu}>
                        </OverlayMenu>
                </button>
            </div>
            {/* This is an atom */}
            <CardContainer
                onClick={() => props.onContainerSelection(props.item.id, props.item.attributes.FileName)}
                containerName={props.item.attributes.FileName}>
            </CardContainer>
        </>
    )
}
export function ContainerRow(props) {
    const [showMenu, setShowMenu] = useState(false)
    return (
        <div className="d-flex flex-row align-items-center">
            <RowContainer
                onClick={() => props.onContainerSelection(props.item.id, props.item.attributes.FileName)}
                containerName={props.item.attributes.FileName}
                containerSize={props.item.size}
                containerOrigin={props.item.attributes.Timestamp}>
            </RowContainer>
            <div className="ms-auto">
                <button 
                    type="button"   
                    className="atmButtonOptions" 
                    onClick={() => setShowMenu(!showMenu)}>
                        { !showMenu ? <i className="far fa-ellipsis-h"/> : <i className="far fa-times" style={{"color":"red"}}/> }
                        <OverlayMenu type={props.item.type} onDelete={props.onDelete} setShowMenu={setShowMenu} show={showMenu}></OverlayMenu>
                </button>
            </div>
        </div>
    )
}
