import React from 'react';

import {listContacts, createContact} from "../../manager/contacts"
// Components
import TemplateContacts from '../../components/templates/Contacts';

class PageContacts extends React.Component {
    constructor(props) {
        super(props);
        this.state = {contacts: []}
    }
    async componentDidMount() {
        const contacts = await listContacts()
        console.log("mounted and received", contacts)
        this.setState({contacts})
    }
    render() {
        console.log("rendering contacts with ", this.state.contacts)
        return (
            <>
                {/* Loader */}
                <TemplateContacts contacts={this.state.contacts} createContact={(firstName, lastName, walletAddress, publicKey) => createContact(firstName, lastName, walletAddress, publicKey)}/>
            </>
        )
    }
}

export default PageContacts;
