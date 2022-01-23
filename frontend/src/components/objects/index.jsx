import React  from "react";
import JSONView from 'react-json-view';

function Objects({objects, containerID}) {

    console.log("objects", objects)
    console.log("container - ID", containerID)
    return (
        <div>
            <div className="result">Objects for container {containerID} 👇
                <JSONView id="json-pretty" src={objects}></JSONView>
            </div>
        </div>
    );
}

export default Objects;
