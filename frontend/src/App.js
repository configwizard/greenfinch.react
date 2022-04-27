import React from 'react';
import { useLocation, Routes, Route } from 'react-router-dom';

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'; // Every page will use bootstrap
import 'bootstrap/dist/js/bootstrap.min.js'; // TEMP - fine for V1
import './assets/dashboard.scss';
import './assets/greenfinch.scss';

// Components
import PageHome from './pages/Home';
import PageTest from './pages/Test';
import PageContainers from './pages/Containers';
import PageWebsites from './pages/Websites';
import PageContacts from './pages/Contacts';

import Footer from './components/organisms/Footer';
import Header from './components/organisms/Header';
import NavbarSide from './components/organisms/NavbarSide';

import { getAccountInformation } from './manager/manager.js';
//import { getAccountInformation } from './mocker/manager.js';

// Try this: https://v5.reactrouter.com/web/example/basic

function prepareWalletData(account) {
    console.log("props.account", account)
    let clean = {
        neofs: {
            balance: account.neofs !== undefined ? account.neofs.balance : 0,
            precision: account.neofs !== undefined ? account.neofs.precision : 0
        },
        nep17: {
            GAS: {
                amount: account.nep17 !== undefined ? account.nep17.GAS.amount : 0,
                meta: {
                    decimals: account.nep17 !== undefined ? account.nep17.GAS.meta.decimals : 0,
                }
            },
            NEO: {
                amount: account.nep17 !== undefined  ? account.nep17.NEO.amount : 0
            }
        }
    }
    let b = clean.neofs.balance
    let p = clean.neofs.precision;
    let m = Math.pow(10,p);

    let gs = clean.nep17.GAS.amount
    let dp = clean.nep17.GAS.meta.decimals
    let ms = Math.pow(10,dp);

    let cleanBalances = {
        address: account.address,
        neoFSBalance: Number(b/m).toFixed(4),
        gasBalance: Number(gs/ms).toFixed(4),
        neoBalance: clean.nep17.NEO.amount
    }
    return cleanBalances
}
class App extends React.Component {
// const App = () => {
    constructor(props) {
        super(props);
        this.state = {account: {
            address: "",
            neoFSBalance: 0,
            gasBalance: 0,
            neoBalance: 0
        }};
    }
    componentDidMount = async() => {
        window.runtime.EventsOn("fresh_wallet", async (newAccount) => {
            console.log("fresh_wallet response", newAccount)
            const walletData  = await getAccountInformation()
            const account = prepareWalletData(walletData)
            console.log("setting wallet details to ", account)
            await this.setState({account})
        })
        //FAKER remove in reality
        // const account = prepareWalletData({})
        // await this.setState({account})
    }
    setStatusAccount = async () => {
        const walletData  = await getAccountInformation()
        const account = prepareWalletData(walletData)
        console.log("setting wallet details to ", account)
        await this.setState({account})
    }
    // waitForWallet();
    render() {
    // const location = useLocation();
    // console.log(location)

        return (
            <div className="d-flex flex-column">
                <div className="container-fluid">
                    <Header account={this.state.account}></Header>
                    <div className="templateShell d-flex flex-row">
                        <div className="flex-shrink-1">
                            <NavbarSide/>
                        </div>
                        <div className="w-100">
                            <Routes>
                                <Route path="/" exact element={<PageHome/>} />
                                <Route path="/containers" exact element={<PageContainers setStatusAccount={this.setStatusAccount} account={this.state.account}/>} />
                                <Route path="/websites" exact element={<PageWebsites/>} />
                                <Route path="/contacts" exact element={<PageContacts/>} />
                                <Route path="/test" exact element={<PageTest/>} />
                            </Routes>
                        </div>
                    </div>
                    <Footer/>
                </div>
            </div>
        );
    }
};

export default App;
