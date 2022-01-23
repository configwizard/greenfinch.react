import React  from "react";
import JSONView from 'react-json-view';

function Containers({containers, onSelected}) {
    console.log("containerList", containers)
    return (
        <div>
            <div className="result" id="result">Containers 👇
                <JSONView onSelect={(select)=>{onSelected(select)}} id="json-pretty" src={containers}></JSONView>
            </div>
        </div>
    );
}

export default Containers;
