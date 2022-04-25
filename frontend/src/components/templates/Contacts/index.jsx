import React from 'react';

// Components
import AddressBook from '../../organisms/AddressBook';

import './style.scss';

const TemplateContacts = () => {
    return (
        <div class="templ-page">
            <div class="row">
                <div className="col-12">
                    <section className="templ-section scroll-y">
                        <AddressBook/>
                    </section>
                </div>
            </div>
        </div>
    );
}

export default TemplateContacts;