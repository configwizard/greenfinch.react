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

const shareContainerWithContact = async(containerId, publicKey) => {
    try {
        await window.go.manager.Manager.RestrictContainer(containerId, publicKey)
    } catch(e) {
        console.log("error retrieving contact", e)
    }
}

const createContact = async (firstName, lastName, walletAddress, publicKey) => {
    try {
        console.log(firstName, lastName, walletAddress)
        await window.go.manager.Manager.AddContact(firstName, lastName, walletAddress, publicKey)
    }catch (e) {
        console.log("error listing containers", e)
        return []
    }
}
const deleteContact = async (walletAddress) => {
    try {
        console.log('deleting', walletAddress)
        await window.go.manager.Manager.DeleteContact(walletAddress)
    }catch (e) {
        console.log("error listing containers", e)
        return []
    }
}
export {
    listContacts,
    createContact,
    deleteContact,
    shareContainerWithContact
}
