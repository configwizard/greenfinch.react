import React  from "react";
import JSONView from 'react-json-view';
import {Card} from "react-bootstrap";

function Objects({objects, containerID}) {

    console.log("objects", objects)
    console.log("container - ID", containerID)

    return (
        <div className="result">
            <h2 className="atmTitle">Objects</h2>
                {objects.map((item) => {
                    console.log("container ID", containerID)
                    // const url = `https://http.testnet.fs.neo.org/${containerID}/${item.id}`
                        return (
                            <Card style={{"margin-bottom":"10px"}} key={item.id}>
                                <Card.Body>
                                    <Card.Title>{item.attributes.FileName}</Card.Title>
                                    <Card.Text>
                                        <JSONView id="json-pretty" src={item}></JSONView>
                                    </Card.Text>
                                </Card.Body>
                                <Card.Footer>
                                    <small className="text-muted">
                                        <a href={`https://http.testnet.fs.neo.org/${containerID}/${item.id}`} target="_none">{`https://http.testnet.fs.neo.org/${containerID}/${item.id}`}</a></small>
                                </Card.Footer>
                            </Card>
                        )
                    }
                )}
        </div>
    );
}

export default Objects;
