import React from "react";
import Moment from "react-moment";
import {fileSize} from "humanize-plus";

// Components
import ButtonText from '../../../atoms/ButtonText';
import InfoBox from "../../../atoms/InfoBox";
import ViewContainers from '../../../organisms/ViewContent/ViewContainers';
import ViewObjects, {ButtonContentAction} from '../../../organisms/ViewContent/ViewObjects';
import {openInDefaultBrowser} from '../../../../manager/manager';
import ColumnData from '../../../organisms/ColumnData';

// To re-allocate
import ButtonContentObjectInfo from '../../../molecules/ButtonsContent/ButtonContentObjectInfo';
import ButtonContentContainerInfo from '../../../molecules/ButtonsContent/ButtonContentContainerInfo';
import ButtonContentContainerShare from '../../../molecules/ButtonsContent/ButtonContentContainerShare';
import ButtonContentContainerDelete from '../../../molecules/ButtonsContent/ButtonContentContainerDelete';


// Central style sheet for templates
import '../../_settings/style.scss';

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

function filterContent(state, onObjectSelection, onObjectDelete, onObjectDownload, onObjectUpload, onContainerSelection, onContainerDelete) {
    if (state.selectedContainer == null) {
        return (
            <>
                <div className="col-3">
                    <InfoBox
                        type="info"
                        text={"Select a container to open and view contents."} />
                </div>
                <div className="col-9">
                    <div className="orgContainersGrid">
                        <div className="templateWrapper">
                            <div className="templateInner">
                                <ViewContainers containerList={state.containerList} onDelete={onContainerDelete} viewMode={state.viewMode} onContainerSelection={onContainerSelection}></ViewContainers>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    } else {
        return (
            <>
                <div className="container-data col-3">
                    <ColumnData
                        display="container"
                        category="static"
                        contentTitle={state.selectedContainer.containerName}
                        iconSize={"medium"}
                        data={[
                            {
                                contentDataTitle:"Container ID",
                                contentDataValue: state.selectedContainer.containerID
                            },
                            {
                                contentDataTitle:"Container permission",
                                contentDataValue: selectPermission(state.selectedContainer.permissions)
                            }, 
                            {
                                contentDataTitle:"Container created",
                                contentDataValue: <Moment unix format="DD MMM YY">{state.selectedContainer.createdAt}</Moment>
                            },
                            {
                                contentDataTitle:"Container size",
                                contentDataValue: fileSize(state.selectedContainer.size)
                            },
                        ]} />
                    <div className="buttonStackVerticalHR">
                        <ButtonContentContainerInfo
                            containerName={state.selectedContainer.containerName}
                            containerId={state.selectedContainer.containerID}
                            containerPermission={selectPermission(state.selectedContainer.permissions)}
                            containerCreated={<Moment unix format="DD MMM YY">{state.selectedContainer.createdAt}</Moment>}
                            containerSize={fileSize(state.selectedContainer.size)} />
                    </div>
                    <div className="buttonStackVertical">
                        { !state.shared ? <>
                        <ButtonContentAction
                            icon="fa-sharp fa-solid fa-upload"
                            text="Upload to this container"
                            onClick={onObjectUpload}/>
                        <ButtonContentContainerShare
                            containerId={state.selectedContainer.containerID}
                            contacts={state.contacts}/>
                        <ButtonContentContainerDelete
                            containerName={state.selectedContainer.containerName}
                            containerId={state.selectedContainer.containerID}
                            containerDelete={onContainerDelete}/>
                        </> : null }
                    </div>
                </div>
                <div className="col-6">
                    <div className="orgObjectsGrid">
                        <div className="templateWrapper">
                            <div className="templateInner">
                                <ViewObjects shared={state.shared} objectsLoaded={state.objectsLoaded} onDownload={onObjectDownload} onDelete={onObjectDelete} objectList={state.objectList} viewMode={state.viewMode} onObjectSelection={onObjectSelection}></ViewObjects>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-3">
                    { state.selectedObject ?
                        <>
                            <div className="object-data" id={"objectData"}>
                                <ColumnData
                                    display="object"
                                    category="static"
                                    file={state.selectedObject.objectFile}
                                    contentTitle={state.selectedObject.objectName}
                                    data={[
                                        {
                                            contentDataTitle:"Object ID",
                                            contentDataValue: state.selectedObject.objectID
                                        },
                                        {
                                            contentDataTitle:"Object created",
                                            contentDataValue: <Moment unix format="DD MMM YY">{state.selectedObject.uploadedAt}</Moment>
                                        },
                                        {
                                            contentDataTitle:"Object size",
                                            contentDataValue: fileSize(state.selectedObject.size)
                                        },
                                    ]} />
                            </div>
                            <div className="object-data" id={"objectData"}>
                                <div className="buttonStackVerticalHR">
                                    <ButtonContentObjectInfo
                                        objectId={state.selectedObject.objectID}
                                        objectFile={state.selectedObject.objectFile}
                                        objectName={state.selectedObject.objectName}
                                        uploadedAt={state.selectedObject.uploadedAt}
                                        objectSize={state.selectedObject.size} />
                                </div>
                                <div className="buttonStackVertical">
                                    <ButtonContentAction
                                        icon="fa-sharp fa-solid fa-download"
                                        text="Download this object" 
                                        onClick={() => {onObjectDownload(state.selectedObject.objectFile, state.selectedObject.objectID)}} />
                                    { state.selectedContainer.permissions === 264211711 || 264224767 ?
                                        <ButtonText 
                                            type="clean"
                                            size="small"
                                            hasIcon={true}
                                            faClass={"fa-sharp fa-solid fa-arrow-up-right-from-square"}
                                            text={"Click to view object in web browser"}
                                            isDisabled={false}
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

export default filterContent;
