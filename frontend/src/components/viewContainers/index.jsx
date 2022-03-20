import React from "react";
import {ContainerGrid, ContainerRow} from "./container"
import CompModalStandard from "../compModals/compModalStandard";
import {createContainer} from "../../manager/containers";
import {Form} from "react-bootstrap";
import {loadWallet, newWallet} from "../../manager/manager";
import {useModal} from "../compModals/compModalContext";
import CompModalBrand from "../compModals/compModalBrand";

function ContainerView(props) {
// class ContainerView extends React.Component {
//     constructor(props) {
//         super(props);
//         this.state = {}
//     }
    const {containerList, onContainerSelection, viewMode} = props
    if (viewMode === "grid") {
        return (
            <div id="containerGridView" className="row">
                {containerList.map((item, i) =>
                    <div className="col-6 col-lg-3 col-xl-2" key={i}>
                        <div className="molButtonGrid">
                            <ContainerGrid type={item.type} onDelete={() => {
                                props.onDelete(item.id)
                            }} onContainerSelection={props.onContainerSelection} item={item}></ContainerGrid>
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
                            <ContainerRow type={item.type} onDelete={() => {
                                props.onDelete(item.id)
                            }} onContainerSelection={props.onContainerSelection} item={item}></ContainerRow>

                        </div>
                    </div>
                )}
            </div>
        )
    }
}


export default ContainerView;


