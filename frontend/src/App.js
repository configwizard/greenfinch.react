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
//import Header from './components/organisms/Header';
import NavbarSide from './components/organisms/NavbarSide';

// Try this: https://v5.reactrouter.com/web/example/basic

const App = () => {
    const location = useLocation();
    console.log(location)

    return (
        <div className="d-flex flex-column">
            <div className="container-fluid">
                {/* // This is where the issue arises
                    <Header account={this.state.account}></Header>
                */}
                <div className="templateShell d-flex flex-row">
                    <div className="flex-shrink-1">
                        <NavbarSide/>
                    </div>
                    <div className="w-100">
                        <Routes>
                            <Route path="/" exact element={<PageHome/>} />
                            <Route path="/containers" exact element={<PageContainers/>} />
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
};

export default App;