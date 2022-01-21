const getNeoFSBalance = async () => {
    let b = await window.go.manager.Manager.GetNeoFSBalance().then((balance, error) => {
        console.log(balance, error)
        return balance
    })
    return b
}

export {
    getNeoFSBalance
}
