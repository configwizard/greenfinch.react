import React from "react";

// Actual
import { loadWallet, newWallet } from "../../../manager/manager.js";

// Mocker 
// import { loadWallet, newWallet } from "../../../mocker/manager.js";

// Context
import { useModal } from "../ModalContext";

// Components
import ButtonDefault from "../atoms/ButtonDefault";
import CompModalBrand from "../ModalBrand";

function NewWalletModal(props) {
    const {setModal, unSetModal} = useModal()
    return (
        <div className="ms-auto molButtonGroup">
            <button
                type="button"
                className={`atmButtonDefault`}
                onClick={() => {
                    setModal(<CompModalBrand
                        title={"Get started"}
                        secondaryClicked={unSetModal}>
                        <div className="d-flex flex-column align-items-center">
                            <p>Welcome to Greenfinch, to get started you will need a wallet.</p>
                            <ButtonDefault
                                buttonClass={"atmButtonDefault"}
                                iconIncluded={true}
                                faClass={"fas fa-star-shooting"} 
                                text={"Create new wallet"}
                                onClick={async () => {await newWallet("password"); unSetModal()}} 
                            />
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
