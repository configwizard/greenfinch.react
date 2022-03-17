import React from "react";

const CompModalStandard = props => {
    return (
        <>
            <div className="molModalHeader">
                {/* TODO these are bs standard classes */ }
                <h2>{props.title}</h2>
            </div>
            <div className="molModalBody">
                {props.children}
            </div>
            <div className="molModalFooter d-flex">
                <div className="ms-auto molButtonGroup">
                    <button type="button" className="atmButtonSimple" onClick={() => {props.secondaryClicked()}}>{props.buttonTextSecondary}</button>
                    <button type="button" className="atmButtonSimple" onClick={() => {props.primaryClicked()}}>{props.buttonTextPrimary}</button>
                </div>
            </div>
        </>
        // <div className="modal-dialog">
        //     <div className="modal-content">
        //         <div className="modal-header">
        //             <h5 className="modal-title" id="exampleModalLabel">{props.title}</h5>
        //         </div>
        //         <div className="modal-body">
        //             {props.children}
        //         </div>
        //         {/* Helpful: https://medium.com/tinyso/how-to-create-a-modal-component-in-react-from-basic-to-advanced-a3357a2a716a */}
        //         <div className="modal-footer">
        //             <h5 className="modal-title" id="exampleModalLabel">{props.title}</h5>
        //             <button type="button" className="atmButtonSimple" data-bs-dismiss="modal">{props.buttonTextSecondary}</button>
        //             <button type="button" className="atmButtonSimple" onClick={() => {props.clicked()}}>{props.buttonTextPrimary}</button>
        //         </div>
        //     </div>
        // </div>
    )
}

export default CompModalStandard;
