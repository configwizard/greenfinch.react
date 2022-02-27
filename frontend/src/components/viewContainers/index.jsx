import React from "react";

import {ContainerGrid, ContainerRow} from "./container"


function ContainerComponent(props) {
    return (
        <div className="col-6 col-lg-3 col-xl-2">
            <div className="molButtonGrid">
                <ContainerGrid onContainerSelection={props.onContainerSelection} item={props.container}></ContainerGrid>
            </div>
        </div>
    )
}
class ContainerView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    render() {
        const {containerList, onContainerSelection, viewMode} = this.props
        if (viewMode === "grid") {
        return (
            <div id="containerGridView" className="row">
                {containerList.map((item, i) =>
                    <div className="col-6 col-lg-3 col-xl-2" key={i}>
                        <div className="molButtonGrid">
                            <ContainerGrid onContainerSelection={onContainerSelection} item={item}></ContainerGrid>
                        </div>
                    </div>
                )}
            </div>
        )
        } else {
            return (
                <div className="row">
                    {containerList.map((item, i) =>
                        <div className="col-12" key={i}>
                            <div className="molButtonRow">
                                <ContainerRow onContainerSelection={onContainerSelection} item={item}></ContainerRow>
                            </div>
                        </div>
                    )}
                </div>
            )
        }
    }
}

export default ContainerView;


