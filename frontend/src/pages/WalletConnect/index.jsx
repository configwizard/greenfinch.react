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
        console.log("please open your WC wallet and accept the signing")
        try {
            console.log("message to sign is ", messageToSign)
            const resp = await wcSdk.signMessage({
                message: messageToSign,
                version: SignMessageVersion.CLASSIC,
            })
            console.log("resp -- ", resp)
            await setVariable(resp.data, resp.salt, resp.publicKey)
            // const valid = await wcSdk.verifyMessage(resp)
        } catch(e) {
            console.log("error trying to sign message", e)
        }
    }
    const onConnectWallet = async () => {
        try {
            const { uri, approval } = await wcSdk.createConnection('neo3:mainnet', ['invokeFunction', 'testInvoke', 'signMessage', 'verifyMessage'])
            setWCUri(uri)//`https://neon.coz.io/connect?uri=${uri}`)
            console.log("wcUri", wcUri)
            const session = await approval()
            wcSdk.setSession(session)
            console.log(wcSdk.isConnected() ? 'Connected successfully' : 'Connection refused')
        } catch (error) {
            console.log("error wc Something went wrong, contact the application administrator")
        }
    }
    useEffect(() => {
        if (wcSdk.isConnected()) {
            console.log(wcSdk.isConnected() ? 'Connected successfully' : 'Connection refused')
            console.log("session", wcSdk.session)
        }
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
