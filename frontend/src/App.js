import React from 'react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'; // Every page will use bootstrap
import 'bootstrap/dist/js/bootstrap.min.js'; // TEMP - fine for V1
import './assets/dashboard.scss';
import './assets/greenfinch.scss';

// Components
import PageHome from './components/pages/Home';
import PageContainers from './components/pages/Containers';
import PageWebsites from './components/pages/Websites';

import Footer from './components/organisms/Footer';
import Header from './components/organisms/Header';
import NavbarSide from './components/organisms/NavbarSide';

// Try this: https://v5.reactrouter.com/web/example/basic

const App = () => {
    return (
        <MemoryRouter>
            <div className="d-flex flex-column">
                <div className="container-fluid">
                    {/* // This is where the issue arises
                        <Header account={this.state.account}></Header>
                    */}
                    <div className="templ-shell d-flex flex-row">
                        <div className="flex-shrink-1">
                            <NavbarSide/>
                            {/* Move router in here... and move 'Routes' in here too 
                                https://stackoverflow.com/questions/32128978/react-router-no-not-found-route*/}
                        </div>
                        <div className="orgMainJSON w-100">
                            <Routes>
                                <Route path="/home" exact component={<PageHome/>} />
                                <Route path="/containers" component={<PageContainers/>} />
                                <Route path="/websites" component={<PageWebsites/>} />
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
        </MemoryRouter>
    );
};

export default App;