import React from 'react';
import { ContainerGrid, ContainerRow } from './Container';

// import { CardContentContainerGrid, CardContentContainerRow } from '../CardContent/CardContentContainer';

// import CardContentGrid from '../CardContent/CardContentGrid';
// import CardContentRow from '../CardContent/CardContentRow';

import './style.scss';

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
                        <div className="molButtonGrid">
                            <ContainerGrid onDelete={() => {this.props.onDelete(item.id)}} onContainerSelection={this.props.onContainerSelection} item={item}></ContainerGrid>
                            {/*
                            <CardContentContainerGrid
                                onDelete={() => {this.props.onDelete(item.id)}} 
                                onContainerSelection={this.props.onContainerSelection}
                                item={item}
                                hasCheckbox={false}
                                hasDropdown={false}>
                            </CardContentContainerGrid>
                            */}
                        </div>
                    </div>
                )}
            </div>
        )
        } else {
            return (
                <div className="row g-2">
                    {containerList.map((item, i) =>
                        <div className="col-12" key={i}>
                            <div className="molButtonRow">
                                <ContainerRow onDelete={() => {this.props.onDelete(item.id)}} onContainerSelection={this.props.onContainerSelection} item={item}></ContainerRow>
                                {/*
                                <CardContentContainerRow
                                    onDelete={() => {this.props.onDelete(item.id)}} 
                                    onContainerSelection={this.props.onContainerSelection}
                                    item={item}
                                    hasCheckbox={true}
                                    hasDropdown={true}>
                                </CardContentContainerRow>
                                */}
                            </div>
                        </div>
                    )}
                </div>
            )
        }
    }
}

export default ViewContainers;