import React from 'react';
import JSONPretty from 'react-json-pretty';
import QRCode from "react-qr-code";

import {getNotifications, deleteNotifications, deleteNotification} from "../../../manager/manager";

// Components
import NoContent from "../../atoms/NoContent";
import HeaderPage from '../../organisms/HeaderPage';

// Central style sheet for templates
import '../_settings/style.scss';
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
                                            this.state.list.length > 0 ? this.state.list.map(l => {
                                                return (
                                                    <div className="notificationMolecule">
                                                        <Button onClick={() => this.onDeleteNotification(l.Id)}>
                                                            Delete notification
                                                        </Button>
                                                        <div ref={l.Id}><JSONPretty id="json-pretty" data={l}></JSONPretty></div>
                                                        { l.Action !== undefined && l.Action === "qr-code" ? <QRCode size={128} value={l.Description} /> : null }
                                                    </div>)
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