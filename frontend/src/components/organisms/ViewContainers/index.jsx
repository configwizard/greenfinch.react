import React from 'react';
import { ContainerGrid, ContainerRow } from './Container';

import './style.scss';

class ViewContainers extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    render() {
        const {containerList, onContainerSelection, viewMode} = this.props
        if (viewMode === "grid") {
        return (
            <div className="row">
                {containerList.map((item, i) =>
                    <div className="col-6 col-lg-3 col-xl-2" key={i}>
                        <div className="molButtonGrid">
                            <ContainerGrid onDelete={() => {this.props.onDelete(item.id)}} onContainerSelection={this.props.onContainerSelection} item={item}></ContainerGrid>
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
                                <ContainerRow onDelete={() => {this.props.onDelete(item.id)}} onContainerSelection={this.props.onContainerSelection} item={item}></ContainerRow>
                            </div>
                        </div>
                    )}
                </div>
            )
        }
    }
}

export default ViewContainers;