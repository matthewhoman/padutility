import React, { Component } from 'react';
import ReturnNav from './ReturnNav';

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {

    }
    
    render() {
        return (
            <div>
                <ReturnNav history={this.props.history} header="" suppressBack suppressSearch/>
                <br></br>
                <div className="w3-theme-dark" style={{marginLeft: "20px"}}>
                    <div>
                        <img src={"images/me.png"} alt=""/>
                    </div>
                    <br></br>
                    <h1><b>About</b></h1>
                    <br></br>
                    <div>
                                 Lead Software Engineer at Cerner. 
                        <br></br>Specialize in creating web apps.
                        <br></br>Technologies: Java, Spring, React, NodeJS, JQuery and many more.  
                        <br></br>
                        <br></br>From Johnstown, Pennsylvania. 
                        <br></br>Graduated from Univerity of Pittsburgh Johnstown. 
                        <br></br>Bachelors in Computer Science and a minor in Math. 
                    </div>
                </div>
            </div>
        )
    }
}

export default Profile;