import React, { Component } from 'react';
import ReturnNav from './ReturnNav';

class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        return (
            <div>
                <ReturnNav history={this.props.history} header="" suppressBack/>
            </div>
        )
    }
}

export default Main;