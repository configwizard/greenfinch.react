import React  from "react";
import JSONView from 'react-json-view';

function Containers(containers) {
    return (
        <div>
            <div className="result" id="result">Containers 👇
                <JSONView id="json-pretty" src={containers}></JSONView>
            </div>
        </div>
    );
}

export default Containers;
