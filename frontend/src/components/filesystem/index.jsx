import React  from "react";
import JSONView from 'react-json-view';
import {retrieveFullFileSystem} from "../../manager/interactions";



class FileSystem extends React.Component {
    constructor(props) {
        super(props);

    }
    // async componentDidMount() {
    //     const resp = await retrieveFullFileSystem()
    //     this.setState({resp})
    // }

    render() {
        // console.dir("fs ==", this.fs)
        return (
            <div>
                <div className="result" id="result">FileSystem 👇
                    <JSONView id="json-pretty" src={this.props.resp}></JSONView>
                </div>
            </div>
        );
    }
}

export default FileSystem;
