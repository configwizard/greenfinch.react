import React from 'react';

import CardContentBody from '../../../molecules/CardContentLayout/CardContentBody';
import CardContentHeader from '../../../molecules/CardContentLayout/CardContentHeader';
import ContentDropdown from '../../../molecules/ContentDropdown';

// Central style sheet for Card Content (organism)
import '../_settings/style.scss';
import ContentCheckbox from '../../../atoms/ContentCheckbox';

// 1. (View Objects --> Objects), Original name is function ObjectGrid
// 2. (View Objects --> Objects), Original name is function ObjectRow

export function CardContentObjectGrid({onDelete, onObjectSelection, item, hasCheckbox, hasDropdown}) {
    console.log("item", item)
    return (
        <>
            <CardContentHeader>
                { hasCheckbox ?
                    <ContentCheckbox/>
                : null 
                }
                { hasDropdown ? 
                    <ContentDropdown
                        onDelete={onDelete} 
                        onObjectSelection={onObjectSelection} 
                        id={item.id}
                        filename={item.attributes.FileName} 
                        type={item.type} />
                : null
                }
            </ CardContentHeader>
            <CardContentBody 
                onClick={() => onObjectSelection(item.id, item.attributes.FileName, item.attributes.Thumbnail, item.size, item.attributes.Timestamp)}
                objectFile={item.attributes.Thumbnail}
                dataType={item.attributes.X_EXT}
                objectName={item.attributes.FileName}
                pendingDeleted={item.PendingDeleted}/>
        </>
    )
}
export function CardContentObjectRow({onDelete, onObjectSelection, item, hasCheckbox, hasDropdown}) {
    return (
        <>
        <section className="orgCardContentRow d-flex flex-row">
            { 
                hasCheckbox ?
                    <ContentCheckbox />
                : null
            }           
            <div className="flex-grow-1">
                <CardContentBody 
                     onClick={() => onObjectSelection(item.id, item.attributes.FileName, item.attributes.Thumbnail, item.size, item.attributes.Timestamp)}
                     objectFile={item.attributes.Thumbnail}
                     objectName={item.attributes.FileName}
                     objectSize={item.size}
                     uploadedAt={item.attributes.Timestamp} />
            </div>
            {
                hasDropdown ?
                    <ContentDropdown 
                        onDelete={onDelete} 
                        onObjectSelection={onObjectSelection} 
                        id={item.id}
                        filename={item.attributes.FileName} 
                        type={item.type} />
                : null
            }
        </section>
        </>
    )
}
