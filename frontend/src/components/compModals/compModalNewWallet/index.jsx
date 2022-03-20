import CompModalBrand from "../compModalBrand";
import {loadWallet, newWallet} from "../../../manager/manager";
import React from "react";
import {useModal} from "../compModalContext";

function NewWalletModal(props) {
    const {setModal, unSetModal} = useModal()
    return (
        <div className="ms-auto molButtonGroup">
            <button
                type="button"
                className={`atmButtonSimple`}
                onClick={() => {
                    setModal(<CompModalBrand
                        title={"Get started"}
                        secondaryClicked={unSetModal}>
                        <div className="d-flex flex-column align-items-center">
                            <p>Welcome to Greenfinch, to get started you will need a wallet.</p>
                            <button
                                type="button"
                                className="atmButtonSimple"
                                onClick={async () => {await newWallet("password"); unSetModal()}}>
                                <i className="fas fa-star-shooting"/>Create new wallet
                            </button>
                            <button
                                type="button"
                                className="atmButtonText"
                                onClick={async () => {await loadWallet("password"); unSetModal()}}>
                                <i className="fas fa-upload"/>Load existing wallet
                            </button>
                        </div>
                    </CompModalBrand>)
                }}>
                <i className="fas fa-plus-circle"/>Choose a wallet
            </button>
        </div>
    )
}

export default NewWalletModal;

