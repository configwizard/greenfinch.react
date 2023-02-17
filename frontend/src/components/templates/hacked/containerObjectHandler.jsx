import React from "react";

import ViewContainers from "../../organisms/ViewContainers";
import HeadingGeneral from "../../atoms/HeadingGeneral";
import Moment from "react-moment";
import {fileSize} from "humanize-plus";

// Components
import ButtonText from '../../atoms/ButtonText';
import ContainerIcon from '../../atoms/ContainerIcon';
import ViewObjects, {ContainerPreviewButton} from "../../organisms/ViewObjects";

import ContainerInfoButton from "../../organisms/ContainerInfoButton";
import ContainerShareButton from "../../organisms/ContainerShareButton";
import ContainerDeleteButton from "../../organisms/ContainerDeleteButton";
import ObjectInfoButton from "../../organisms/ObjectInfoButton";
import {openInDefaultBrowser} from "../../../manager/manager";

// Central style sheet for templates
import '../_settings/style.scss';

const selectPermission = (rawPermission) => {
    switch(rawPermission) {
        case 478973132:
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
                <div className="container-data col-3">
                    <ContainerIcon
                        size={"medium"}/>
                    <HeadingGeneral
                        level={"h5"}
                        isUppercase={false}
                        text={state.selectedContainer.containerName}/>
                    <HeadingGeneral
                        level={"h6"}
                        isUppercase={true}
                        text={"Container ID"}/>
                    <span>{state.selectedContainer.containerID}</span>
                    <HeadingGeneral
                        level={"h6"}
                        isUppercase={true}
                        text={"Container permission"}/>
                    <span>{selectPermission(state.selectedContainer.permissions)}</span>
                    <HeadingGeneral
                        level={"h6"}
                        isUppercase={true}
                        text={"Container created"}/>
                    <span><Moment unix format="DD MMM YY">{state.selectedContainer.createdAt}</Moment></span>
                    <HeadingGeneral
                        level={"h6"}
                        isUppercase={true}
                        text={"Container size"}/>
                    <span>{fileSize(state.selectedContainer.size)}</span>
                    <div class="buttonStack">
                        <ContainerInfoButton
                            containerName={state.selectedContainer.containerName}
                            containerId={state.selectedContainer.containerID}
                            containerPermission={selectPermission(state.selectedContainer.permissions)}
                            containerCreated={<Moment unix format="DD MMM YY">{state.selectedContainer.createdAt}</Moment>}
                            containerSize={fileSize(state.selectedContainer.size)} />
                        { !state.shared ? <>
                        <ContainerPreviewButton
                            icon="fas fa-upload"
                            text="Upload to this container"
                            onClick={onObjectUpload}/>
                        <ContainerShareButton
                            containerId={state.selectedContainer.containerID}
                            contacts={state.contacts}/>
                        <ContainerDeleteButton
                            containerName={state.selectedContainer.containerName}/>
                        </> : null }
                    </div>
                </div>
                <div className="col-6">
                    <div className="orgContainersGrid">
                        <div className="row">
                            <ViewObjects shared={state.shared} objectsLoaded={state.objectsLoaded} onDelete={onObjectDelete} objectList={state.objectList} viewMode={state.viewMode} onObjectSelection={onObjectSelection}></ViewObjects>
                        </div>
                    </div>
                </div>
                <div className="col-3">
                    { state.selectedObject ?
                        <>
                            <div className="object-data" id={"objectData"}>
                                <figure>
                                    <img className="mw-100" src={`data:image/png;base64,${state.selectedObject.objectFile}`} alt={state.selectedObject.objectName} />
                                </figure>
                                <HeadingGeneral
                                    level={"h5"}
                                    isUppercase={false}
                                    text={state.selectedObject.objectName || null}/>
                                <HeadingGeneral
                                    level={"h6"}
                                    isUppercase={true}
                                    text={"Object ID"}/>
                                    <span>{state.selectedObject.objectID || null}</span>
                                <div class="buttonStack">
                                    <ObjectInfoButton
                                        objectFile={state.selectedObject.objectFile}
                                        objectName={state.selectedObject.objectName}
                                        objectId={state.selectedObject.objectID} />
                                    <ContainerPreviewButton 
                                        icon="fas fa-download" 
                                        text="Download this object" 
                                        onClick={onObjectDownload} />
                                    { state.selectedContainer.permissions === 264211711 || 264224767 ?
                                        <ButtonText 
                                            type="clean"
                                            size="small"
                                            hasIcon={true}
                                            faClass={"fas fa-external-link"}
                                            text={"Click to view file in web browser"}
                                            onClick={() => openInDefaultBrowser(`https://http.t5.fs.neo.org/${state.selectedContainer.containerID}/${state.selectedObject.objectID}`)} />
                                    : null }
                                </div>
                            </div>
                        </> : null
                    }
                </div>
            </>
        )
    }
}

export default retrieveCorrectComponent
