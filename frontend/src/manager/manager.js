const getAccountInformation = async () => {
    try {
    let b = await window.go.manager.Manager.GetAccountInformation().then((balance, error) => {
        console.log(balance, error)
        return balance
    })
    return b
    } catch(e) {
        console.log("error topping up", e)
    }
}

const transferGasToContact = async (contactAddress, amount) => {
    console.log("transferring with ", amount)
    try {
        let floatAmount = parseFloat(amount)
        floatAmount = floatAmount * Math.pow(10, 8)
        let t = await window.go.manager.Manager.TransferToken(contactAddress, floatAmount)
        console.log("t", t)
    } catch(e) {
        console.log("error transferring", e)
    }
}
const topUpNeoFS = async (amount) => {
    console.log("topping up with ", amount)
    try {
        const floatAmount = parseFloat(amount)
        let t = await window.go.manager.Manager.TopUpNeoWallet(floatAmount)
        console.log("t", t)
    } catch(e) {
        console.log("error topping up", e)
    }
}

const newWallet = async (password) => {
    try {
        let t = await window.go.manager.Manager.NewWallet(password)
        // return t
    } catch(e) {
        console.log("error creating new wallet", e)
    }
}

const loadWallet = async (password) => {
    try {
        let t = await window.go.manager.Manager.LoadWallet(password)
        // return t
    } catch(e) {
        console.log("error loading wallet", e)
    }
}
const loadWalletWithPath = async (password, path) => {
    try {
        let t = await window.go.manager.Manager.LoadWalletWithPath(password, path)
        // return t
    } catch(e) {
        console.log("error loading wallet", e)
    }
}


const retrieveRecentWallets = async() => {
    try {
        let wallets = await window.go.manager.Manager.RecentWallets()
        console.log("recent wallets", wallets)
        return wallets
    } catch(e) {
        console.log("error loading wallet", e)
    }
}

const openInDefaultBrowser = async(txt) => {
    try {
        await window.go.manager.Manager.OpenInDefaultBrowser(txt)
    } catch(e) {
        console.log("error loading wallet", e)
    }
}
const copyTextToClipboard = async(txt) => {
    try {
        await window.go.manager.Manager.CopyToClipboard(txt)
    } catch(e) {
        console.log("error loading wallet", e)
    }
}

const getVersion = async() => {
    try {
        const v = await window.go.manager.Manager.GetVersion()
        return v
    } catch(e) {
        console.log("could not get version", e)
    }
}
export {
    transferGasToContact,
    copyTextToClipboard,
    openInDefaultBrowser,
    retrieveRecentWallets,
    getAccountInformation,
    topUpNeoFS,
    newWallet,
    loadWallet,
    loadWalletWithPath,
    getVersion
}
