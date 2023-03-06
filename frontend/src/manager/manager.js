const enableLocalServer = async (enable) => {
    try {
        await window.go.manager.Manager.EnableLocalServer(enable)
    } catch (e) {
        console.log("error setting server state", e)
    }
}
const enableCache = async (enable) => {
    try {
        let networkSettings = await window.go.manager.Manager.EnableCache(enable)
    } catch (e) {
        console.log("error setting cache state", e)
    }
}
const setNetwork = async (network) => {
    try {
        console.log("setting network to ", network)
        let networkSettings = await window.go.manager.Manager.SetSelectedNetwork(network)
        console.log("selected network ", networkSettings)
    } catch (e) {
        console.log("error setting network", e)
    }
}
const getNotifications = async()=> {
    try {
        let n = await window.go.manager.Manager.Notifications()
        console.log("received notifications ", n)
        return n
    } catch(e) {
        console.log("error retrieving notifications from database ", e)
    }
}
const deleteNotification = async(id) => {
    try {
        console.log("deleting id ", id)
        await window.go.manager.Manager.MarkNotificationRead(id)
    } catch(e) {
        console.log("could not clear notifications ", e)
    }
}
const deleteNotifications = async() => {
    try {
        await window.go.manager.Manager.MarkAllNotificationsRead()
        return []
    } catch(e) {
        console.log("could not clear notifications ", e)
    }
}
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
    setNetwork,
    enableCache,
    enableLocalServer,
    getNotifications,
    deleteNotifications,
    deleteNotification,
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
