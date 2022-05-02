import React from 'react';

// Components
import RowAddress from '../../molecules/RowAddress';

import './style.scss';

const AddressBook = ({contacts}) => {
    console.log("AddressBook ", contacts)
    return (
        <div className="addressBookContainer">
            <div className="addressBook">
                {contacts.map(c => {
                    return <RowAddress contact={c}/>
                })
                }
            </div>
        </div>
    );
}

export default AddressBook;
