import React from 'react';
import JSONPretty from 'react-json-pretty';
import QRCode from "react-qr-code";
import Moment from "react-moment";

import {getNotifications, deleteNotifications, deleteNotification} from "../../../manager/manager";

// Components
import ButtonText from "../../atoms/ButtonText";
import NoContent from "../../atoms/NoContent";
import HeaderPage from '../../organisms/HeaderPage';

// Central style sheet for templates
import '../_settings/style.scss';

// To separate out to molecule -> notification
import '../../molecules/Notification/style.scss';

const runtime = require('@wailsapp/runtime');
const notificationsEventName = 'freshnotification';

export default class TemplateNotifications extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            list: []
        }
    }
    async onDeleteNotification(id) {
        try {
            console.log("id ", id)
            await deleteNotification(id)
            await this.retrieveList()
        } catch(e) {
            console.log("error deleting notifications ", e)
        }
    }
    async onClearNotifications() {
        try {
            const blank = await deleteNotifications()
            await this.setState({list: blank})
        } catch(e) {
            console.log("error deleting notifications ", e)
        }
    }
    async retrieveList () {
        const currentNotifications = await getNotifications()
        if (currentNotifications != null) {
            currentNotifications.sort((a,b) => {
                console.log("comparing ", a, " to ", b)
                return parseInt(b.CreatedAt) - parseInt(a.CreatedAt);
            })
            await this.setState({list: currentNotifications})
        } else {
            await this.setState({list: []})
        }
    }
    async componentDidMount () {
        console.log("mounting notifications")
        try {
            await this.retrieveList()
        } catch(e) {
            console.log("could not receive current notifications ", e)
        }

        //here we need to read in all notifications from the database
        window.runtime.EventsOn(notificationsEventName, async (message) => {
            console.log("message", message)
            const notificationList = [message,...this.state.list]
            notificationList.sort((a,b) => {
                console.log("comparing ", a, " to ", b)
                return parseInt(b.CreatedAt) - parseInt(a.CreatedAt);
            })
            await this.setState({list: notificationList})           
        })
    }
    render() {
        console.log("this.state.list ", this.state.list)

        return (
            <div className="templatePage d-flex flex-column flex-grow-1">
                <div className="row">
                    <div className="col-12">
                        <HeaderPage 
                            pageTitle={"Notifications"}
                            hasButton={false}
                            // hasButtonIcon={true}
                            // isButtonDisabled={this.state.list.length === 0 ? true : false}
                            // faClass={"fa-sharp fa-solid fa-broom-wide"}
                            // buttonText={"Clear notifications"}
                            // buttonAction={this.onClearNotifications} 
                        /> 
                        <div className="row justify-content-center">
                            <div className="col-6">
                                <div className="templateWrapper">
                                    <div className="templateInner">
                                        {
                                            this.state.list.length > 0 ? this.state.list.map((notification, i) => {
                                                console.log(notification)
                                                return (
                                                        <div className="molNotification">
                                                            <div className={`notificationWrapper ${notification.Type}`}>
                                                                <div className="notificationInner d-flex">
                                                                    <div className="notificationIcon d-flex align-items-start jusify-content-center">
                                                                        <span class="fa-stack fa-lg">
                                                                            <i className="fa-sharp fa-solid fa-circle fa-stack-2x"/>
                                                                            <i className="fa-sharp fa-solid fa-stack-1x fa-megaphone"/>
                                                                        </span>
                                                                    </div>
                                                                    <div className="notificationContent d-flex flex-column">
                                                                        <span className="notificationTitle">{notification.Title}</span>
                                                                        <span className="notificationDesc">{notification.Description}</span>
                                                                        <span className="notificationDesc"><Moment unix format="DD MMM YY">{notification.CreatedAt}</Moment></span>
                                                                        { notification.Action !== undefined && notification.Action === "qr-code" ? <QRCode size={128} value={notification.Description} /> : null }
                                                                        <div className="d-flex align-items-center">
                                                                            <div className="ms-auto">
                                                                                <ButtonText 
                                                                                    type="default"
                                                                                    size="small"
                                                                                    hasIcon={true}
                                                                                    faClass={"fa-sharp fa-solid fa-trash-can"}
                                                                                    text={"Delete notification"}
                                                                                    isDisabled={false}
                                                                                    onClick={() => this.onDeleteNotification(notification.Id)}/>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                   
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                            }) : <NoContent 
                                                    text={"You currently have no notifications to view."}
                                                    addAction={false} />
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        )
    }
};