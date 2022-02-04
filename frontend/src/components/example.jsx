import React from "react"

class GridView extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            viewType: "list"
        }
    }

    render() {
        if (this.state.viewType == "list") {}
        return (
                //here map....
                //component list 
        )
        } else {
            return (
                div
                {this.props.list.map((item,i) => //list is whatever array was passed in (could be array of containers, or array of objects)
                    <div className="col-6 col-lg-4 col-xl-2" key={i}>
                        <button className="molContainersButton d-flex flex-column align-items-center justify-content-between">
                            <div className="atmButtonOptions">
                                <i className="far fa-ellipsis-h"/>
                            </div>
                            <i className="fas fa-3x fa-archive"/>
                            <span className="atmContainerName">{item.name}</span>
                        </button>
                    </div>
                )}
            )
        }
    }
}