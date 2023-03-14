import React from 'react';
import { Form } from 'react-bootstrap';

// Components
import NoContent from '../../atoms/NoContent';
import AddressBook from '../../organisms/AddressBook';
import HeaderPage from '../../organisms/HeaderPage';
import { useModal } from '../../organisms/Modal/ModalContext';
import CompModalStandard from '../../organisms/Modal/ModalStandard';

// Central style sheet for templates
import '../_settings/style.scss';

const createNewContact = async (setModal, createContact, unSetModal) => {
    setModal(
    <CompModalStandard
        title={"Add new contact"}
        hasSecondaryButton={true}
        buttonTextPrimary={"Add"}
        buttonTextSecondary={"Cancel"}
        primaryClicked={async () => {
            let walletInput = document.getElementById("contactAddress").value
            let publicInput = document.getElementById("contactPublicKey").value
            if (walletInput.length !== 34 || !walletInput.startsWith("N")) {
                document.getElementById("warningarea").style.display = "block";
                document.getElementById("errormessage").innerHTML = "Incorrect wallet address";
                return
            }
            if (publicInput.length !== 66) {
                document.getElementById("warningarea").style.display = "block";
                document.getElementById("errormessage").innerHTML = "Incorrect public key";
                return
            }
            await createContact(document.getElementById("contactFirstName").value,
            document.getElementById("contactLastName").value,
                walletInput,
                publicInput); unSetModal()}}
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
            <Form.Group id={"warningarea"} className="atmFormError" style={{display: "none"}}>
                <i class='fa-sharp fa-solid fa-circle-x'></i><span id="errormessage"></span>
            </Form.Group>
    </CompModalStandard>)
}

const TemplateContacts = ({account, contacts, createContact, deleteContact}) => {
    const { setModal, unSetModal } = useModal()
    return (
        <div className="templatePage d-flex flex-column flex-grow-1">
            <div className="row">
                <div className="col-12">
                    <HeaderPage 
                        pageTitle={"Greenfinch contacts"} 
                        hasButton={true}
                        hasButtonIcon={true}
                        isButtonDisabled={account.address ? false : true}
                        faClass={"fa-sharp fa-solid fa-circle-plus"}
                        buttonText={"Add new contact"}
                        buttonAction={() => {createNewContact(setModal, createContact, unSetModal)} }/>
                    <div className="row">
                        <div className="col-12">
                            <div className="templateWrapper">
                                    {contacts.length > 0 ? <AddressBook contacts={contacts} deleteContact={deleteContact}/>
                                        : <NoContent
                                            text={account.address ? "You currently have no contacts." : "You need a wallet loaded to add contacts."}
                                            addAction={account.address ? true : false}
                                            textAction={account.address ? "Add your first contact" : null}
                                            isPageLink={account.address ? false : true}
                                            textClick={() => {createNewContact(setModal, createContact, unSetModal)}}
                                            to={account.address ? null :"/"}
                                            label={account.address ? null : "Load a wallet to get started"}/>
                                    }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TemplateContacts;