import React from 'react';
import { Progress } from 'react-sweet-progress';
import 'react-sweet-progress/lib/style.css';

import ButtonClose from '../../atoms/ButtonClose';
import ButtonIcon from '../../atoms/ButtonIcon';

import { cancelObjectContext } from "../../../manager/manager.js";

import './style.scss';

const name = "percentageProgress";

export default class ProgressBar extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            list: [],
            percentage: 0,
            title:"Progress",
            show: false
        }
    }
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
            <div className="molProgressContainer">
                <div className="molProgressWrapper">
                    <div className="molProgressInner d-flex">
                        <div className="molProgressContent d-flex flex-column">
                            <div>
                                <span className="atmProgressTitle">Progress</span>
                            </div>
                            <div className="molProgressUnit">
                                <Progress
                                    theme={{
                                        success: {
                                            color: 'rgba(0, 173, 75, 1)'
                                        },
                                        active: {
                                            color: 'rgba(0, 173, 75, 1)'
                                        },
                                        default: {
                                            color: 'rgba(255, 255, 255, 1)'
                                        }
                                    }}
                                    strokeWidth={15}
                                    percent={this.state.percentage}/>
                                <ButtonIcon size={"small"} type={"default"} isDisabled={false} faClass={"fa-sharp fa-solid fa-xmark"} onClick={async () => {await cancelObjectContext(); await this.setState({...this.state, show: false})}}></ButtonIcon>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

