import React from 'react';
import PropTypes from 'prop-types';

// Components
import ButtonText from '../../atoms/ButtonText';
import HeadingGeneral from '../../atoms/HeadingGeneral';

import { NavLink } from 'react-router-dom'; 

import './style.scss';

const SectionHomepage = ({ titleLevel, sectionTitle }) => {
    return (
        <>
        <HeadingGeneral
            level={titleLevel}
            isUppercase={false}
            text={sectionTitle} />
            <div className="section-homepage">
                <ul>
                    <li className="navlink-homepage">
                        <NavLink
                            className="d-block"
                            to="/containers"
                            label="Containers">
                            <i className="fas fa-copy"/>View containers...
                    </NavLink>
                    </li>
                    <li className="navlink-homepage">
                        <NavLink
                            className="d-block"
                            to="/contacts"
                            label="Contacts">
                            <i className="fas fa-address-book"/>View contacts...
                        </NavLink>
                    </li>
                </ul>
            </div>
        </>
    );
}

export default SectionHomepage;

SectionHomepage.propTypes = {
    level: PropTypes.string,
    isUppercase: PropTypes.bool,
    text: PropTypes.string
};

SectionHomepage.defaultProps = {
    titleLevel: "h3",
    isUppercase: false,
    sectionTitle: "Section heading"
};  