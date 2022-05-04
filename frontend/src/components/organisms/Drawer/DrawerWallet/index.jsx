import React from 'react';

// Components

// Central style sheet for templates
import '../_settings/style.scss';

const DrawerWallet = () => {
    return (
        <>
        <div className="offcanvas offcanvas-end" tabIndex="-1" id="offcanvasRight" aria-labelledby="offcanvasRightLabel">
            <div className="offcanvas-header d-flex align-items-center">
                <h4 id="offcanvasRightLabel"><i className="fas fa-lg fa-wallet"/>&nbsp;Wallet</h4>
                <button type="button" className="atmButtonIconClean" data-bs-dismiss="offcanvas" aria-label="Close"><i className="fas fa-times"/></button>
            </div>
            <div className="offcanvas-body">
                Wallet Body
            </div>
        </div>
    </>
    )
}

export default DrawerWallet;