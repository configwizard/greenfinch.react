import ViewContainers from "../../organisms/ViewContainers";
import HeadingGeneral from "../../atoms/HeadingGeneral";
import Moment from "react-moment";
import {fileSize} from "humanize-plus";

// Components
import ButtonText from '../../atoms/ButtonText';
import ContainerIcon from '../../atoms/ContainerIcon';
import ViewObjects, {ContainerPreviewButton} from "../../organisms/ViewObjects";
import ContainerShareButton from "../../organisms/ContainerShareButton";
import {openInDefaultBrowser} from "../../../manager/manager";
import React from "react";

// Central style sheet for templates
import '../_settings/style.scss';

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
                <div className="container-data col-4">
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
                                <>
                                    <div className="object-data" id={"objectData"}>
                                        <HeadingGeneral
                                            level={"h5"}
                                            isUppercase={false}
                                            text={state.selectedObject.objectName || null}/>
                                        <HeadingGeneral
                                            level={"h6"}
                                            isUppercase={true}
                                            text={"Object ID"}/>
                                            <p>{state.selectedObject.objectID || null}</p>
                                        <ContainerPreviewButton icon="fas fa-download" text="Download this object" onClick={onObjectDownload}></ContainerPreviewButton>
                                        { state.selectedContainer.permissions === 264211711 || 264224767 ?
                                            <ButtonText 
                                                type="clean"
                                                size="small"
                                                hasIcon={true}
                                                faClass={"fas fa-external-link"}
                                                text={"Click to view file in web browser"}
                                                onClick={() => openInDefaultBrowser(`https://http.testnet.fs.neo.org/${state.selectedContainer.containerID}/${state.selectedObject.objectID}`)} /> 
                                        : null }
                                    </div>
                                </> : null
                            }
                    </div>
                </div>
                <div className="col-8">
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
