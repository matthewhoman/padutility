import React, { Component } from 'react';

class LinedTitle extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        return (
            <h1 className="headerTitle"><span>{this.props.title}</span></h1>
        )
    }
}

export default LinedTitle;