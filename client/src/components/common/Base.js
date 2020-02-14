import React, { Component } from 'react';
import ReturnNav from '../navigation/ReturnNav';
import ScrollToTopBtn from './ScrollToTopBtn';

class Base extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        let style = this.props.suppressMargins ? {} : {
            marginLeft: "15px", marginRight: "15px"
        }
        return (
            <div style={{paddingBottom:"50px"}}>
                <ReturnNav history={this.props.history} header={this.props.header} suppressBack suppressSearch/>
                <br></br>
                <div className="w3-theme-dark" style={style}>
                    {this.props.childComponent}
                </div>
                <br></br>
                <ScrollToTopBtn scrollStepInPx="50" delayInMs=".01"/>
            </div>
        )
    }
}

export default Base;