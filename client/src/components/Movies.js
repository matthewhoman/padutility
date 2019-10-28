import React, { Component } from 'react';
import ReturnNav from './ReturnNav';

class Movies extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {

    }
    
    render() {
        return (
            <div style={{paddingBottom:"50px"}}>
                <ReturnNav history={this.props.history} header="Matthew&nbsp;Homan" suppressBack suppressSearch/>
                
            </div>
        )
    }
}

export default Movies;