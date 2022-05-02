const listContacts = async () => {
    try {
        const contacts = await window.go.manager.Manager.RetrieveContacts()
        console.log("received contacts ", contacts)
        return contacts || []
    }catch (e) {
        console.log("error listing contacts", e)
        return []
    }
}

const createContact = async (firstName, lastName, walletAddress) => {
    try {
        console.log(firstName, lastName, walletAddress)
        await window.go.manager.Manager.AddContact(firstName, lastName, walletAddress)
    }catch (e) {
        console.log("error listing containers", e)
        return []
    }
}
export {
    listContacts,
    createContact
}
