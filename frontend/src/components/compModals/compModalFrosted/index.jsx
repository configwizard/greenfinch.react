import React from "react";

const CompModalFrosted = props => {
    return (  
        <div className="modal-dialog">
            <div className="modal-content">
                
                {/*  No header */}
                <div className="modal-body">{/*  No close button as they overlay is explicit */}
                    <h5>{props.title}x</h5>
                    <p>{props.children}</p>
                    <button type="button" className="atmButtonSimple" data-bs-dismiss="modal">{props.buttonTextSecondary}</button>
                </div>
                {/*  No footer */}

            </div>
        </div>
    )
}

export default CompModalFrosted;
