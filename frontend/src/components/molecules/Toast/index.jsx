import React from 'react';

// Components
import ButtonClose from '../../atoms/ButtonClose';

import './style.scss';

const runtime = require('@wailsapp/runtime');
const name = 'freshtoast';

const iconSelector = (type) => {
    console.log("Toast type selected ", type)
    switch (type) {
        case 'success':
            return 'fa-sharp fa-solid fa-circle-check';
        case 'error':
            return 'fa-sharp fa-solid fa-ban';
        case 'warning':
            return 'fa-sharp fa-solid fa-triangle-exclamation';
        case 'info':
            return 'fa-sharp fa-solid fa-circle-info';
        default:
            return 'fa-sharp fa-solid fa-messages';
    }
}

export default class ItemToast extends React.Component {
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
                if (((new Date()) - this.state.list[0].startTime) > this.props.autoDeleteTime) {
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
                <div className="toastColumn d-flex flex-column">
                    {
                        this.state.list.map((toast, i) => {
                            const toastIcon = iconSelector(toast.Type)
                            console.log("Toast type: ", toast.type)
                            return (
                                
                                <div key={i} className="molToast">
                                    { toast.Type === "copy" 
                                        ? 
                                            <div className={`toastWrapper ms-auto ${toast.Type}`}>
                                                <div className="toastInner d-flex">
                                                    <div className="toastContent d-flex align-items-center">
                                                        <span className="toastDesc">{toast.Description}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        : 
                                        <div className={`toastWrapper ${toast.Type}`}>
                                            <div className="toastInner d-flex">
                                                <div className="toastIcon d-flex align-items-center justify-content-center">
                                                    <i className={`${toastIcon}`}/>
                                                </div>
                                                <div className="toastContent d-flex flex-column justify-content-center">
                                                    <ButtonClose type="div" size="small" onClick={() => this.deleteToast(toast.id)} />
                                                    <span className="toastTitle">{toast.Title}</span>
                                                    <span className="toastDesc">{toast.Description}</span>
                                                </div>
                                            </div>  
                                        </div>
                                    }
                                   
                                </div>
                                
                            )
                        })
                    }
                </div>
            </>
        )
    }
}
