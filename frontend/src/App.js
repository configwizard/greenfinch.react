import React from 'react';
import { Routes, Route } from 'react-router-dom';

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'; // Every page will use bootstrap
import 'bootstrap/dist/js/bootstrap.min.js'; // TEMP - fine for V1
import './assets/dashboard.scss';
import './assets/greenfinch.scss';

// Components
import PageHome from './pages/Home';
import PageShared from './pages/Shared';
import PageContainers from './pages/Containers';
import PageWebsites from './pages/Websites';
import PageContacts from './pages/Contacts';
import PageNFTs from './pages/NFTs';
import PageNotifications from './pages/Notifications';
import PageTest from './pages/Test';

import Footer from './components/organisms/Footer';
import Header from './components/organisms/Header';
import NavbarSide from './components/organisms/NavbarSide';

import {getAccountInformation, getVersion} from './manager/manager.js';
import ItemToast from "./components/molecules/Toast";
import ProgressBar from "./components/molecules/ProgressBar";
import { retrieveRecentWallets } from "./manager/manager.js";

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
        publicKey: account.publicKey,
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
        this.state = {
            account: {
                address: "",
                neoFSBalance: 0,
                gasBalance: 0,
                neoBalance: 0
            },
            selectedNetwork: null,
            recentWallets: [],
            lockUI: false
        };
    }
    componentDidMount = async() => {
        window.runtime.EventsOn("freshtoast", async (message) => {
            console.log("checking for error ", message)
            if (message.Type == "error") {
                //run a shut down routine
                await this.setLock(false) //remove the loading modal
            }
        })
        window.runtime.EventsOn("fresh_wallet", async (newAccount) => {
            console.log("fresh_wallet response", newAccount)
            const walletData  = await getAccountInformation()
            const account = prepareWalletData(walletData)
            console.log("setting wallet details to ", account)
            await this.setState({account})
            await this.setLock(false) //remove the loading modal
        })
        // const [selectedNetwork, setSelectedNetwork] = useState({Name: "Test Net"});
        // const [count, setCount] = React.useState(0);
        window.runtime.EventsOn("networkchanged", async (message) => {
            console.log("networkchanged", message)
            await this.setState({...this.state, selectedNetwork: message})
            await this.setStatusAccount()
        })
        const recentWallets = await retrieveRecentWallets()
        const version = await getVersion()
        this.setState({...this.state, version, recentWallets})
        console.log(recentWallets)
        //FAKER remove in reality
        // const account = prepareWalletData({})
        // await this.setState({account})
    }
    setLock = async (val) => {
        console.log("setting lock to ", val)
        await this.setState({...this.state, lockUI: val})
    }
    setStatusAccount = async () => {
        const walletData  = await getAccountInformation()
        const account = prepareWalletData(walletData)
        console.log("setting wallet details to ", account)
        await this.setState({account})
    }
    refreshRecentWallets = async() => {
        const recentWallets = await retrieveRecentWallets()
        this.setState({...this.state, recentWallets})
    }
    // waitForWallet();
    render() {
    // const location = useLocation();
    // console.log(location)

        return (
            <>
                <div className="d-flex flex-column">
                    <div className="container-fluid">
                        <Header account={this.state.account}></Header>
                        <div className="templateShell d-flex flex-row">
                            <div className="flex-shrink-1">
                                <NavbarSide refreshAccount={this.setStatusAccount} selectedNetwork={this.state.selectedNetwork} version={this.state.version} account={this.state.account}/>
                            </div> 
                            <div className="w-100">
                                <Routes>
                                    <Route path="/" exact element={<PageHome setLock={this.setLock} lockUI={this.state.lockUI} refreshRecentWallets={this.refreshRecentWallets} recentWallets={this.state.recentWallets} account={this.state.account} selectedNetwork={this.state.selectedNetwork}/>} />
                                    <Route path="/containers" exact element={<PageContainers setLock={this.setLock} lockUI={this.state.lockUI} setStatusAccount={this.setStatusAccount} account={this.state.account}/>} />
                                    <Route path="/contacts" exact element={<PageContacts account={this.state.account}/>} />
                                    <Route path="/shared" exact element={<PageShared account={this.state.account}/>} />
                                    <Route path="/websites" exact element={<PageWebsites/>} />
                                    <Route path="/nfts" exact element={<PageNFTs/>} />
                                    <Route path="/notifications" exact element={<PageNotifications/>} />
                                    {/*<Route path="/test" exact element={<PageTest/>} />*/}
                                    <Route path="/test" exact element={<PageTest/>} />
                                </Routes>
                            </div>
                        </div>
                        <Footer/>
                    </div>
                    <ItemToast autoDelete={true} autoDeleteTime={3000}></ItemToast>
                    <ProgressBar></ProgressBar>
                </div>
            </>
        );
    }
};

export default App;
