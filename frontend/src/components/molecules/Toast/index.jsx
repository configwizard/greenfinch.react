import React from 'react';

import './style.scss';

const runtime = require('@wailsapp/runtime');
const name = 'freshtoast';

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

export default class ToastMessage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            list: []
        }
    }
    async componentDidMount () {
        console.log("mounting")
        window.runtime.EventsOn(name, async (message) => {
            console.log(message)
            await this.makeToast(message)
        })
        setInterval(() => {
            if (this.props.autoDelete && this.state.list.length) {
                if (((new Date) - this.state.list[0].startTime) > this.props.autoDeleteTime) {
                    this.deleteToast(this.state.list[0].id);
                }
            }
        }, this.props.autoDeleteTime)
    }
    makeToast = async (message) => {
        message.startTime = Date.now()
        let list = this.state.list
        list.push(message)
        console.log("push list", list)
        await this.setState({list: list})
    }
    deleteToast = async id => {
        const index = this.state.list.findIndex(e => e.id === id);
        let list = this.state.list
        list.splice(index, 1); //how to set the state back to this
        await this.setState({list: list})
    }
    render() {
        console.log("this.state.list", this.state.list)
        return (
            <>
                <div class="ToastColumn">
                {
                    this.state.list.map((toast, i) => {
                        const faIcon = iconSelector(toast.Type)
                        console.log("toastType ", toast.type)
                        return (

                            <div key={i} className="toastMolecule">
                                <div className="toastContainer">
                                    <div className={`toastWrapper ${toast.Type}`}>
                                        <div className="toastInner d-flex">
                                            <div className="toast-icon d-flex align-items-center justify-content-center">
                                                <i className={`fad ${faIcon}`}/>
                                            </div>
                                            <div className="toastContent d-flex flex-column justify-content-center">
                                                <i className="fa fa-times" onClick={() => this.deleteToast(toast.id)}/>
                                                <span className="atmToastTitle">{toast.Title}</span>
                                                <span className="atmToastMessage">{toast.Description}</span>
                                            </div>
                                        </div>
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
