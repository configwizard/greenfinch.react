import React from 'react';
//import JSONPretty from 'react-json-pretty';
import QRCode from 'react-qr-code';
import Moment from 'react-moment';

import {getNotifications, deleteNotifications, deleteNotification, openInDefaultBrowser} from '../../../manager/manager';

// Components
import ButtonText from '../../atoms/ButtonText';
import NoContent from '../../atoms/NoContent';
import ButtonQRCode from '../../molecules/ButtonsContent/ButtonQRCode';
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
                            <div className="col-9 col-xl-6">
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
                                                                        <div className="d-flex align-items-center">
                                                                            <div>
                                                                                <span className="notificationTitle">{notification.Title}</span>
                                                                            </div>
                                                                            <div className="ms-auto">
                                                                                <span className="notificationTime"><Moment unix format="DD-MM-YY HH:mm">{notification.CreatedAt}</Moment></span>
                                                                            </div>
                                                                        </div>
                                                                        <span className="notificationDesc">{notification.Description}</span>
                                   

                                                                        { (notification.Meta !== null && notification.Meta["url"]) || (notification.Action !== undefined && notification.Action === "qr-code") ?
                                                                        <div className="buttonStackHorizontal d-flex">  
                                                                            <div className="ms-auto">
                                                                                { notification.Action !== undefined && notification.Action === "qr-code" && notification.Meta !== null ? 
                                                                                    <ButtonQRCode
                                                                                        qrcode={<QRCode size={180} value={notification.Meta["url"] + "/" + notification.Meta["txid"]} />}/>
                                                                                    : null }
                                                                                { notification.Meta !== null && notification.Meta["url"] ?
                                                                                    <ButtonText
                                                                                    // if includes a dora link in description
                                                                                        hasIcon={true}
                                                                                        type="dora"
                                                                                        size="small"
                                                                                        isDisabled={false}
                                                                                        faClass="fak fa-doracoz"
                                                                                        onClick={() => {openInDefaultBrowser(notification.Meta["url"] + "/" + notification.Meta["txid"])}}
                                                                                        text="View on Dora"/>
                                                                                    : null }
                                                                            </div>
                                                                        </div>
                                                                        : null }
                                                                        <div className="buttonStackHorizontal d-flex">
                                                                            <div className="ms-auto">
                                                                                <ButtonText 
                                                                                    type="secondary"
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