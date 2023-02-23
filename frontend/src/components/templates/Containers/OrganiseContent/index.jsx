import React from "react";
import Moment from "react-moment";
import {fileSize} from "humanize-plus";

// Components
import ButtonText from '../../../atoms/ButtonText';
import ContainerIcon from '../../../atoms/ContainerIcon';
import HeadingGeneral from '../../../atoms/HeadingGeneral';
import ViewContainers from '../../../organisms/ViewContainers';
import ViewObjects, {ContainerPreviewButton} from '../../../organisms/ViewObjects';
import {openInDefaultBrowser} from '../../../../manager/manager';
import ColumnData from '../../../organisms/nColumnData';


// To re-allocate
import ObjectInfoButton from '../../../organisms/ObjectInfoButton';
import ContainerInfoButton from '../../../organisms/ContainerInfoButton';
import ContainerShareButton from '../../../organisms/ContainerShareButton';
import ContainerDeleteButton from '../../../organisms/ContainerDeleteButton';


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
                {/* RG48. This is container view. */}
                <div className="col-3">
                    <p>Select a container to open and view contents.</p>
                </div>
                
                <div className="col-9">
                    <div className="orgContainersGrid">

                        <div className="templateWrapper">
                            <div className="templateInner">
                                <div className="row">
                                    <ViewContainers containerList={state.containerList} onDelete={onContainerDelete} viewMode={state.viewMode} onContainerSelection={onContainerSelection}></ViewContainers>
                                </div>
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

                    <div className="buttonStack">
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
                    <div className="orgObjectsGrid">

                        <div className="templateWrapper">
                            <div className="templateInner">
                                <div className="row">
                                    <ViewObjects shared={state.shared} objectsLoaded={state.objectsLoaded} onDelete={onObjectDelete} objectList={state.objectList} viewMode={state.viewMode} onObjectSelection={onObjectSelection}></ViewObjects>
                                </div>
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
                                    contentTitle={state.selectedObject.objectName || null}
                                    data={[
                                        {
                                            contentDataTitle:"Object ID",
                                            contentDataValue: state.selectedObject.objectID || null
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
                                <div className="buttonStack">
                                    <ObjectInfoButton
                                        objectId={state.selectedObject.objectID}
                                        objectFile={state.selectedObject.objectFile}
                                        objectName={state.selectedObject.objectName}
                                        uploadedAt={state.selectedObject.uploadedAt}
                                        objectSize={state.selectedObject.size} />
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
                                            text={"Click to view object in web browser"}
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
