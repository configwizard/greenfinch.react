import React from "react";

const CompModal = props => {
    return (  
        <div className="modal-dialog">
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLabel">{props.title}</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                    {props.children}
                </div>
                {/* Helpful: https://medium.com/tinyso/how-to-create-a-modal-component-in-react-from-basic-to-advanced-a3357a2a716a */}
                <div className="modal-footer">
                    <button type="button" className="atmButtonSimple" data-bs-dismiss="modal">Close</button>
                    <button type="button" className="atmButtonSimple" onClick={() => {props.clicked()}}>{props.buttonText}</button>
                </div>
            </div>
        </div>
    )
}

export default CompModal;
