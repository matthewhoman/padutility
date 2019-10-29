import React, { Component } from 'react';
import ReturnNav from './ReturnNav';
import ScrollToTopBtn from './ScrollToTopBtn';

class Base extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        return (
            <div style={{paddingBottom:"50px"}}>
                <ReturnNav history={this.props.history} header={this.props.header} suppressBack suppressSearch/>
                <br></br>
                <div className="w3-theme-dark" style={{marginLeft: "20px", marginRight: "20px"}}>
                    {this.props.childComponent}
                </div>
                <br></br>
                <ScrollToTopBtn scrollStepInPx="50" delayInMs="16.66"/>
            </div>
        )
    }
}

export default Base;