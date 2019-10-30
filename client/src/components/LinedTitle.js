import React, { Component } from 'react';

class LinedTitle extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        let margBottom = this.props.margBottom ? {marginBottom:"100px"} : {}
        return (
            <h1 className="headerTitle" style={margBottom}><span>{this.props.title}</span></h1>
        )
    }
}

export default LinedTitle;