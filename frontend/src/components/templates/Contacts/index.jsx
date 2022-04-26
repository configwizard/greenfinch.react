import React from 'react';

// Components
import HeaderPage from '../../organisms/HeaderPage';
import AddressBook from '../../organisms/AddressBook';

import './style.scss';

const TemplateContacts = () => {
    return (
        <div class="templatePage d-flex flex-column flex-grow-1">
            <div class="row">
                <div className="col-12">
                    <HeaderPage 
                        pageTitle={"Greenfinch contacts"} />
                    <AddressBook/>
                </div>
            </div>
        </div>
    );
}

export default TemplateContacts;