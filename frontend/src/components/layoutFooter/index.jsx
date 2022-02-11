import React from "react";

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
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">Modal title</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                ...
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="atmButtonSimple" data-bs-dismiss="modal">Close</button>
                                <button type="button" className="atmButtonSimple">Save changes</button>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default Footer;