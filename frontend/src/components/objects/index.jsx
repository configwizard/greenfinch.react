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
            <pre>
                https://http.testnet.fs.neo.org/Q9dpMA6t7drq8KJB5qa7jQ6JN6GMSGBH3qrxHN7v2TC/55VgvagHC4PVPEZwhCVhSjAZad1GgzMLXBRVSkCp5kH9
            </pre>
        </div>
    );
}

export default Objects;
