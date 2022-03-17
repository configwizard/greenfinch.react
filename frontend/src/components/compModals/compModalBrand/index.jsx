import React from "react";

const CompModalBrand = props => {
    return (
        <div>
            <div className="molModalHeader d-flex justify-content-center">
                <h2>{props.title}</h2>
            </div>
            <div className="molModalBody">
                {props.children}
            </div>
            {/* 
            <div className="molModalFooter d-flex">
                <div className="ms-auto molButtonGroup">
                    <button type="button" className="atmButtonSimple" onClick={() => {props.secondaryClicked()}}>{props.buttonTextSecondary}</button>
                    <button type="button" className="atmButtonSimple" onClick={() => {props.primaryClicked()}}>{props.buttonTextPrimary}</button>
                </div>
            </div>
            */}
        </div>
    )
}

export default CompModalBrand;
