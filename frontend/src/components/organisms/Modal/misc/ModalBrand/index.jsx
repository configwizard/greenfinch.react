import React from "react";

// Central style sheet for modals
import '../_settings/style.scss';

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
            This modal does not have explicit primary/secondary buttons */}
        </section>
    )
}

export default CompModalBrand;
