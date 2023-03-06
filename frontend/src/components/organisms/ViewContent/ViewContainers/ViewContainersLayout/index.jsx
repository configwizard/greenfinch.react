import React from 'react';
import PropTypes from 'prop-types';

// Components
import ContentCheckbox from '../../../../atoms/ContentCheckbox';
import CardContentContainerGrid from '../../../../molecules/CardLayout/CardContentContainerGrid';
import CardContentContainerRow from '../../../../molecules/CardLayout/CardContentContainerRow';
import ContentDropdown from '../../../../molecules/ContentDropdown';
import { DeleteButton } from '../../../../molecules/ContentDropdown/Buttons';

// Central style sheet for ViewContainers
import '../../_settings/style.scss';

export function ViewContainersGrid(props) {
    console.log("container grid item", props.item)
    return (
        <section className="orgViewContainersGrid">
            <div className="molViewContainersHeader d-flex flex-row justify-content-end">
                { props.hasCheckbox ?
                    <div className="me-auto">
                        <ContentCheckbox></ContentCheckbox>
                    </div>
                    : null
                }
                { props.hasDropdown ?
                    <ContentDropdown
                        type={props.item.type}
                        id={props.item.id}
                        filename={props.item.attributes.FileName}>
                        <DeleteButton // child of the ContentDropdown
                            onDelete={props.onDelete}>
                        </DeleteButton>
                    </ContentDropdown>
                    : null
                }
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
    console.log("container row item", props.item)
    return (
        <section className="orgViewContainersRow">
            <div className="d-flex flex-row">
                { props.hasCheckbox ? 
                    <ContentCheckbox></ContentCheckbox>
                    : null
                }
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
                { props.hasDropdown ?
                    <ContentDropdown
                        type={props.item.type}
                        id={props.item.id}
                        filename={props.item.attributes.FileName}>
                        <DeleteButton // child of the ContentDropdown
                            onDelete={props.onDelete}>
                        </DeleteButton>
                    </ContentDropdown>
                    : null
                }
            </div>
        </section>
    )
}


ViewContainersGrid.propTypes = {
    hasCheckbox: PropTypes.bool,
    hasDropdown: PropTypes.bool,
};

ViewContainersGrid.defaultProps = {
    hasCheckbox: false,
    hasDropdown: true,
};

ViewContainersRow.propTypes = {
    hasCheckbox: PropTypes.bool,
    hasDropdown: PropTypes.bool,
};

ViewContainersRow.defaultProps = {
    hasCheckbox: false,
    hasDropdown: true,
};