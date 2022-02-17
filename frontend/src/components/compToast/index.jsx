import React from "react";

const runtime = require('@wailsapp/runtime');
const name = "freshtoast"

const iconSelector = (type) => {
    console.log("type selected ", type)
    switch (type) {
        case 'success':
            return 'fa-check-circle';
            break;
        case 'error':
            return 'fa-ban';
            break;
        case 'warning':
            return 'fa-exclamation-triangle';
            break;
        case 'info':
            return 'fa-info-circle';
            break;
        default:
            return 'fa-comment-alt';
            break;
    }
}

export default class CompToast extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            list: []
        }
    }
    //todo: uncomment for demoing toasts

    // async componentDidMount () {
    //     console.log("mounting")
    //     window.runtime.EventsOn(name, async (message) => {
    //         console.log(message)
    //         await this.makeToast(message)
    //     })
    //     setInterval(() => {
    //         if (this.props.autoDelete && this.state.list.length) {
    //             if (((new Date) - this.state.list[0].startTime) > this.props.autoDeleteTime) {
    //                 this.deleteToast(this.state.list[0].id);
    //             }
    //         }
    //     }, this.props.autoDeleteTime)
    // }
    makeToast = async (message) => {
        message.startTime = Date.now()
        let list = this.state.list
        list.push(message)
        console.log("push list", list)
        await this.setState({list: list})
    }
    deleteToast = id => {
        const index = this.state.list.findIndex(e => e.id === id);
        let list = this.state.list
        list.splice(index, 1); //how to set the state back to this
        this.setState({list: list})
    }
    render() {
        console.log("this.state.list", this.state.list)
        return (
            <>
                <div className="molToastContainer">
                    {
                        this.state.list.map((toast, i) => {
                            const fontAwesomeIcon = iconSelector(toast.Type)
                            console.log("toastType ", toast.type)
                            return (
                                <div
                                    key={i}
                                    className={`molToastWrapper ${toast.Type}`}>
                                    <div className="molToastInner d-flex">
                                        <div className="molToastIcon d-flex align-items-center justify-content-center">
                                            <i className={`fad ${fontAwesomeIcon}`}/>
                                        </div>
                                        <div className="molToastContent d-flex flex-column justify-content-center">
                                            <i className="fa fa-fw fa-times" onClick={() => this.deleteToast(toast.id)}/>
                                            <span className="atmToastTitle">{toast.Title}</span>
                                            <span className="atmToastMessage">{toast.Description}</span>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </>
        )
    }
}
