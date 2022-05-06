import React from 'react';

// Components
import RowAddress from '../../molecules/RowAddress';

import './style.scss';

const AddressBook = ({contacts, deleteContact}) => {
    console.log("AddressBook ", contacts)
    return (
        <div className="addressBookContainer">
            <div className="addressBook">
                {contacts.map((c, i) => {
                    return <RowAddress key={i} first={i == 0 ? true:false} contact={c} deleteContact={deleteContact}/>
                })
                }
            </div>
        </div>
    );
}

export default AddressBook;
