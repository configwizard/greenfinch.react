import React  from "react";
import JSONView from 'react-json-view';
import {retrieveFullFileSystem} from "../../manager/interactions";



class FileSystem extends React.Component {
    constructor(props) {
        super(props);

    }


    render() {
        return (
            <div>
                <div className="result" id="result">FileSystem 👇
                    <JSONView id="json-pretty" src={this.props.resp || []}></JSONView>
                </div>
            </div>
        );
    }
}

export default FileSystem;
