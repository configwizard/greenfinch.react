import React from "react";

function BreadCrumb() {
    return (
        <div className="molBlockBread d-flex align-items-center">
            {/* TODO: This is manually added for now*/}
            <div>
                <span className="atmBreadWallet"><i className="fas fa-lg fa-wallet"/>NQtxsStXxadvtRyz2B1yJXTXCeEoxsUJBkxW</span><span>Containers&nbsp;&nbsp;<i className="fas fa-caret-right"/>&nbsp;&nbsp;_</span>{/* breadcrumb horizontal */}
            </div>
            <div className="ms-auto">
                <button type="button" className="atmButtonIconClean" onClick={()=>{}}><i className="far fa-wallet" /></button>
                <button type="button" className="atmButtonIconClean" onClick={()=>{}}><i className="far fa-cog" /></button>
            </div>
        </div>
    );
}

export default BreadCrumb;