import React from 'react';

// Components
import ButtonText from '../../../atoms/ButtonText';

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
                    <ButtonText
                        type="secondary"
                        size="medium"
                        hasIcon={false}
                        text={props.buttonTextSecondary}
                        onClick={() => {props.secondaryClicked()}} />
                    <ButtonText
                        type="primary"
                        size="medium"
                        hasIcon={false}
                        text={props.buttonTextPrimary}
                        onClick={() => {props.primaryClicked()}} />
                </div>
            </div>
        </section>
    )
}

export default CompModalStandard;
