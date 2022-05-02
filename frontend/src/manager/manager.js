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

const retrieveRecentWallets = async() => {
    try {
        let wallets = await window.go.manager.Manager.RecentWallets()
        console.log("recent wallets", wallets)
        return wallets
    } catch(e) {
        console.log("error loading wallet", e)
    }
}
export {
    retrieveRecentWallets,
    getAccountInformation,
    topUpNeoFS,
    newWallet,
    loadWallet
}
