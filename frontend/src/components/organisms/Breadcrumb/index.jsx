import React from 'react';

import './style.scss';

function BreadCrumb(props) {
    console.log("breadcrumb received wallet ", props.account)
    const selectedContainer = props.container == null ? "" : props.container.containerName
    const selectedObject = props.object == null ? "" : props.object.objectName
    console.log("selectedObject", props, selectedObject, selectedContainer)

    return (
        <section className="orgBreadcrumb d-flex align-items-center">
            <div className="breadcrumbWrapper d-flex flex-row">
                {
                    !selectedContainer && !selectedObject ?
                        <button className="atmBreadcrumb" type="button" disabled>Containers</button>   
                    : null
                }
                { 
                    selectedContainer && !selectedObject ? 
                        <>
                            <button className="atmBreadcrumb" type="button" onClick={props.resetBreadcrumb}>Containers</button>
                            <button className="atmBreadcrumb" type="button" disabled>{selectedContainer}</button>
                        </>
                    : null
                }
                { 
                    selectedContainer && selectedObject ? 
                        <>
                            <button className="atmBreadcrumb" type="button" onClick={props.resetBreadcrumb}>Containers</button>
                            <button className="atmBreadcrumb" type="button" disabled>{selectedContainer}</button>
                            <button className="atmBreadcrumb" type="button" disabled>{selectedObject}</button>
                        </>
                    :
                    null
                }
            </div>
        </section>
    );
}

export default BreadCrumb;
