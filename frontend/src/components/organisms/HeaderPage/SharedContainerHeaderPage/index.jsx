import React from 'react';
import PropTypes from 'prop-types';

import { Form } from 'react-bootstrap';

import { createContainer } from '../../../../manager/containers.js';


// Components
import HeadingGeneral from '../../../atoms/HeadingGeneral';
import ButtonText from '../../../atoms/ButtonText';

import { useModal } from '../../../organisms/Modal/ModalContext';
import CompModalStandard from '../../../organisms/Modal/ModalStandard';

import '../style.scss';
import {addSharedContainer} from "../../../../manager/sharedContainers";

const SharedContainerHeaderPage = ({ pageTitle, hasButton, hasButtonIcon, isButtonDisabled, faClass, buttonText, buttonAction }) => {
    const { setModal, unSetModal } = useModal();
    return (
        <div className="HeaderPageWrapper">
            <div className="HeaderPage d-flex align-items-center">
                <div>
                    <HeadingGeneral
                        level={"h1"}
                        isUppercase={false}
                        text={pageTitle}
                    />
                </div>
                <div className="ms-auto">
                    { hasButton ?
                        <ButtonText
                            size={"small"}
                            type={"default"}
                            hasIcon={hasButtonIcon}
                            isDisabled={isButtonDisabled}
                            faClass={faClass}
                            text={buttonText}
                            onClick={() => {
                                setModal(
                                    <CompModalStandard
                                        title={"Add shared container"}
                                        hasSecondaryButton={true}
                                        buttonTextPrimary={"Add"}
                                        buttonTextSecondary={"Cancel"}
                                        primaryClicked={async () => {
                                                const containerID = document.getElementById("sharedContainerID").value
                                                console.log("adding container ", containerID)
                                                await addSharedContainer(containerID)
                                            }}
                                        secondaryClicked={async () => unSetModal()}>
                                        <Form.Group className="form-div">
                                            <Form.Label>To add a shared container, enter the &lsquo;Container ID&rsquo;:</Form.Label>
                                            <Form.Control 
                                                id="sharedContainerID" 
                                                type="text"
                                                placeholder="Container ID"/>
                                        </Form.Group>
                                    </CompModalStandard>)
                            }} />
                        : null }
                </div>
            </div>
        </div>
    );
}

export default SharedContainerHeaderPage;

HeadingGeneral.propTypes = {
    pageTitle: PropTypes.string,
};

HeadingGeneral.defaultProps = {
    pageTitle: "Lorem Ipsum"
};

ButtonText.propTypes = {
    hasButton: PropTypes.bool,
    hasIcon: PropTypes.bool,
    isDisabled: PropTypes.bool,
    iconClass: PropTypes.string
};

ButtonText.defaultProps = {
    hasButton: true,
    hasIcon: true,
    isDisabled: false
}
