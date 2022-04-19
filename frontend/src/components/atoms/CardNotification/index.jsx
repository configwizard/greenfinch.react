import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';

const CardNotification = ({ label, faClass }) => {
    return (
        <li className="card-notification d-flex">
            <div>
                <i className="fa-solid fa-megaphone"/>
            </div>
            <div>
                 {/* 
                    Time (right aligned), 
                    Text heading (left aligned)
                    Text body (left aligned)
                    CTA? (how would we manufacture this?) 
                    
                    EXTRA
                    width 100% of available space, no set height */}
            </div>
        </li>
        )
    };
export default CardNotification;

CardNotification.propTypes = {
    label: PropTypes.string,
    faClass: PropTypes.string
};

CardNotification.defaultProps = {
    label: "Navbar Link",
    faClass: "fas fa-flag"
};
