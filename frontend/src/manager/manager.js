const getAccountInformation = async () => {
    let b = await window.go.manager.Manager.GetAccountInformation().then((balance, error) => {
        console.log(balance, error)
        return balance
    })
    return b
}

export {
    getAccountInformation
}
