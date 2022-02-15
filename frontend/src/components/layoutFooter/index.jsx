import React, { useState } from 'react';
import CompModal from "../compModal";
import CompProgress from "../compProgress";


export default function Footer() {
    const [show, setShow] = useState(false)

    return (
        <>
            <div className="d-flex ms-auto">
                <button type="button" className="atmButtonSimple" data-bs-toggle="modal" data-bs-target="#exampleModal"><i className="fas fa-hand-point-right"/>Click me for modal</button>
                <button type="button" className="atmButtonSimple" onClick={() => setShow(true)}><i className="fas fa-hand-point-right"/>Click me for progress</button>
                <button type="button" className="atmButtonSimple" onClick="#"><i className="fas fa-hand-point-right"/>Click me for Toast (success)</button>
            </div>
            <div className="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <CompModal title="Greenfinch Modal">
                    <p>Here is the content for the modal. I will need styling.</p>
                </CompModal>
            </div>
            <div>
                <CompProgress onClose={() => setShow(false)} show={show}></CompProgress>
            </div>
        </>
    );
}