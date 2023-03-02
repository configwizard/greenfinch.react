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

const ContainerHeaderPage = ({ pageTitle, hasButton, hasIcon, faClass, buttonText, isButtonDisabled }) => {
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
                            hasIcon={hasIcon}
                            faClass={faClass}
                            isDisabled={isButtonDisabled}
                            text={buttonText}
                            onClick={() => {
                                setModal(
                                <CompModalStandard
                                    title={"Create new container"}
                                    buttonTextPrimary={"Create"}
                                    buttonTextSecondary={"Cancel"}
                                    primaryClicked={async () => {await createContainer(document.getElementById("containerName").value, document.getElementById("containerPermission").value); unSetModal()}}
                                    secondaryClicked={async () => unSetModal()}>
                                        <Form.Group className="form-div">
                                            <Form.Label>Container name</Form.Label>
                                            <Form.Control id="containerName" type="text" placeholder="e.g. Family Photos"/>
                                            <Form.Text muted>NB. This cannot be changed</Form.Text>
                                        </Form.Group>
                                        <Form.Group>
                                            <Form.Label>Container permissions</Form.Label>
                                            <Form.Select id="containerPermission" aria-label="select">
                                                <option>Select container permissions...</option>
                                                <option value="PUBLICREAD">Public Read Only</option>
                                                <option value="PUBLICBASIC">Public Read/Write</option>
                                                <option value="PRIVATE">Private</option>
                                            </Form.Select>
                                        </Form.Group>
                                </CompModalStandard>)
                            }} /> 
                        : null }
                </div>
            </div>
        </div>
    );
}

export default ContainerHeaderPage;

HeadingGeneral.propTypes = {
    pageTitle: PropTypes.string,
};

HeadingGeneral.defaultProps = {
    pageTitle: "Lorem Ipsum"
};

ButtonText.propTypes = {
    hasButton: PropTypes.bool,
    hasIcon: PropTypes.bool,
    iconClass: PropTypes.string,
};

ButtonText.defaultProps = {
    hasButton: true,
    hasIcon: true
}
