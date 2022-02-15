import React, { useState } from 'react';
import Modal from "../compModal";
import Progress from "../compProgress";


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
                <Modal title="Greenfinch Modal">
                    <p>Here is the content for the modal. I will need styling.</p>
                </Modal>
            </div>
            <div>
                <Progress onClose={() => setShow(false)} show={show}></Progress>
            </div>
        </>
    );
}