import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { HashRouter } from 'react-router-dom'; 
import reportWebVitals from './reportWebVitals';
import { ModalProvider } from './components/organisms/Modal/ModalContext';
import {WalletConnectProvider} from "@cityofzion/wallet-connect-sdk-react";
const wcOptions = {
    projectId: 'd2e9c6f1c62a473917ff19a86d6f8858', // the ID of your project on Wallet Connect website
    relayUrl: 'wss://relay.walletconnect.com', // we are using walletconnect's official relay server
    metadata: {
        name: 'Greenfinch', // your application name to be displayed on the wallet
        description: 'Greenfinch decentralised storage', // description to be shown on the wallet
        url: 'https://myapplicationdescription.app/', // url to be linked on the wallet
        icons: ['https://myapplicationdescription.app/myappicon.png'] // icon to be shown on the wallet
    }
};


ReactDOM.render(
    <React.StrictMode>
        <WalletConnectProvider autoManageSession={true} options={wcOptions}>
        <ModalProvider>
            <HashRouter>
                <App />
            </HashRouter>
        </ModalProvider>
        </WalletConnectProvider>
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
