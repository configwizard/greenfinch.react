import React from "react";

const CompModalBrand = props => {
    return (
        <section className="orgModalBrand">
            <div className="molModalHeader d-flex justify-content-center">
                <h2>{props.title}</h2>
            </div>
            <div className="molModalBody">
                {props.children}
            </div>
            {/* // we could add an advert panel here to balance the height of the modal... "Coming soon"
            <div className="molModalFooter d-flex">
                <div className="ms-auto molButtonGroup">
                    <button type="button" className="atmButtonDefault" onClick={() => {props.secondaryClicked()}}>{props.buttonTextSecondary}</button>
                    <button type="button" className="atmButtonDefault" onClick={() => {props.primaryClicked()}}>{props.buttonTextPrimary}</button>
                </div>
            </div> */}
        </section>
    )
}

export default CompModalBrand;
