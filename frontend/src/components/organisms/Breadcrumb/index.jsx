import React from 'react';

//import { topUpNeoFS } from '../../../manager/manager.js';

// Components

import './style.scss';

function BreadCrumb(props) {
    console.log("breadcrumb received wallet ", props.account)
    const selectedContainer = props.container == null ? "" : props.container.containerName
    const selectedObject = props.object == null ? "" : props.object.objectName
    console.log("selectedObject", props, selectedObject, selectedContainer)

    return (
        <div className="breadcrumb-wrapper d-flex align-items-center">
            <div className="breadcrumb-container">
                <span className="bread-home" onClick={props.resetBreadcrumb}>Containers</span>{selectedContainer ? <span className="bread-container">{selectedContainer}</span> : ''}{selectedObject ? <span className="bread-object">{selectedObject}</span> : ''}
            </div>
        </div>
    );
}

export default BreadCrumb;
