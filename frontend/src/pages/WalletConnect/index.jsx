import React, { useState, useEffect } from 'react';
import styled from "styled-components";
import ReactDOM from "react-dom";
import QRCode from "react-qr-code";
import {useWalletConnect} from "@cityofzion/wallet-connect-sdk-react";
const Button = styled.button`
  background-color: black;
  color: white;
  font-size: 20px;
  padding: 10px 60px;
  border-radius: 5px;
  margin: 10px 0px;
  cursor: pointer;
`;

function PageWalletConnect() {

    const [connectedAccount, setConnectedAccount] = useState({})
    const [wcUri, setWCUri] = useState("")
    const [wcUrl, setWCUrl] = useState("")
    const [activeNet] = useState('neo3:testnet');
    const wcSdk = useWalletConnect()
    console.log(wcSdk)
    if (wcSdk.isConnected()) {
        console.log("1", wcSdk.getAccountAddress()) // print the first connected account address
        console.log("2", wcSdk.getChainId()) // print the first connected account chain info
        console.log("3", wcSdk.session.namespaces); // print the blockchain dictionary with methods, accounts and events
        console.log("4",wcSdk.session.peer.metadata); // print the wallet metadata
    }
    const onConnectWallet = async () => {
        try {
            const { uri, approval } = await wcSdk.createConnection('neo3:testnet')
            window.runtime.BrowserOpenURL(`https://neon.coz.io/connect?uri=${uri}`)
            // window.open(`https://neon.coz.io/connect?uri=${uri}`, '_blank')?.focus() // do whatever you want with the uri
            setWCUri(uri)//`https://neon.coz.io/connect?uri=${uri}`)
            setWCUrl(`https://neon.coz.io/connect?uri=${uri}`)
            console.log("wcUrl", wcUrl)
            console.log("wcUri", wcUri)
            const session = await approval()
            wcSdk.setSession(session)
            await wcSdk.connect(activeNet, ['invokeFunction', 'testInvoke', 'signMessage', 'verifyMessage']);
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
            <Button onClick={onConnectWallet}>
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