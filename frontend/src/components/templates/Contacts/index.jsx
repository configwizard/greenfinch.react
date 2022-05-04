import React from 'react';
import { Form } from 'react-bootstrap';

// Components
import AddressBook from '../../organisms/AddressBook';
import HeaderPage from '../../organisms/HeaderPage';
import { useModal } from '../../organisms/Modal/ModalContext';
import CompModalStandard from '../../organisms/Modal/ModalStandard';

// Central style sheet for templates
import '../_settings/style.scss';

const TemplateContacts = ({contacts, createContact }) => {
    const { setModal, unSetModal } = useModal()
    return (
        <div class="templatePage d-flex flex-column flex-grow-1">
            <div class="row">
                <div className="col-12">
                    <HeaderPage 
                        pageTitle={"Greenfinch contacts"}
                        hasButton={true}
                        hasIcon={true}
                        faClass={"fas fa-plus-circle"}
                        buttonText={"Add new contact"}
                        buttonAction={
                            () => {
                            setModal(
                            <CompModalStandard
                                title={"Add new contact"}
                                buttonTextPrimary={"Add"}
                                buttonTextSecondary={"Cancel"}
                                primaryClicked={async () => {await createContact(document.getElementById("contactFirstName").value,
                                    document.getElementById("contactLastName").value,
                                    document.getElementById("contactAddress").value,
                                    document.getElementById("contactPublicKey").value); unSetModal()}}
                                secondaryClicked={async () => unSetModal()}>
                                    <Form.Group className="form-div">
                                        <Form.Label>First name of contact</Form.Label>
                                        <Form.Control id="contactFirstName" type="text" />
                                    </Form.Group>
                                    <Form.Group className="form-div">
                                        <Form.Label>Last name of contact</Form.Label>
                                        <Form.Control id="contactLastName" type="text" />
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label>Wallet address</Form.Label>
                                        <Form.Control id="contactAddress" type="text" />
                                        <Form.Text muted>N.B. Neo N3 wallet addresses start with 'N'</Form.Text>
                                    </Form.Group>
                                <Form.Group>
                                    <Form.Label>Public Key</Form.Label>
                                    <Form.Control id="contactPublicKey" type="text" />
                                    <Form.Text muted>N.B. A contact's public key is required to share containers</Form.Text>
                                </Form.Group>
                            </CompModalStandard>)
                        }}/>
                   
                    <div class="row">
                        <div class="col-12">
                            <div className="templateWrapper">
                                <div className="templateContainer">
                                    <AddressBook contacts={contacts}/>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default TemplateContacts;
