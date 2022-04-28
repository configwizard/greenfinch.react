import React, { useState } from 'react';

import { topUpNeoFS } from '../../../manager/manager.js';

// Components
import ButtonIcon from '../../atoms/ButtonIcon';
import Dropdown from '../../molecules/Dropdown';
import Wallet from '../Wallet';

import './style.scss';

function BreadCrumb(props) {

    console.log("breadcrumb received wallet ", props.account)
    const [show, setShow] = useState(false)
    const selectedContainer = props.container == null ? "" : props.container.containerName
    const selectedObject = props.object == null ? "" : props.object.objectName
    console.log("selectedObject", props, selectedObject, selectedContainer)

    function topUpWallet(amount) {
        console.log("top up amount", amount)
        alert("topping up amount " + amount)

        const result = topUpNeoFS(amount)
        console.log(result)
    }

    return (
        <div className="molBlockBread d-flex align-items-center">
            <div className="atmBlockBread">
                <span className="bread-home" onClick={props.resetBreadcrumb}>Containers</span>{selectedContainer ? <span className="bread-container">{selectedContainer}</span> : ''}{selectedObject ? <span className="bread-object">{selectedObject}</span> : ''}
                {/* <span className="atmBreadCrumb"><i className="fas fa-home"/></span><span className="utBreadLive" onClick={props.resetBreadcrumb}>Containers</span><i className="fas fa-lg fa-caret-right"/><span className="utBreadLive">{selectedContainer}</span><i className="fas fa-lg fa-caret-right"/><span className="atmBreadCrumb">{selectedObject}</span> */}
            </div>
            <div className="ms-auto">
                <ButtonIcon 
                    type={"clean"}
                    size={"large"}
                    onClick={() => setShow(true)}
                    buttonClass={"utButtonWallet"}
                    faClass={"far fa-wallet"} />
                    {/* How to work this as originally wrapped in <button> tag */}
                    <Wallet onClose={() => setShow(false)} show={show} account={props.account} topUpWallet={topUpWallet}></Wallet>
            </div>
        </div>
    );
}

export default BreadCrumb;
