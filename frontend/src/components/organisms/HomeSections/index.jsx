import React from 'react';
import PropTypes from 'prop-types';

// Components
import HomeLink from '../../atoms/HomeLink';
import HeadingGeneral from '../../atoms/HeadingGeneral';

import { NavLink } from 'react-router-dom'; 

import './style.scss';
import {openInDefaultBrowser} from "../../../manager/manager";

const SectionSupport = ({ titleLevel, sectionTitle }) => {
    return (
        <>
            <HeadingGeneral
                level={titleLevel}
                isUppercase={false}
                text={sectionTitle} />
            <div className="section-homepage">
                <ul>
                    <li className="home-link">
                        <HomeLink
                            className="d-block"
                            text={"Greenfinch Overview"}
                            faClass={"fab fa-youtube"}
                            onClick={() => openInDefaultBrowser("https://www.youtube.com/watch?v=W8uYDd-eXGc&t=2s")}>
                        </HomeLink>
                    </li>
                    <li className="home-link">
                        <HomeLink
                            className="d-block"
                            text={"Using wallets"}
                            faClass={"fab fa-youtube"}
                            onClick={() => openInDefaultBrowser("https://www.youtube.com/watch?v=W8uYDd-eXGc&t=14s")}>
                        </HomeLink>
                    </li>
                    <li className="home-link">
                        <HomeLink
                            className="d-block"
                            text={"Containers and object"}
                            faClass={"fab fa-youtube"}
                            onClick={() => openInDefaultBrowser("https://www.youtube.com/watch?v=W8uYDd-eXGc&t=95s")}>
                        </HomeLink>
                    </li>
                    <li className="home-link">
                        <HomeLink
                            className="d-block"
                            text={"Managing contacts"}
                            faClass={"fab fa-youtube"}
                            onClick={() => openInDefaultBrowser("https://www.youtube.com/watch?v=W8uYDd-eXGc&t=160s")}>
                        </HomeLink>
                    </li>
                    <li className="home-link">
                        <HomeLink
                            className="d-block"
                            text={"Sharing containers"}
                            faClass={"fab fa-youtube"}
                            onClick={() => openInDefaultBrowser("https://www.youtube.com/watch?v=W8uYDd-eXGc&t=269s")}>
                        </HomeLink>
                    </li>
                </ul>
            </div>
        </>
    );
}
export default SectionSupport;

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

export {
    SectionHomepage,
    SectionSupport
}

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
