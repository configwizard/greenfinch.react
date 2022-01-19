import React  from "react";
import JSONView from 'react-json-view';

function Objects(objects, containerID) {

    console.log("objects", objects)
    console.log("container - ID", JSON.stringify(containerID))
    return (
        <div>
            <div className="result">Objects for container👇
                <JSONView id="json-pretty" src={objects}></JSONView>
            </div>
        </div>
    );
}

export default Objects;
