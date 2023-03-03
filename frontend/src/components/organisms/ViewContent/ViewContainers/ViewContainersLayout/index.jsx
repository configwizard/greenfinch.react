import React, { useState } from 'react';
import PropTypes from 'prop-types';

// Components
import ContentCheckbox from '../../../../atoms/ContentCheckbox';
import CardContentContainerGrid from '../../../../molecules/CardLayout/CardContentContainerGrid';
import CardContentContainerRow from '../../../../molecules/CardLayout/CardContentContainerRow';
import OverlayMenu from '../../../../molecules/OverlayMenu';

// Original: import OverlayMenu from '../../../molecules/OverlayMenu'; TO DELETE

// Central style sheet for ViewContainers
import '../../_settings/style.scss';

export function ViewContainersGrid(props) {
    console.log("container grid item", props.item)
    const [showMenu, setShowMenu] = useState(false)
    return (
        <section className="orgViewContainersGrid">
            <div className="molViewContainersHeader d-flex">
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
        <section className="orgViewContainersRow">
            <div className="d-flex flex-row align-items-center">

                {/* To add props conditional here? */}
                <ContentCheckbox></ContentCheckbox>
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

                {/* To add props conditional here? */}
                <ContentCheckbox></ContentCheckbox>
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

/*
ViewContainersRow.propTypes = {
    hasCheckbox: PropTypes.bool,
    hasDropdown: PropTypes.bool,
};
ViewContainersRow.defaultProps = {
    hasCheckbox: false,
    hasDropdown: true,
};
*/