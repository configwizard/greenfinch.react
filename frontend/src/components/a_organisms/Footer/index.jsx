import React, { useState } from 'react';
import CompModalStandard from "../compModals/compModalStandard";
import CompProgress from "../compProgress";

import ButtonDefault from '../../a_atoms/ButtonDefault';

export default function Footer({fireToast, percentage}) {
    const [show, setShow] = useState(false)
    const { setModal, unSetModal } = useModal()
    return (
        <>
            <div className="d-flex ms-auto">
                <ButtonDefault
                    buttonClass={"atmButtonDefault"}
                    iconIncluded={true}
                    iconClasses={"fas fa-hand-point-right"}
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
                <ButtonDefault
                    buttonClass={"atmButtonDefault"}
                    iconIncluded={true}
                    iconClasses={"fas fa-hand-point-right"}
                    text={"Click me for progress"}
                    onClick={() => setShow(true)}
                />
                <ButtonDefault
                    buttonClass={"atmButtonDefault"}
                    iconIncluded={true}
                    iconClasses={"fas fa-hand-point-right"}
                    text={"Click me for toast"}
                    onClick={() => {fireToast({Title: "clicked", Type:"success", Description:"Toast launched."})}}
                />
            </div>
            <div style={{"position":"relative"}}>
                <CompProgress show={show} setShow={setShow} percentage={percentage}></CompProgress>
            </div>
        </>
    );
}
