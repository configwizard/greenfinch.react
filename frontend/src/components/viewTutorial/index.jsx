import React from "react";
// import JSONView from 'react-json-view';
import { CardGroup, Card } from 'react-bootstrap';

function TutorialView({containerList, onContainerSelection, viewMode}) {
    console.log("onContainerSelection", onContainerSelection)
    return (
        <CardGroup>
            <Card>
                <Card.Img variant="top" src="holder.js/100px160" />
                <Card.Body>
                    <Card.Title>Containers</Card.Title>
                    <Card.Text>
                        Containers are like folders (but much more powerful, however we will get to that 🙂 ))i)
                    </Card.Text>
                </Card.Body>
                <Card.Footer>
                    <small className="text-muted"><i className="far fa-ellipsis-h"/></small>
                </Card.Footer>
            </Card>
            <Card>
                <Card.Img variant="top" src="holder.js/100px160" />
                <Card.Body>
                    <Card.Title>Objects</Card.Title>
                    <Card.Text>
                       Objects are all your files and data.
                    </Card.Text>
                </Card.Body>
                <Card.Footer>
                    <small className="text-muted">
                        <div className="file-icon file-icon-lg" data-type="doc"></div></small>
                </Card.Footer>
            </Card>
            <Card>
                <Card.Img variant="top" src="holder.js/100px160" />
                <Card.Body>
                    <Card.Title>Wallet</Card.Title>
                    <Card.Text>
                        Your wallet covers the costs of storing your data. You will use your wallet to top up your credits so your files are always safe.
                    </Card.Text>
                </Card.Body>
                <Card.Footer>
                    <small className="text-muted">Your wallet is as important as a real wallet, don't share it, lend it, or give it to anyone!</small>
                </Card.Footer>
            </Card>
        </CardGroup>
    )
}

export default TutorialView;


