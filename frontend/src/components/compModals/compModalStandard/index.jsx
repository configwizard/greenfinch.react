import React from "react";

const CompModalStandard = props => {
    return (
        <>
            <h5>{props.title}</h5>
            {props.children}
            <button type="button" className="atmButtonSimple" onClick={() => {props.secondaryClicked()}}>{props.buttonTextSecondary}</button>
            <button type="button" className="atmButtonSimple" onClick={() => {props.primaryClicked()}}>{props.buttonTextPrimary}</button>
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
