const getAccountInformation = async () => {
    let b = await window.go.manager.Manager.GetAccountInformation().then((balance, error) => {
        console.log(balance, error)
        return balance
    })
    return b
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
    } catch(e) {
        console.log("error creating new wallet", e)
    }
}

const loadWallet = async (password) => {
    try {
        let t = await window.go.manager.Manager.LoadWallet(password)
    } catch(e) {
        console.log("error loading wallet", e)
    }
}

export {
    getAccountInformation,
    topUpNeoFS,
    newWallet,
    loadWallet
}
