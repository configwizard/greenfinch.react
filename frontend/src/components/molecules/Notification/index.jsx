import React from 'react';

// Components
import ButtonClose from '../../atoms/ButtonClose';
import ButtonText from '../../atoms/ButtonText';

import './style.scss';

const runtime = require('@wailsapp/runtime');
const name = 'freshnotification';

const iconSelector = (type) => {
    console.log("Notification type selected ", type)
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

export default class ItemNotification extends React.Component {
    render() {
        return (
            <>
                <div className="notificationColumn d-flex flex-column">
                    {
                        this.state.list.map((notifcation, i) => {
                            const notificationIcon = iconSelector(notification.Type)
                            console.log("Notification type: ", notification.type)
                            return (
                                <div key={i} className="molNotification">
                                    <div className={`notificationWrapper ${notification.Type}`}>
                                        <div className="notificationInner d-flex">
                                            <div className="notificationIcon d-flex align-items-center justify-content-center">
                                                <i className={`${notificationIcon}`}/>
                                            </div>
                                            <div className="notificationContent d-flex flex-column">
                                                <ButtonClose type="div" size="small" onClick={() => this.deleteToast(notification.id)} />

                                                <span className="notificationTitle">{notification.Title}</span>
                                                <span className="notificationDesc">{notification.Description}</span>

                                                <div className="notificationFooter d-flex">
                                                    <div className="ms-auto">
                                                        <ButtonText 
                                                            type="default"
                                                            size="small"
                                                            hasIcon={false}
                                                            text={"Delete"}
                                                            isDisabled={false}
                                                            onClick={() => this.deleteNotification(notification.id)}/>
                                                    </div>
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