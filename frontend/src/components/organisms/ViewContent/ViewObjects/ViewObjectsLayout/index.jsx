import React, { useState } from 'react';
import PropTypes from 'prop-types';

// Components
import ContentCheckbox from '../../../../atoms/ContentCheckbox';
import CardContentObjectGrid from '../../../../molecules/CardLayout/CardContentObjectGrid';
import CardContentObjectRow from '../../../../molecules/CardLayout/CardContentObjectRow';
import ContentDropdown from '../../../../molecules/ContentDropdown';
import OverlayMenu from '../../../../molecules/OverlayMenu';

// Central style sheet for ViewObjects
import '../../_settings/style.scss';

export function ViewObjectsGrid({hasOverlayMenu, onDelete, onObjectSelection, item, hasCheckbox, hasDropdown}) {
    const [showMenu, setShowMenu] = useState(false)
    console.log("item", item)
    return (
        <section className="orgViewObjectsGrid">
            <div className="molViewObjectsHeader d-flex flex-row justify-content-end">
                { hasCheckbox ?
                    <div className="me-auto">
                        <ContentCheckbox></ContentCheckbox>
                    </div>
                    : null
                }
                { hasDropdown ?
                    <ContentDropdown></ContentDropdown>
                    : null
                }
                { hasOverlayMenu ? // To delete
                    <button 
                        type="button" 
                        className="atmButtonOptions" 
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
                : null }
            </div>
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
export function ViewObjectsRow({hasOverlayMenu, onDelete, onObjectSelection, item, hasCheckbox, hasDropdown}) {
    const [showMenu, setShowMenu] = useState(false)
    return (
        <section className="orgViewObjectsRow">
            <div className="d-flex flex-row">
                { hasCheckbox ? 
                    <ContentCheckbox></ContentCheckbox>
                    : null
                }
                <CardContentObjectRow
                    onClick={() => onObjectSelection(item.id, item.attributes.FileName, item.attributes.Thumbnail, item.size, item.attributes.Timestamp)}
                    objectFile={item.attributes.Thumbnail}
                    objectName={item.attributes.FileName}
                    objectSize={item.size}
                    uploadedAt={item.attributes.Timestamp}>
                </CardContentObjectRow>
                { hasDropdown ?
                    <ContentDropdown></ContentDropdown>
                    : null
                }
                { hasOverlayMenu ?
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

ViewObjectsGrid.propTypes = {
    hasCheckbox: PropTypes.bool,
    hasDropdown: PropTypes.bool,
};

ViewObjectsGrid.defaultProps = {
    hasCheckbox: false,
    hasDropdown: true,
}; 

ViewObjectsRow.propTypes = {
    hasCheckbox: PropTypes.bool,
    hasDropdown: PropTypes.bool,
};

ViewObjectsRow.defaultProps = {
    hasCheckbox: false,
    hasDropdown: true,
};                        