// This is the minimum required to get Alex up and running.

import React from 'react';
import { Form } from 'react-bootstrap';

// Components
import AddressBook from '../../organisms/AddressBook';
import HeaderPage from '../../organisms/HeaderPage';

import { useModal } from '../../organisms/Modal/ModalContext';
import CompModalStandard from '../../organisms/Modal/ModalStandard';

import './style.scss';

// Old time
// function hello(a) {}

// Modern (use),
// const hello = (a, b) => {}

const createContact = async (contactName, contactAddress) => {
    console.log(contactName, contactAddress);
}

const TemplateContacts = () => {
    const { setModal, unSetModal } = useModal()
    return (
        <div className="templatePage d-flex flex-column flex-grow-1">
            <div className="row">
                <div className="col-12">
                    <HeaderPage 
                        pageTitle={"Greenfinch contacts"} 
                        buttonText={"Add contact"}
                        buttonAction={
                            () => {
                            setModal(
                            <CompModalStandard
                                title={"Add a new contact"}
                                buttonTextPrimary={"Add"}
                                buttonTextSecondary={"Cancel"}
                                primaryClicked={async () => {await createContact(document.getElementById("contactName").value, document.getElementById("contactAddress").value); unSetModal()}}
                                secondaryClicked={async () => unSetModal()}>
                                    <p>Give your contact a name, and a wallet address.</p>
                                    <Form.Control id="contactName" type="text" placeholder="e.g. Alex Walker" />
                                    <Form.Control id="contactAddress" type="text" placeholder="Starting with 'n'... " />
                            </CompModalStandard>)
                        }}
                        hasButton={true}/>
                    <AddressBook/>
                </div>
            </div>
        </div>
    );
}

export default TemplateContacts;