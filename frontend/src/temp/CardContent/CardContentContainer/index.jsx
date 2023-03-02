import React from 'react';


import CardContentBody from '../../../molecules/CardContentLayout/CardContentBody';
import CardContentHeader from '../../../molecules/CardContentLayout/CardContentHeader';
// import ContentCheckbox from '../../../atoms/ContentCheckbox';
// import ContentDropdown from '../../../molecules/ContentDropdown';

// Central style sheet for Card Content (organism)
import '../_settings/style.scss';

// 1. (View Containers --> Containers), Original name is function ContainerGrid
// 2. (View Containers --> Containers), Original name is function ContainerRow

export function CardContentContainerGrid(props) {
    console.log("container grid item", props.item)
    return (
        <>
            <CardContentHeader>
                {/*
                { hasCheckbox ?
                    <ContentCheckbox/>
                : null 
                }
                { hasDropdown ? 
                    <ContentDropdown
                        />
                : null
                } */}
            </CardContentHeader>
            <CardContentBody 
                onClick={() => {props.onContainerSelection(props.item.id,
                    props.item.attributes.Name,
                    props.item.BasicAcl,
                    true,
                    props.item.attributes.Timestamp,
                    props.item.size)}}
                contentName={props.item.attributes.Name}
                pendingDeleted={props.item.PendingDeleted}/>
        </>
    )
}
export function CardContentContainerRow(props) {
    console.log("container row item", props.item)
    return (
        <>
             <section className="orgCardContentRow d-flex flex-row">
                {/*
                { 
                    hasCheckbox ?
                        <ContentCheckbox />
                    : null
                }      */}     
                <div className="flex-grow-1">
                    <CardContentBody 
                        onClick={() => {props.onContainerSelection(props.item.id,
                            props.item.attributes.Name,
                            props.item.BasicAcl,
                            true,
                            props.item.attributes.Timestamp,
                            props.item.size)}}
                        contentName={props.item.attributes.Name}
                        containerSize={props.item.size}
                        containerOrigin={props.item.attributes.Timestamp} />
                </div>
                {/*
                {
                    hasDropdown ?
                        <ContentDropdown />
                    : null
                } */}
            </section>
        </>
    )
}