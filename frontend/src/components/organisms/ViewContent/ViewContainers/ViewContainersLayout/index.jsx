import React, { useState } from 'react';

// Components
import CardContentContainerGrid from '../../../../molecules/CardLayout/CardContentContainerGrid';
import CardContentContainerRow from '../../../../molecules/CardLayout/CardContentContainerRow';
import OverlayMenu from '../../../../molecules/OverlayMenu';

// Original: import OverlayMenu from '../../../molecules/OverlayMenu'; TO DELETE
// New: import OverlayMenuBS from '../../../molecules/OverlayMenuBS'; TO DELETE

// Central style sheet for ViewContainers
import '../../_settings/style.scss';

export function ViewContainersGrid(props) {
    console.log("container grid item", props.item)
    const [showMenu, setShowMenu] = useState(false)
    return (
        <section className="orgViewContainersGrid molButtonGrid">{/* old class === MolButtonGrid */}
            <div className="atmButtonGridHeader d-flex">{/* Overlaymenu option */}
                <button 
                    type="button" 
                    className="atmButtonOptions ms-auto" 
                    onClick={() => setShowMenu(!showMenu)}>
                        {/* { !showMenu ? <i className="far fa-ellipsis-h"/> : <i className="far fa-times" style={{"color":"red"}}/> } */}
                        <i className="far fa-ellipsis-h"/>
                        <OverlayMenu 
                            type={props.item.type} 
                            onDelete={props.onDelete} 
                            setShowMenu={setShowMenu} 
                            show={showMenu}>
                        </OverlayMenu>
                </button>
            </div>
            <CardContentContainerGrid
                onClick={() => {props.onContainerSelection(props.item.id,
                    props.item.attributes.Name,
                    props.item.BasicAcl,
                    true,
                    props.item.attributes.Timestamp,
                    props.item.size)}}
                containerName={props.item.attributes.Name}
                pendingDeleted={props.item.PendingDeleted}>
            </CardContentContainerGrid>
        </section>
    )
}
export function ViewContainersRow(props) {
    const [showMenu, setShowMenu] = useState(false)
    console.log("container row item", props.item)
    return (
        <section className="orgViewContainersRow molButtonRow">{/* old class === MolButtonRow */}
            <div className="d-flex flex-row align-items-center">
                {/* 2. This is an molecule, although on paper it's simple and could be an atom, but as row === molecule */}
                <CardContentContainerRow
                    onClick={() => {props.onContainerSelection(props.item.id,
                        props.item.attributes.Name,
                        props.item.BasicAcl,
                        true,
                        props.item.attributes.Timestamp,
                        props.item.size)}}
                    containerName={props.item.attributes.Name}
                    containerSize={props.item.size}
                    containerOrigin={props.item.attributes.Timestamp}
                    pendingDeleted={props.item.PendingDeleted}>
                </CardContentContainerRow>
                <div className="ms-auto">
                    <button 
                        type="button"   
                        className="atmButtonOptions" 
                        onClick={() => setShowMenu(!showMenu)}>
                            <i className="far fa-ellipsis-h"/>
                            {/* { !showMenu ? <i className="far fa-ellipsis-h"/> : <i className="far fa-times" style={{"color":"red"}}/> } */}
                            <OverlayMenu type={props.item.type} onDelete={props.onDelete} setShowMenu={setShowMenu} show={showMenu}></OverlayMenu>
                    </button>
                </div>
            </div>
        </section>
    )
}
