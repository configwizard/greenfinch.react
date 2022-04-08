import React from 'react';

import { Progress } from 'react-sweet-progress';
import 'react-sweet-progress/lib/style.css';

import './style.scss';

const name = "percentageProgress";

export default class ProgressBar extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            list: [],
            percentage: 0,
            title:"Test",
            show: false
        }
    }
    /* One to check: https://getbootstrap.com/docs/5.0/components/progress/ */
     async componentDidMount () {
        console.log("percentage ready")
        /* 
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
        */
    }
    render() {
        if (!this.state.show) {
            return null
        }
        return (
            <div className="molProgressContainer">
                <div className="molProgressWrapper">
                    <div className="molProgressInner d-flex">
                        <div className="molProgressContent d-flex align-items-center justify-content-center">
                                <i className="fa fa-fw fa-times" onClick={async () => {await this.setState({...this.state, show: false})}}/>
                                <Progress
                                    theme={{
                                        success: {
                                            color: 'rgba(0, 175, 75, 1)'
                                        },
                                        active: {
                                            color: 'rgba(0, 175, 75, 0.5)'
                                        },
                                        default: {
                                            color: 'rgba(43, 57, 63, 0.2)'
                                        }
                                    }}
                                    percent={this.state.percentage}/>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

