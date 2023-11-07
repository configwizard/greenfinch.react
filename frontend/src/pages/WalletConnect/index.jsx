import React, {useEffect, useState} from 'react';
import styled from "styled-components";
import QRCode from "react-qr-code";
import {SignMessageVersion, useWalletConnect} from "@cityofzion/wallet-connect-sdk-react";
import { setVariable } from "../../manager/manager.js";
const Button = styled.button`
  background-color: black;
  color: white;
  font-size: 20px;
  padding: 10px 60px;
  border-radius: 5px;
  margin: 10px 0px;
  cursor: pointer;
`;

function PageWalletConnect({messageToSign, tmpTest}) {

    const [connectedAccount, setConnectedAccount] = useState({})
    const [wcUri, setWCUri] = useState("")
    const [wcUrl, setWCUrl] = useState("")
    // const [activeNet] = useState('neo3:mainnet');
    const wcSdk = useWalletConnect()
    console.log(wcSdk)
    console.log("tmpTest", tmpTest, messageToSign)
    if (wcSdk.isConnected()) {
        console.log("1", wcSdk.getAccountAddress()) // print the first connected account address
        console.log("2", wcSdk.getChainId()) // print the first connected account chain info
        console.log("3", wcSdk.session.namespaces); // print the blockchain dictionary with methods, accounts and events
        console.log("4",wcSdk.session.peer.metadata); // print the wallet metadata
    }
    const _base64ToArrayBuffer = (base64) => {
        var binary_string = window.atob(base64);
        var len = binary_string.length;
        var bytes = new Uint8Array(len);
        for (var i = 0; i < len; i++) {
            bytes[i] = binary_string.charCodeAt(i);
        }
        return bytes.buffer;
    }
    const onSignMessage = async () => {
        console.log("WC signing message ", messageToSign)
        try {
            console.log("messageToSign.Signature", messageToSign.Signature)
            console.log("messageToSign.Data", messageToSign.Data)
            const pubKey = "031ad3c83a6b1cbab8e19df996405cb6e18151a14f7ecd76eb4f51901db1426f0b"

            const pl = {
                messageHex: messageToSign.Data,
                data: window.atob(messageToSign.Signature),
                publicKey: pubKey
            }
            const valid = await wcSdk.verifyMessage(pl)
            console.log("valid signature", valid)
            return
            /* changed to sign in Go, and verify here
             */
            const buffer = _base64ToArrayBuffer(messageToSign)
            var byteView = new Uint8Array(buffer);
            console.log('ArrayBuffer byte values:', ...byteView); //just for viewing
            const resp = await wcSdk.signMessage({
                message: messageToSign,
                version: SignMessageVersion.DEFAULT,
            })
            console.log("hex ", resp.data)
            await setVariable(resp.data, resp.salt)
            console.log("signed = ", resp)
            // resp.data = "90ab1886ca0bece59b982d9ade8f5598065d651362fb9ce45ad66d0474b89c0b80913c8f0118a282acbdf200a429ba2d81bc52534a53ab41a2c6dfe2f0b4fb1b"
            // resp.publicKey = "02ce6228ba2cb2fc235be93aff9cd5fc0851702eb9791552f60db062f01e3d83f6"
            // resp.salt = "d41e348afccc2f3ee45cd9f5128b16dc"
            // resp.messageHex = "010001f05c6434316533343861666363633266336565343563643966353132386231366463436172616c686f2c206d756c65712c206f2062616775697520656820697373756d65726d6f2074616978206c696761646f206e61206d697373e36f3f0000"
            // const valid = await wcSdk.verifyMessage(resp)
            console.log("valid ", valid)
        } catch(e) {
            console.log("error trying to sign message", e)
        }
    }
    const onConnectWallet = async () => {
        try {
            const { uri, approval } = await wcSdk.createConnection('neo3:mainnet', ['invokeFunction', 'testInvoke', 'signMessage', 'verifyMessage'])
            // window.runtime.BrowserOpenURL(`https://neon.coz.io/connect?uri=${uri}`)
            // window.open(`https://neon.coz.io/connect?uri=${uri}`, '_blank')?.focus() // do whatever you want with the uri
            setWCUri(uri)//`https://neon.coz.io/connect?uri=${uri}`)
            // setWCUrl(`https://neon.coz.io/connect?uri=${uri}`)
            // console.log("wcUrl", wcUrl)
            console.log("wcUri", wcUri)
            const session = await approval()
            wcSdk.setSession(session)
            // await wcSdk.createConnection(activeNet, ['invokeFunction', 'testInvoke', 'signMessage', 'verifyMessage']);
            console.log(wcSdk.isConnected() ? 'Connected successfully' : 'Connection refused')
        } catch (error) {
            console.log("error wc Something went wrong, contact the application administrator")
        }
    }
    /*
    {
                      type: wcSdk.session.namespaces.neo3.accounts[0].split(':')[0],
                      net: wcSdk.session.namespaces.neo3.accounts[0].split(':')[1],
                      account: wcSdk.session.namespaces.neo3.accounts[0].split(':')[2],
                      data: wcSdk.session.peer,
                      tokens: {
                          container: {},
                          object: {}
    }
    */
    useEffect(() => {
        if (wcSdk.isConnected()) {
            console.log(wcSdk.isConnected() ? 'Connected successfully' : 'Connection refused')
            console.log("session", wcSdk.session)
            // onPopup('success', 'Wallet connected');
            // if (localStorage.walletData && JSON.parse(localStorage.walletData).expiry > new Date().getTime()) {
            // 	const walletDataTemp = JSON.parse(localStorage.walletData);
            // 	setWalletData(walletDataTemp);
            // } else {
            // 	if (localStorage.walletData) {
            // 		localStorage.removeItem('walletData');
            // 	}
            // 	setWalletData({
            // 		type: wcSdk.session.namespaces.neo3.accounts[0].split(':')[0],
            // 		net: wcSdk.session.namespaces.neo3.accounts[0].split(':')[1],
            // 		account: wcSdk.session.namespaces.neo3.accounts[0].split(':')[2],
            // 		data: wcSdk.session.peer,
            // 		tokens: {
            // 			container: {},
            // 			object: {}
            // 		}
            // 	});
            // }
            // onModal();
        }
        //  else if () {
        // 	onDisconnectWallet();
        // }
    }, [wcSdk.isConnected()]); // eslint-disable-line react-hooks/exhaustive-deps
    const onDisconnectWallet = async () => {
        try {
            await wcSdk.disconnect();
        } catch(e) {
            console.log("error could not disconnect ", e)
        }
    }
    return (
        <div className="App">
            <Button onClick={onSignMessage}>
                Sign Message
            </Button>
            <Button onClick={onConnectWallet}>
                Disconnect
            </Button>
            <Button onClick={wcSdk.disconnect}>
                Connect wallet
            </Button>
            {
                wcUri !== undefined && wcUri !== "" ? console.log("render wcUri ", wcUri) : null
            }
            {
                wcUri !== undefined && wcUri !== "" ? <div>
                    <h6>{wcUrl}</h6>
                    <h6>{wcUri}</h6>
                    <QRCode value={wcUri}/>
                </div> : null
            }
            {
                wcSdk.session !== undefined && wcSdk.session.namespaces !== null ? <h3>{wcSdk.session.namespaces.neo3.accounts[0]}</h3> : null
            }
        </div>
    );
};

export default PageWalletConnect;