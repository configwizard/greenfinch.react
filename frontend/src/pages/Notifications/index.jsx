import React from 'react';
import JSONPretty from 'react-json-pretty';
import QRCode from "react-qr-code";
import HeaderPage from "../../components/organisms/HeaderPage";
import NoContent from "../../components/atoms/NoContent";
import {getNotifications, deleteNotifications, deleteNotification} from "../../manager/manager";
import styled from "styled-components";
const runtime = require('@wailsapp/runtime');
const notificationsEventName = 'freshnotification';

const Button = styled.button`
  background-color: black;
  color: white;
  font-size: 20px;
  padding: 10px 60px;
  border-radius: 5px;
  margin: 10px 0px;
  cursor: pointer;
`;

export default class PageNotifications extends React.Component {
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
            await deleteNotifications()
            await this.retrieveList()
        } catch(e) {
            console.log("error deleting notifications ", e)
        }
    }
    async retrieveList () {
        const currentNotifications = await getNotifications()
        if (currentNotifications != null) {
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
            await this.setState({list: [message,...this.state.list]})
        })
    }
    render() {
        console.log("this.state.list ", this.state.list)
        return (
            <div className="templatePage d-flex flex-column flex-grow-1">
                <div className="row">
                    <div className="col-12">
                        <HeaderPage
                            pageTitle={"Notification Management"}
                            hasButton={false}
                            hasIcon={true}
                            faClass={"fas fa-plus-circle"}/>

                        <div className="row">
                            <div className="col-12">
                                <div className="templateWrapper">
                                    <Button onClick={this.onClearNotifications}>
                                        Clear notifications
                                    </Button>
                                    <div className="templateContainer">
                                        {
                                            this.state.list.length > 0 ? this.state.list.map(l => {
                                                return (
                                                    <div>
                                                        <Button onClick={() => this.onDeleteNotification(l.Id)}>
                                                            Delete notification
                                                        </Button>
                                                        <div ref={l.Id}><JSONPretty id="json-pretty" data={l}></JSONPretty></div>
                                                        { l.Action != undefined && l.Action == "qr-code" ? <QRCode size={128} value={l.Description} /> : null }
                                                    </div>)
                                            }) : <NoContent text={"No notifications"}/>
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