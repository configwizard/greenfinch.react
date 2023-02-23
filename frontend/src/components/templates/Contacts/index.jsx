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

function TextClickAction() {
    console.log("Button clicked, add modal onClick here")
}

const TemplateContacts = ({contacts, createContact, deleteContact}) => {
    const { setModal, unSetModal } = useModal()
    return (
        <div className="templatePage d-flex flex-column flex-grow-1">
            <div className="row">
                <div className="col-12">
                    <HeaderPage 
                        pageTitle={"Greenfinch contacts"}
                        hasButton={true}
                        hasButtonIcon={true}
                        isButtonDisabled={false}
                        faClass={"fas fa-plus-circle"}
                        buttonText={"Add new contact"}
                        buttonAction={() => {
                            setModal(
                            <CompModalStandard
                                title={"Add new contact"}
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
                                        <Form.Group id={"warningarea"} style={{display: "none"}}>
                                            <span id="errormessage" style={{color: "red"}}></span>
                                        </Form.Group>
                            </CompModalStandard>)
                        }}/>
                    <div className="row">
                        <div className="col-12">
                            <div className="templateWrapper">
                                <div className="templateInner">
                                    {contacts.length > 0 ? <AddressBook contacts={contacts} deleteContact={deleteContact}/>
                                        : <NoContent
                                            text={"You currently have no contacts."}
                                            textAction={"Add your first contact."}
                                            textClick={TextClickAction} />
                                    }
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
