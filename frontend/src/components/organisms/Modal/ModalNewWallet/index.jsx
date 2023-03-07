import React from "react";

// Actual
import { loadWallet, newWallet } from "../../../manager/manager.js";

// Mocker 
// import { loadWallet, newWallet } from "../../../mocker/manager.js";

// Context
import { useModal } from "../ModalContext";

// Components
import ButtonText from "../atoms/ButtonText";
import CompModalBrand from "../ModalBrand";

// Central style sheet for modals
import '../_settings/style.scss';

function NewWalletModal(props) {
    const {setModal, unSetModal} = useModal()
    return (
        <div className="ms-auto molButtonGroup">
            <button
                type="button"
                className={`atmButtonText`}
                onClick={() => {
                    setModal(<CompModalBrand
                        title={"Get started"}
                        secondaryClicked={unSetModal}>
                        <div className="d-flex flex-column align-items-center">
                            <p>Welcome to Greenfinch, to get started you will need a wallet.</p>
                            <ButtonText
                                buttonClass={"atmButtonText"}
                                hasIcon={true}
                                faClass={"fa-solid fa-star-shooting"}
                                text={"Create new wallet"}
                                isDisabled={false}
                                onClick={async () => {await newWallet("password"); unSetModal()}} 
                            />
                            <button
                                type="button"
                                className="atmButtonText"
                                onClick={async () => {await loadWallet("password"); unSetModal()}}>
                                <i className="fa-sharp fa-solid fa-upload"/>Load existing wallet
                            </button>
                        </div>
                    </CompModalBrand>)
                }}>
                <i className="fa-sharp fa-solid fa-circle-plus"/>Choose a wallet
            </button>
        </div>
    )
}

export default NewWalletModal;
