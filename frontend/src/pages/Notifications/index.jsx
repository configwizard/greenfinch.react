import React from 'react';
import HeaderPage from "../../components/organisms/HeaderPage";
import NoContent from "../../components/atoms/NoContent";
import {getNotifications, deleteNotifications} from "../../manager/manager";
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

    async onClearNotifications() {
        try {
            await deleteNotifications()
        } catch(e) {
            console.log("error deleting notifications ", e)
        }
    }
    async componentDidMount () {
        console.log("mounting notifications")
        try {
            const currentNotifications = await getNotifications()
            await this.setState({list: currentNotifications})
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
                                            this.state.list.map(l => {
                                                return <div ref={l.ID}>{JSON.stringify(l)}</div>
                                            })
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
