import React, { useState } from 'react';

// Components
import CardContainer from '../../../atoms/CardContainer';
import RowContainer from '../../../atoms/RowContainer';

import { useModal } from "../../../organisms/Modal/ModalContext";
import CompModalStandard from "../../../organisms/Modal/ModalStandard";

// Original: import OverlayMenu from '../../../molecules/OverlayMenu'; TO DELETE
// New: import OverlayMenuBS from '../../../molecules/OverlayMenuBS'; TO DELETE

export function ContainerGrid(props) {
    console.log("container grid item", props.item)
    const { setModal, unSetModal } = useModal()

    return (
        <>
            {/* 1. Wrap this whole thing in an organism */}
            {/* 2. Ellipsis, this is a molecule */}
            <div className="atmButtonGridHeader d-flex">{/* Overlaymenu option */}

                {/* Checkbox component */}
                <div>
                    Check
                </div>
                <div class="ms-auto">
                    {/*Dropdown component including an Ellipsis button component (position in component infrastrucutre TBC)
                    <button class="btn dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        <i className="fa-sharp fa-solid fa-ellipsis"/>
                    </button>
                    {/* Dropdown button component */}
                    <ul class="dropdown-menu">
                        { props.type === "object" ?  
                            <li>
                                <button className="atmButtonBase nav-link" onClick={() => props.onObjectSelection(props.id, props.filename)}><i className="fas fa-download"/>&nbsp;Download</button>
                            </li>
                        : null }

                        <li>
                            <button 
                                type="button" 
                                className="atmButtonBase dropdown-item"
                                onClick={() => {
                                    setModal(
                                    <CompModalStandard 
                                        title={"Confirmation"} 
                                        buttonTextPrimary={"Yes"} 
                                        buttonTextSecondary={"No"} 
                                        secondaryClicked={async () => unSetModal()} 
                                        primaryClicked={() => {props.onDelete(); unSetModal()}}>
                                            <p>Are you sure you want to delete this item?</p>
                                    </CompModalStandard>)
                                }}>
                                <i className="fas fa-trash-alt"/>&nbsp;Delete
                            </button>
                        </li>
                    </ul>
                </div>
                {/* <button 
                        type="button" 
                        className="atmButtonOptions ms-auto" 
                        onClick={() => setShowMenu(!showMenu)}>
                            // { !showMenu ? <i className="far fa-ellipsis-h"/> : <i className="far fa-times" style={{"color":"red"}}/> } 
                            <i className="far fa-ellipsis-h"/>
                            <OverlayMenu 
                                type={props.item.type} 
                                onDelete={props.onDelete} 
                                setShowMenu={setShowMenu} 
                                show={showMenu}>
                            </OverlayMenu>
                    </button> */}
            </div>
            {/* 3. This is an molecule, although on paper it's simple and could be an atom, but as row === molecule */}
            <CardContainer
                //containerID, containerName, permissions, sharable, createdAt, size
                onClick={() => {props.onContainerSelection(props.item.id,
                    props.item.attributes.Name,
                    props.item.BasicAcl,
                    true,
                    props.item.attributes.Timestamp,
                    props.item.size)}}
                containerName={props.item.attributes.Name}
                pendingDeleted={props.item.PendingDeleted}>
            </CardContainer>
        </>
    )
}
export function ContainerRow(props) {
    console.log("container row item", props.item)
    const { setModal, unSetModal } = useModal()
    
    return (
        <div className="d-flex flex-row align-items-center">
            {/* 1. Wrap this whole thing in an organism */}

            {/* 2. This is an molecule, although on paper it's simple and could be an atom, but as row === molecule */}

            {/* Checkbox component */}
            <RowContainer
                onClick={() => {props.onContainerSelection(props.item.id,
                    props.item.attributes.Name,
                    props.item.BasicAcl,
                    true,
                    props.item.attributes.Timestamp,
                    props.item.size)}}
                containerName={props.item.attributes.Name}
                containerSize={props.item.size}
                containerOrigin={props.item.attributes.Timestamp}>
            </RowContainer>
            
            {/* 3. Ellipsis, this is an molecule */}
            <div className="ms-auto">
                {/* Dropdown component including an Ellipsis button component (position in component infrastrucutre TBC) */}
                <button class="btn dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <i className="fa-sharp fa-solid fa-ellipsis"/>
                </button>
                {/* Dropdown button component */}
                <ul class="dropdown-menu">
                    { props.type === "object" ?  
                        <li>
                            <button className="atmButtonBase nav-link" onClick={() => props.onObjectSelection(props.id, props.filename)}><i className="fas fa-download"/>&nbsp;Download</button>
                        </li>
                    : null }
                    <li>
                        <button 
                            type="button" 
                            className="atmButtonBase dropdown-item" 
                            onClick={() => {
                                setModal(
                                <CompModalStandard 
                                    title={"Confirmation"} 
                                    buttonTextPrimary={"Yes"} 
                                    buttonTextSecondary={"No"} 
                                    secondaryClicked={async () => unSetModal()} 
                                    primaryClicked={() => {props.onDelete(); unSetModal()}}>
                                        <p>Are you sure you want to delete this item?</p>
                                </CompModalStandard>)
                            }}>
                            <i className="fas fa-trash-alt"/>&nbsp;Delete
                        </button>
                    </li>
                </ul>
                {/* <button 
                    type="button"   
                    className="atmButtonOptions" 
                    onClick={() => setShowMenu(!showMenu)}>
                        <i className="far fa-ellipsis-h"/>
                        <OverlayMenu type={props.item.type} onDelete={props.onDelete} setShowMenu={setShowMenu} show={showMenu}></OverlayMenu>
                </button> */}
            </div>
        </div>
    )
}
