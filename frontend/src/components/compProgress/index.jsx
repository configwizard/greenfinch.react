import React from "react";

const Progress = props => {
    if (!props.show) {
        return null
    }
    return ( 
        <div className="molProgress utTemp d-flex align-items-center justify-content-center">
            <div className="molProgressContainer">
                I am an exciting progress thing.
                <div className="molProgressFooter">
                    <button onClick={props.onClose} className="atmButtonIcon">Close</button>
                </div>
            </div>
        </div>
    )
}

export default Progress;