import React from 'react';

import CardContentBody from '../../../molecules/CardContentLayout/CardContentBody';
import CardContentHeader from '../../../molecules/CardContentLayout/CardContentHeader';
import ContentDropdown from '../../../molecules/ContentDropdown';

// Central style sheet for Card Content (organism)
import '../_settings/style.scss';
import ContentCheckbox from '../../../atoms/ContentCheckbox';

// if category === object (View Objects --> Objects)
// ObjectGrid, we need Object Row too 

export function ObjectGrid({onDelete, onObjectSelection, item, hasCheckbox, hasDropdown}) {
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
                pendingDeleted={item.PendingDeleted}>
            </CardContentBody>
        </>
    )
}