import React  from "react";
import JSONView from 'react-json-view';
import {Card} from "react-bootstrap";

function Containers({containers, onSelected}) {
    console.log("containerList", containers)
    return (
        <div className="result" id="result">
            <h2 className="atmTitle">Containers</h2>
                {containers.map((item) =>
                    <Card style={{"margin-bottom":"10px"}} key={item.id}>
                        <Card.Body>
                            <Card.Title>{item.attributes.name}</Card.Title>
                            <Card.Text>
                                <JSONView onSelect={(select)=>{onSelected(select)}} id="json-pretty" src={item}></JSONView>
                            </Card.Text>
                        </Card.Body>
                    </Card>
                )}
        </div>
    );
}

export default Containers;
