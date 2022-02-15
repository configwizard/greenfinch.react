import React from "react";

import { Progress } from 'react-sweet-progress';
import 'react-sweet-progress/lib/style.css';

const CompProgress = props => {
    if (!props.show) {
        return null
    }
    return ( 
        <div className="molProgress utTemp d-flex align-items-center justify-content-center">
            <div className="molProgressContainer">
                <h4>Progress bar example</h4>
                <Progress
                    theme={{
                        active: {
                            color: 'rgba(0, 175, 75, 0.5)'
                        },
                        success: {
                            color: 'rgb(0, 175, 75)'
                        }
                    }}
                percent={22} />
                <div className="molProgressFooter">
                    <button onClick={props.onClose} className="atmButtonIcon">Close</button>
                </div>
            </div>
        </div>
    )
}

export default CompProgress;