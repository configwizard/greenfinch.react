import React, { useState } from 'react';

// Components
import ButtonText from '../../atoms/ButtonText';
import ProgressBar from "../../molecules/ProgressBar";
import { useModal } from '../Modal/ModalContext';
import CompModalStandard from "../Modal/ModalStandard";

import './style.scss';

const Footer = ({fireToast, percentage}) => {
    const [show, setShow] = useState(false)
    const { setModal, unSetModal } = useModal()
    return (
        <footer>

            {/* 
                <div className="d-flex ms-auto">
                    <ButtonText
                        buttonClass={"atmButtonText"}
                        hasIcon={true}
                        faClass={"fas fa-hand-point-right"}
                        text={"Click me for modal"}
                        onClick={() => {
                            setModal(
                                <CompModalStandard
                                title={"Are modals working"}
                                buttonTextPrimary={"Confirm"}
                                buttonTextSecondary={"Cancel"}
                                primaryClicked={async () => unSetModal()}
                                secondaryClicked={async () => unSetModal()}>
                                    <p>Modal activated</p>
                            </CompModalStandard>)
                        }} />
                    <ButtonText
                        buttonClass={"atmButtonText"}
                        hasIcon={true}
                        faClass={"fas fa-hand-point-right"}
                        text={"Click me for progress"}
                        onClick={() => setShow(true)}
                    />
                   
                </div>
                <ButtonText
                    buttonClass={"atmButtonText"}
                    hasIcon={true}
                    faClas={"fas fa-hand-point-right"}
                    text={"Click me for toast"}
                    onClick={() => {fireToast({Title: "clicked", Type:"success", Description:"Toast launched."})}}
                />
                <div>
                    <ProgressBar show={show} setShow={setShow} percentage={percentage}></ProgressBar>
                </div>
            */}
        </footer>
    );
}

export default Footer;
