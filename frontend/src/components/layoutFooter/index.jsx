import React from 'react';
import Modal from "../compModal";

class Footer extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <>
                <div className="d-flex">
                    <button type="button" className="atmButtonSimple" data-bs-toggle="modal" data-bs-target="#exampleModal"><i className="fas fa-hand-point-right"/>Click me for modal</button>
                    <button type="button" className="atmButtonSimple" onClick="#"><i className="fas fa-hand-point-right"/>Click me for progress</button>
                    <button type="button" className="atmButtonSimple" onClick="#"><i className="fas fa-hand-point-right"/>Click me for Toast (success)</button>
                </div>
                <div className="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <Modal title="Greenfinch Modal">
                        <p>Here is the content for the modal</p>
                    </Modal>
                </div>
            </>
        );
    }
}

export default Footer;