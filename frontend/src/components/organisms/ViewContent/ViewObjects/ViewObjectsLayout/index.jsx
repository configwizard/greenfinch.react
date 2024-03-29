import React from 'react';
import PropTypes from 'prop-types';

// Components
import ContentCheckbox from '../../../../atoms/ContentCheckbox';
import CardContentObjectGrid from '../../../../molecules/CardLayout/CardContentObjectGrid';
import CardContentObjectRow from '../../../../molecules/CardLayout/CardContentObjectRow';
import ContentDropdown from '../../../../molecules/ContentDropdown';
import {DeleteButton, DownloadButton} from '../../../../molecules/ContentDropdown/Buttons';

// Central style sheet for ViewObjects
import '../../_settings/style.scss';

export function ViewObjectsGrid(props) {
    console.log("props.onDelete ", props.onDelete)
    console.log("object grid item", props.item)
    return (
        <section className={`orgViewObjectsGrid ${props.item.PendingDeleted ? "utPendingDeleted" :  null }`}>
            <div className="molViewObjectsHeader d-flex flex-row justify-content-end">
                { props.hasCheckbox ?
                    <div className="me-auto">
                        <ContentCheckbox></ContentCheckbox>
                    </div>
                    : null
                }
                { props.hasDropdown ?
                    <ContentDropdown
                        onObjectSelection={props.onObjectSelection} 
                        id={props.item.id}
                        filename={props.item.attributes.FileName} 
                        type={props.item.type}>
                        <DownloadButton // child of the ContentDropdown
                            onDownload={props.onDownload}>
                        </DownloadButton>
                        { props.onDelete !== null ? <DeleteButton // child of the ContentDropdown
                            onDelete={props.onDelete}>
                        </DeleteButton> : null }
                    </ContentDropdown>
                    : null
                }
            </div>
            <CardContentObjectGrid
                onClick={() => props.onObjectSelection(props.item.id, props.item.attributes.FileName, props.item.attributes.Thumbnail, props.item.size, props.item.attributes.Timestamp)}
                objectFile={props.item.attributes.Thumbnail}
                dataType={props.item.attributes.X_EXT}
                objectName={props.item.attributes.FileName}>
            </CardContentObjectGrid>
        </section>
    )
}
export function ViewObjectsRow(props) {
    console.log("object row item", props.item)
    return (
        <section className={`orgViewObjectsRow ${props.item.PendingDeleted ? "utPendingDeleted" : null }`}>
            <div className="d-flex flex-row">
                { props.hasCheckbox ? 
                    <ContentCheckbox></ContentCheckbox>
                    : null
                }
                <CardContentObjectRow
                    onClick={() => props.onObjectSelection(props.item.id, props.item.attributes.FileName, props.item.attributes.Thumbnail, props.item.size, props.item.attributes.Timestamp)}
                    objectFile={props.item.attributes.Thumbnail}
                    dataType={props.item.attributes.X_EXT}
                    objectName={props.item.attributes.FileName}
                    objectSize={props.item.size}
                    uploadedAt={props.item.attributes.Timestamp}>
                </CardContentObjectRow>
                { props.hasDropdown ?
                    <ContentDropdown
                        onObjectSelection={props.onObjectSelection} 
                        id={props.item.id}
                        filename={props.item.attributes.FileName} 
                        type={props.item.type}>
                        <DownloadButton // child of the ContentDropdown
                            onDownload={props.onDownload}>
                        </DownloadButton>
                        { props.onDelete !== null ? <DeleteButton // child of the ContentDropdown
                            onDelete={props.onDelete}>
                        </DeleteButton> : null }
                    </ContentDropdown>
                    : null
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