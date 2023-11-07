const enableLocalServer = async (enable) => {
    try {
        await window.go.manager.Manager.EnableLocalServer(enable)
    } catch (e) {
        console.log("error setting server state", e)
    }
}
const enableCache = async (enable) => {
    try {
        await window.go.manager.Manager.EnableCache(enable)
    } catch (e) {
        console.log("error setting cache state", e)
    }
}
const forceSync = async() => {
    try {
        await window.go.manager.Manager.ForceSync()
    } catch (e) {
        console.log("failed to force sync", e)
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
        await window.go.manager.Manager.TransferToken(contactAddress, floatAmount)
    } catch(e) {
        console.log("error transferring", e)
    }
}
const topUpNeoFS = async (amount) => {
    console.log("topping up with ", amount)
    try {
        const floatAmount = parseFloat(amount)
        await window.go.manager.Manager.TopUpNeoWallet(floatAmount)
    } catch(e) {
        console.log("error topping up", e)
    }
}
const newWallet = async (password, walletPath) => {
    try {
        await window.go.manager.Manager.NewWallet(password, walletPath)
    } catch(e) {
        console.log("error creating new wallet", e)
        return e
    }
}
const loadWallet = async (password) => {
    try {
        await window.go.manager.Manager.LoadWallet(password)
    } catch(e) {
        console.log("error loading wallet", e)
    }
}
const deleteRecentWallet = async (walletId) => {
    try {
        await window.go.manager.Manager.DeleteRecentWallet(walletId)
    } catch(e) {
        console.log("error deleting recent wallet", e)
    }
}
const saveWalletWithoutPassword = async () => {
    try {
        let path = await window.go.manager.Manager.SaveWalletWithoutPassword()
        return path
    } catch(e) {
        console.log("error loading wallet", e)
    }
}
const loadWalletWithoutPassword = async () => {
    try {
        let path = await window.go.manager.Manager.LoadWalletWithoutPassword()
        return path
    } catch(e) {
        console.log("error loading wallet", e)
    }
}
const copyPrivateKey = async() => {
    try {
        await window.go.manager.Manager.RetrieveWIF()
    } catch (e) {
        console.log("error retrieving wif", e)
    }
}
const newWalletFromWIF = async (password, wif, path) => {
    try {
        await window.go.manager.Manager.NewWalletFromWIF(password, wif, path)
    } catch(e) {
        console.log("error creating wallet from WIF", e)
        return e
    }
}
const loadWalletWithPath = async (password, path) => {
    try {
        await window.go.manager.Manager.LoadWalletWithPath(password, path)
    } catch(e) {
        console.log("error loading wallet", e)
        return e
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

const cancelObjectContext = async() => {
    try {
        await window.go.manager.Manager.CancelObjectContext()
    } catch(e) {
        console.log("could not cancel context", e)
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
const makeRunningToast = async(title, type, message) => {
    try {
        let o = { 
            Title: title,
            Type: type,
            Description: message
        }
        await window.go.manager.Manager.MakeToast(o)
    } catch(e) {
        console.log("could not make running toast", e)
    }
}
const makeCopyToast = async(message) => {
    try {
        let o = { 
            Type: "copy",
            Description: message
        }
        await window.go.manager.Manager.MakeToast(o)
    } catch(e) {
        console.log("could not make copy toast", e)
    }
}

const setVariable = async(message, salt) => {
    try {
        await window.go.manager.Manager.SetVariable(message, salt)
    } catch(e) {
        console.log("could not make copy toast", e)
    }
}

export {
    setNetwork,
    enableCache,
    forceSync,
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
    deleteRecentWallet,
    newWalletFromWIF,
    copyPrivateKey,
    loadWallet,
    loadWalletWithPath,
    loadWalletWithoutPassword,
    saveWalletWithoutPassword,
    cancelObjectContext,
    getVersion,
    makeRunningToast,
    makeCopyToast,
    setVariable
}
