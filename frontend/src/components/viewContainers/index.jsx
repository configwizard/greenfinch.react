import React, { useState } from "react";
import CompOverlayMenu from "../compOverlayMenu";

function ContainerView({containerList, onContainerSelection, viewMode}) {
    console.log("onContainerSelection", onContainerSelection)
    const [show, setShow] = useState(false)

    if (viewMode === "grid") {
        return (
            <div className="row">
                {containerList.map((item,i) =>
                    <>
                        <div className="col-6 col-lg-4 col-xl-2" key={i}>
                            <div className="molButtonGrid">
                                <div className="atmButtonGridHeader d-flex">

                                    {/* This: https://stackoverflow.com/questions/50040193/react-show-menu-when-clicking-on-just-one-item-from-iterating-item */}

                                    <button type="button" className="atmButtonOptions ms-auto" onClick={() => setShow(true)}>
                                        <i className="far fa-ellipsis-h"/>
                                        <CompOverlayMenu onClose={() => setShow(false)} show={show}></CompOverlayMenu>
                                    </button>
                                </div>
                                <button type="button" className="atmButtonGridContent d-flex flex-column align-items-center justify-content-between" onClick={() => onContainerSelection(item.id)}>
                                    <div class="neo folder-icon"></div>
                                    <span className="atmButtonGridName">{item.name}</span>
                                </button>
                            </div>
                        </div>
                        {/*
                        <div className="col-6 col-lg-4 col-xl-2" key={i}>
                            <button type="button" className="molContainersButtonGrid d-flex flex-column align-items-center justify-content-between" onClick={() => onContainerSelection(item.id)}>
                                <div className="molButtonOptions">
                                    <div className="atmButtonOptions">{
                                        <i className="far fa-ellipsis-h"/>
                                    </div>
                                </div>
                                <div class="neo folder-icon"></div>
                                <span className="atmContainerName">{item.name}</span>
                            </button>
                        </div>
                        */}
                    </>
                )}
            </div>
        )
    } else {
        return (
            <div className="row">
                {containerList.map((item,i) =>
                    <div className="col-12" key={i}>
                        <button type="button" className="molContainersButtonRow d-flex flex-row align-items-center" onClick={() => onContainerSelection(item.id)}> 
                            <i className="fas fa-folder"/>
                            <span className="atmContainerName">{item.name}</span>
                        </button>
                    </div>
                )}
            </div>
        )
    }
}

export default ContainerView;


