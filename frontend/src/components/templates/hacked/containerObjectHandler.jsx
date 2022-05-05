import ViewContainers from "../../organisms/ViewContainers";
import HeadingGeneral from "../../atoms/HeadingGeneral";
import Moment from "react-moment";
import {fileSize} from "humanize-plus";
import ViewObjects, {ContainerPreviewButton} from "../../organisms/ViewObjects";
import ContainerShareButton from "../../organisms/ContainerShareButton";
import {openInDefaultBrowser} from "../../../manager/manager";
import React from "react";

const selectPermission = (rawPermission) => {
    switch(rawPermission) {
        case 478973132 :
            return "Private"
        case 264211711:
            return "Public Read Only"
        case 264224767:
            return "Public Read/Write"
        case 268423167:
            return "custom - " + rawPermission.toString(16);
        default:
            return rawPermission.toString(16)
    }
}

function retrieveCorrectComponent(state, onObjectSelection, onObjectDelete, onObjectDownload, onObjectUpload, onContainerSelection, onContainerDelete) {
    if (state.selectedContainer == null) {
        return (
            <>
                <div className="col-3">
                    <p>Select a container to open and view contents.</p>
                </div>
                <div className="col-9">
                    <div className="orgContainersGrid">
                        <div className="row">
                            <ViewContainers containerList={state.containerList} onDelete={onContainerDelete} viewMode={state.viewMode} onContainerSelection={onContainerSelection}></ViewContainers>
                        </div>
                    </div>
                </div>
            </>
        )
    } else {
        return (
            <>
                <div className="temporary-class col-3">
                    <div className="neo folder-icon"></div>
                    <h4>{state.selectedContainer.containerName}</h4>
                    <HeadingGeneral
                        level={"h6"}
                        isUppercase={true}
                        text={"Container ID"}/>
                    <p>{state.selectedContainer.containerID}</p>
                    <HeadingGeneral
                        level={"h6"}
                        isUppercase={true}
                        text={"Container permission"}/>
                    <p>{selectPermission(state.selectedContainer.permissions)}</p>
                    <HeadingGeneral
                        level={"h6"}
                        isUppercase={true}
                        text={"Container created"}/>
                    <p><Moment unix format="DD MMM YY">{state.selectedContainer.createdAt}</Moment></p>
                    <HeadingGeneral
                        level={"h6"}
                        isUppercase={true}
                        text={"Container size"}/>
                    <p>{fileSize(state.selectedContainer.size)}</p>
                    <div class="buttonStack">
                        <ContainerPreviewButton
                            icon="fas fa-upload"
                            text="Upload to this container"
                            onClick={onObjectUpload}/>
                        <ContainerShareButton
                            containerId={state.selectedContainer.containerID}
                            contacts={state.contacts}/>
                        {
                            state.selectedObject ?
                                <><span id={"objectData"}>
                                        <HeadingGeneral
                                            level={"h4"}
                                            isUppercase={true}
                                            text={"Selected Object"}/>
                                    { state.selectedContainer.permissions === 264211711 || 264224767 ?
                                        <p onClick={() => openInDefaultBrowser(`https://http.testnet.fs.neo.org/${state.selectedContainer.containerID}/${state.selectedObject.objectID}`)} style={{fontSize: 9}}>Click to view in web browser</p> : null }
                                    <HeadingGeneral
                                        level={"h6"}
                                        isUppercase={true}
                                        text={"Object name"}/>
                                            <p style={{fontSize: 9}}>{state.selectedObject.objectName || null}</p>
                                            <HeadingGeneral
                                                level={"h6"}
                                                isUppercase={true}
                                                text={"Object Id"}/>
                                            <p style={{fontSize: 9}}>{state.selectedObject.objectID || null}</p>
                                            <ContainerPreviewButton icon="fas fa-download" text="Download this object" onClick={onObjectDownload}></ContainerPreviewButton>
                                        </span>
                                </> : null
                        }
                    </div>
                </div>
                <div className="col-9">
                    <div className="orgContainersGrid">
                        <div className="row">
                            <ViewObjects objectsLoaded={state.objectsLoaded} onDelete={onObjectDelete} objectList={state.objectList} viewMode={state.viewMode} onObjectSelection={onObjectSelection}></ViewObjects>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

export default retrieveCorrectComponent
