import React from "react";

import { Progress } from 'react-sweet-progress';
import 'react-sweet-progress/lib/style.css';

const name="percentageProgress";

export default class CompProgress extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            list: [],
            percentage: 0,
            title:"",
            show: false
        }
    }

    /* One to check:
        https://getbootstrap.com/docs/5.0/components/progress/
    */
     async componentDidMount () {
        console.log("percentage ready")
        window.runtime.EventsOn(name, async (progressMessage) => {
            console.log("progressMessage", {progressMessage})
            //add a property as to whether to automatically close the progress bar
            await this.setState({...this.state, title: progressMessage.Title, percentage: progressMessage.Progress})
            if (!progressMessage.Show) {
                console.log("closing the progress bar")
                await this.setState({...this.state, show: false})
            } else if (progressMessage.Show && !this.props.show) { //don't update state every time (would force a re-render)
                await this.setState({...this.state, show: true})
            }
        })
    }

    render() {
        if (!this.state.show) {
            return null
        }
        return (
            <div className="molProgress utTemp d-flex align-items-center justify-content-center">
                <div className="molProgressContainer">
                    <h4>{this.state.title}</h4>
                    <Progress
                        theme={{
                            active: {
                                color: 'rgba(0, 175, 75, 0.5)'
                            },
                            success: {
                                color: 'rgb(0, 175, 75)'
                            }
                        }}
                        percent={this.state.percentage}/>
                    <div className="molProgressFooter">
                        <button onClick={async () => {await this.setState({...this.state, show: false})}} className="atmButtonIcon">Close</button>
                    </div>
                </div>
            </div>
        )
    }
}

