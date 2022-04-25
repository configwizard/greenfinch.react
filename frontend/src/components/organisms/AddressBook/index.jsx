import React from 'react';

// Components
import RowAddress from '../../molecules/RowAddress';

import './style.scss';

export default function AddressBook() {
    return (
        <div className="orgAddressBook d-flex flex-column">
            <div>
                <RowAddress></RowAddress>
                <RowAddress></RowAddress>
            </div>
        </div>
    );
}