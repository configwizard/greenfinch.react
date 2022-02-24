import React, { useState } from "react";

import {ContainerGrid, ContainerRow} from "./container"

function ContainerView({containerList, onContainerSelection, viewMode}) {
    console.log("onContainerSelection", onContainerSelection)

    if (viewMode === "grid") {
        return (
            <div className="row">
                {containerList.map((item,i) =>
                    <>
                        <div className="col-6 col-lg-4 col-xl-2" key={i}>
                            <div className="molButtonGrid">
                                <ContainerGrid onContainerSelection={onContainerSelection} item={item}></ContainerGrid>
                            </div>
                        </div>
                    </>
                )}
            </div>
        )
    } else {
        return (
            <div className="row">
                {containerList.map((item,i) =>
                    <div className="col-12" key={i}>
                        <ContainerRow onContainerSelection={onContainerSelection} item={item}></ContainerRow>
                    </div>
                )}
            </div>
        )
    }
}

export default ContainerView;


