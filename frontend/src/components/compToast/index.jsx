import React from "react";

// const runtime = require('@wailsapp/runtime');

/*
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
    componentDidMount() {
        let toastStore = runtime.Store.New('toasts');
        toastStore.subscribe(async t => {
            t.startTime = Date.now()
            console.log("received toast from Go ", t)
            let list = this.state.list
            console.log("pre list", list)
            list.push(t)
            console.log("push list", list)
            await this.setState({list: list})
        });

        setInterval(() => {
            if (this.props.autoDelete && this.state.list.length) {
                if (((new Date) - this.state.list[0].startTime) > this.props.autoDeleteTime) {
                    this.deleteToast(this.state.list[0].id);
                }
            }
        }, this.props.autoDeleteTime)
    }
    deleteToast = id => {
        const index = this.state.list.findIndex(e => e.id === id);
        let list = this.state.list
        list.splice(index, 1); //how to set the state back to this
        console.log("spliced list ", list)
        // const toastListItem = toastList.findIndex(e => e.id === id);
        // toastList.splice(toastListItem, 1);
        // setList([...list]);
        this.setState({list: list})
    }
    render() {
        console.log("this.state.list", this.state.list)
        return (
            <>
                <div className="molToastContainer">
                    {
                        this.state.list.map((toast, i) => {
                            const fontAwesomeIcon = iconSelector(toast.type)
                            console.log("toastType ", toast.type)
                            return (
                                <div
                                    key={i}
                                    className={`molToastWrapper ${toast.type}`}>
                                    <div className="molToastInner d-flex">
                                        <div className="molToastIcon d-flex align-items-center justify-content-center">
                                            <i className={`fad ${fontAwesomeIcon}`}/>
                                        </div>
                                        <div className="molToastContent d-flex flex-column justify-content-center">
                                            <i className="fa fa-fw fa-times" onClick={() => this.deleteToast(toast.id)}/>
                                            <span className="atmToastTitle">{toast.title}</span>
                                            <span className="atmToastMessage">{toast.description}</span>
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
*/