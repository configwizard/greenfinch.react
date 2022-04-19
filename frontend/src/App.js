import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'; // Every page will use bootstrap
import 'bootstrap/dist/js/bootstrap.min.js'; // TEMP - fine for V1
import './assets/dashboard.scss';
import './assets/greenfinch.scss';

// Components
import Home from './components/pages/Home';
import Containers from './components/pages/Containers';
import Websites from './components/pages/Websites';

import Footer from './components/organisms/Footer';
import Header from './components/organisms/Header';
import NavbarSide from './components/organisms/NavbarSide';

const App = () => {
    return (
        <Router>
            <div className="d-flex flex-column">
                <div className="container-fluid">
                    <Header account={this.state.account}></Header>
                    <div className="templ-shell d-flex flex-row">
                        <div className="flex-shrink-1">
                            <NavbarSide/>
                        </div>
                        <div className="orgMainJSON w-100">
                            <Routes>
                                <Route path="/" exact component={Home} />
                                <Route path="/containers" component={Containers} />
                                <Route path="/websites" component={Websites} />
                                <Route render={() => 
                                    <>
                                        <div>
                                            <h1>404, page not found.</h1>
                                            <p>Please try again.</p>
                                        </div>
                                    </>
                                } />
                            </Routes>
                        </div>
                    </div>
                    <Footer></Footer>
                </div>
            </div>
        </Router>
    );
};

export default App;