import React, { useState } from 'react';
import CompModalStandard from "../compModals/compModalStandard";
import CompProgress from "../compProgress";

export default function Footer({fireToast, percentage}) {
    const [show, setShow] = useState(false)
    const { showModal } = React.useContext(ModalContext);
    return (
        <>
            <div className="d-flex ms-auto">
                <button onClick={() => show(<SomeModalContent/>)}>Click to Open!</button>
                <button type="button" className="atmButtonDefault" data-bs-toggle="modal" data-bs-target="#exampleModal"><i className="fas fa-hand-point-right"/>Click me for modal</button>
                <button type="button" className="atmButtonDefault" onClick={() => setShow(true)}><i className="fas fa-hand-point-right"/>Click me for progress</button>
                <button type="button" className="atmButtonDefault" onClick={() => {fireToast({Title: "clicked", Type:"success", Description:"Toast launched."})}}><i className="fas fa-hand-point-right"/>Click me for Toast (success)</button>
            </div>
            {/*<div className="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">*/}
            {/*    <CompModalStandard title="Greenfinch Modal" buttonTextPrimary="OK" buttonTextSecondary="Cancel">*/}
            {/*        <p>Here is the content for the modal. I will need styling.</p>*/}
            {/*    </CompModalStandard>*/}
            {/*</div>*/}
            <div style={{"position":"relative"}}>
                <CompProgress show={show} setShow={setShow} percentage={percentage}></CompProgress>
            </div>
        </>
    );
}
