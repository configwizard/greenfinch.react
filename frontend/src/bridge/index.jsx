// // import Faker from "faker";
// const runtime = require('@wailsapp/runtime');
// runtime.Events.On("", function(p1: any){})
//
// export const makeFreshToast = async (title, typ, message) => {
//     runtime.Events.On("", function(p1: any){})
//     // console.log("making fresh toast")
//     let toastStore = runtime.Store.New('toasts');
//     await toastStore.set(    {
//         id:  Math.floor((Math.random() * 101) + 1),
//         title: title,
//         type: typ,
//         description: message,
//     });
// }
//
// //
// // export const listKeys = async (kId) => {
// //     console.log("key selected", kId)
// //     try {
// //         const results = await window.backend.GeneralManager.ListKeys(kId)
// //         console.log("success listKeys", results)
// //         return results
// //     } catch(e) {
// //         console.log("fail listKeys", e)
// //     }
// //     // const results = await window.backend.GeneralManager.ListKeys()
// //     //
// //     //     .then(async (result, error) => {
// //     //     console.log(result)
// //     //     if (error) {
// //     //         await this.setState({snackBarMessage: error, snackBarOpen: true})
// //     //     }
// //     //     await this.setState({listOfKeys: result})
// //     // });
// // }
// //
// // export const importKey = async (importKey) => {
// //     let toastStore = runtime.Store.New('toasts');
// //     if (importKey == "") {
// //         toastStore.set(    {
// //             id:  Math.floor((Math.random() * 101) + 1),
// //             title: 'Warning',
// //             type: "warning",
// //             description: 'No key provided to import',
// //         });
// //         return
// //     }
// //     try {
// //         const key = await window.backend.GeneralManager.ImportKey(importKey)
// //         console.log("success import key ", key)
// //     } catch(e) {
// //         console.log("fail import key", e)
// //     }
// //     // window.backend.GeneralManager.ImportKey(key).then(async (key, error) => {
// //     //     if (error) {
// //     //         console.log('import got error ',error)
// //     //         await this.setState({snackBarMessage: error, snackBarOpen: true})
// //     //     } else {
// //     //         await this.setState({snackBarMessage: "key imported", snackBarOpen: true})
// //     //     }
// //     //     this.listKeys()
// //     // }).catch(async e => {
// //     //     await this.setState({snackBarMessage: e, snackBarOpen: true})
// //     // });
// // }
// //
// // export const getPublicKey = async (k) => {
// //     try {
// //         console.log("looking for key, ", k)
// //         const obj = await window.backend.GeneralManager.RetrievePublicKey(k)
// //         console.log("succes public key", obj.PublicKey)
// //         return obj.PublicKey
// //     } catch(e) {
// //         console.log("fail getPublicKey", e)
// //     }
// //     // await window.backend.GeneralManager.RetrievePublicKey(k).then(async (obj, error) => {
// //     //     console.log("obj", obj)
// //     //     if (error) {
// //     //         await this.setState({snackBarMessage: error, snackBarOpen: true})
// //     //         return
// //     //     }
// //     //
// //     //     await this.setState({snackBarMessage: "Public Key Copied" + this.state.selectedKeyForDeletion, snackBarOpen: true, keyToImport: obj.PublicKey})
// //     // });
// // }
// //
// // export const deleteKey = async(choice) => {
// //     try {
// //         console.log("deleting", choice)
// //         const response = await window.backend.GeneralManager.DeleteKeyPair(choice)
// //         listKeys(0)
// //         return response
// //     } catch(e) {
// //         console.log("fail deleteKey ", e)
// //     }
// //     // if (choice && this.state.selectedKeyForDeletion != null) {
// //     //     //async the keyname
// //     //     await window.backend.GeneralManager.DeleteKeyPair(this.state.selectedKeyForDeletion).then(async (error) => {
// //     //         console.log(error)
// //     //         if (error) {
// //     //             await this.setState({snackBarMessage: error, snackBarOpen: true})
// //     //             return
// //     //         }
// //     //         await this.setState({snackBarMessage: "key deleted " + this.state.selectedKeyForDeletion, snackBarOpen: true})
// //     //         this.listKeys()
// //     //     });
// //     // }
// //     // await this.setState({confirmDeleteOpen:false, selectedKeyForDeletion: null})
// // }
// //
// // export const copyProcessedMessage = async(processedMessage) => {
// //     try {
// //         const key = await window.backend.GeneralManager.CopyMessageToClipboard(processedMessage)
// //         return key
// //     } catch(e) {
// //         console.log("fail to copy key", e)
// //     }
// // }
// // export const copyPublicKey = async (uid) => {
// //     try {
// //     const key = await window.backend.GeneralManager.CopyKeyToClipboard(uid)
// //     return key
// //     } catch(e) {
// //         console.log("fail to copy key", e)
// //     }
// // }
// // export const decryptMessage = async (uid, msg) => {
// //     let toastStore = runtime.Store.New('toasts');
// //     if (msg == "") {
// //         await toastStore.set(    {
// //             id:  Math.floor((Math.random() * 101) + 1),
// //             title: 'Error',
// //             type: "error",
// //             description: 'No message to decrypt.',
// //         });
// //         return
// //     }
// //     if (uid == "") {
// //         // await this.setState({snackBarMessage: "no key to encrypt with", snackBarOpen: true})
// //         await toastStore.set(    {
// //             id:  Math.floor((Math.random() * 101) + 1),
// //             title: 'Error',
// //             type: "error",
// //             description: 'No key has been selected. Who do you want to decrypt the message for?',
// //         });
// //         return
// //     }
// //     try {
// //         const decrypted = await window.backend.GeneralManager.DecryptMessage(uid, msg)
// //         console.log(decrypted)
// //         return decrypted
// //     } catch(e) {
// //         console.log("fail decryptMessage", e)
// //     }
// //     // let uid = this.state.keyToEncryptWithUID
// //     // let msg = this.state.messageToDecrypt
// //     // if (msg == "") {
// //     //     await this.setState({snackBarMessage: "no messsage to decrypt", snackBarOpen: true})
// //     //     // alert("no key to import")
// //     //     return
// //     // }
// //     // await this.setState({messageToEncrypt: ""})
// //     // this.setState({snackBarMessage: "decrypting message for " + uid, snackBarOpen: true})
// //     // await window.backend.GeneralManager.DecryptMessage(uid, msg).then(async (decrypted, error) => {
// //     //     console.log(decrypted, error)
// //     //     if (error) {
// //     //         await this.setState({snackBarMessage: error, snackBarOpen: true})
// //     //     }
// //     //     await this.setState({messageToEncrypt: decrypted})
// //     //     console.log(this.state.messageToEncrypt, error)
// //     // });
// // }
// // export const generateKeys = async () => {
// //     let name = Faker.name.findName()
// //     let email = Faker.internet.email()
// //     try {
// //         const response = await window.backend.GeneralManager.GenerateKeys(name, email)
// //         console.log("success generateKeys", response)
// //         return response
// //     } catch(e) {
// //         console.log("fail generateKeys", e)
// //     }
// //     // window.backend.GeneralManager.GenerateKeys(name, email).then(async (publicKey, privateKey, error) => {
// //     //     console.log(publicKey, privateKey, error)
// //     //     if (error) {
// //     //         await this.setState({snackBarMessage: error, snackBarOpen: true})
// //     //         return
// //     //     }
// //     //     await this.setState({snackBarMessage: "key generated for " + name + " " + email, snackBarOpen: true})
// //     //     this.listKeys()
// //     // });
// // }
// //
// // export const makeFreshToast = async (title, typ, message) => {
// //     console.log("making fresh toast")
// //     let toastStore = runtime.Store.New('toasts');
// //     await toastStore.set(    {
// //         id:  Math.floor((Math.random() * 101) + 1),
// //         title: title,
// //         type: typ,
// //         description: message,
// //     });
// // }
// // export const encryptMessage = async (uid, msg) => {
// //     let toastStore = runtime.Store.New('toasts');
// //     // let uid = this.state.keyToEncryptWithUID
// //     // let msg = this.state.messageToEncrypt
// //     if (msg === "") {
// //         // await this.setState({snackBarMessage: "no message to encrypt", snackBarOpen: true})
// //         // return
// //         await toastStore.set(    {
// //             id:  Math.floor((Math.random() * 101) + 1),
// //             title: 'Error',
// //             type: "error",
// //             description: 'No message provided to encrypt.',
// //         });
// //         return
// //     }
// //     if (uid === "") {
// //         // await this.setState({snackBarMessage: "no key to encrypt with", snackBarOpen: true})
// //         await toastStore.set(    {
// //             id:  Math.floor((Math.random() * 101) + 1),
// //             title: 'Error',
// //             type: "error",
// //             description: 'No key has been selected. Who do you want to encrypt the message for?',
// //         });
// //         return
// //     }
// //     try {
// //         console.log("uid", uid, "msg", msg)
// //         const encrypted = await window.backend.GeneralManager.EncryptMessage(uid, msg)
// //         console.log(encrypted)
// //         return encrypted
// //     } catch(e) {
// //         console.log("fail encryptMessge", e)
// //     }
// //     // await this.setState({messageToDecrypt: ""})
// //     // this.setState({snackBarMessage: "encrypting message for " + uid, snackBarOpen: true})
// //     // await window.backend.GeneralManager.EncryptMessage(uid, msg).then(async (encrypted, error) => {
// //     //     console.log(encrypted, error)
// //     //     if (error) {
// //     //         await this.setState({snackBarMessage: error, snackBarOpen: true})
// //     //         return
// //     //     }
// //     //     await this.setState({messageToDecrypt: encrypted})
// //     // });
// // }
