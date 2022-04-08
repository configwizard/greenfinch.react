import React from 'react';

// Components
import ButtonDefault from '../../../atoms/ButtonDefault';

const CompModalStandard = props => {
    return (
        <section className="orgModalBrand">
            <div className="molModalHeader">
                <h2>{props.title}</h2>
            </div>
            <div className="molModalBody"> 
                {props.children}
            </div>
            <div className="molModalFooter d-flex">
                <div className="ms-auto molButtonGroup">
                    <ButtonDefault
                        buttonClass={"atmButtonDefault"}
                        iconIncluded={false}
                        text={props.buttonTextSecondary}
                        onClick={() => {props.secondaryClicked()}} />
                    <ButtonDefault
                        buttonClass={"atmButtonDefault"}
                        iconIncluded={false}
                        text={props.buttonTextPrimary}
                        onClick={() => {props.primaryClicked()}} />
                </div>
            </div>
        </section>
    )
}

export default CompModalStandard;
