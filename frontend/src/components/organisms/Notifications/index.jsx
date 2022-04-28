import React from 'react';

// Components
import CardNotification from '../../atoms/CardNotification';

import './style.scss';

const Notifications = () => {
    return (
        <div className="org-notifications d-flex flex-column">
            <div>
                <ul className="d-flex flex-column">
                    <CardNotification
                        faClass={"fal fa-home"}
                        label={"Home"} />
                </ul>
            </div>
        </div>
    );
}

export default Notifications;