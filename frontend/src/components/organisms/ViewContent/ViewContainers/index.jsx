import React from 'react';

// Components
import { ViewContainersGrid, ViewContainersRow } from './ViewContainersLayout';

// Central style sheet for ViewContainers
import '../_settings/style.scss';

class ViewContainers extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    render() {
        const {containerList, viewMode} = this.props
        console.log("containerList", containerList)
        if (viewMode === "grid") {
        return (
            <div className="row g-2">
                {containerList.map((item, i) =>
                    <div className="col-6 col-md-4 col-xl-3" key={i}>
                        <ViewContainersGrid onDelete={() => {this.props.onDelete(item.id)}} onContainerSelection={this.props.onContainerSelection} item={item}></ViewContainersGrid>
                    </div>
                )}
            </div>
        )
        } else {
            return (
                <div className="row g-2">
                    {containerList.map((item, i) =>
                        <div className="col-12" key={i}>
                            <ViewContainersRow onDelete={() => {this.props.onDelete(item.id)}} onContainerSelection={this.props.onContainerSelection} item={item}></ViewContainersRow>
                        </div>
                    )}
                </div>
            )
        }
    }
}

export default ViewContainers;