import React from 'react';

import {listContacts, createContact} from "../../manager/contacts"
// Components
import TemplateContacts from '../../components/templates/Contacts';
import {deleteContact} from "../../manager/contacts"
class PageContacts extends React.Component {
    constructor(props) {
        super(props);
        this.state = {contacts: []}
    }
    async componentDidMount() {
        window.runtime.EventsOn("networkchanged", async (message) => {
            console.log("refreshing contacts")
            await this.refreshContacts()
        })
        await this.refreshContacts()
    }
    async refreshContacts() {
        const contacts = await listContacts()
        console.log("mounted and received", contacts)
        this.setState({contacts})
    }
    createContact = async (firstName, lastName, walletAddress, publicKey) => {
        console.log("createContract - ", firstName, walletAddress)
        const contacts = await createContact(firstName, lastName, walletAddress, publicKey)
        console.log("received back after creating", contacts)
        await this.setState({contacts})
    }
    deleteContact = async(walletAddress) => {
        console.log("deleteContact - ", walletAddress)
        const contacts = await deleteContact(walletAddress)
        console.log("received back after deleting", contacts)
        await this.setState({contacts})
    }

    render() {
        console.log("rendering contacts with ", this.state.contacts)
        return (
            <>
                {/* Loader */}
                <TemplateContacts contacts={this.state.contacts} createContact={this.createContact} deleteContact={this.deleteContact}/>
            </>
        )
    }
}

export default PageContacts;
