import React, { Component } from 'react';
import Base from '../common/Base';
import LinedTitle from '../common/LinedTitle';

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {

    }
    
    render() {
        return (
            <Base header="Matthew&nbsp;Homan" 
                childComponent={
                    <div>
                        <LinedTitle title="Matthew&nbsp;Homan"></LinedTitle>
                        <h3 style={{textAlign:"center", color:"#9999"}}>Lead Software Engineer</h3>
                        <br></br>
                        <img src="../images/mesuit.jpg" alt="" 
                            style={{width:"100%", maxWidth:"200px", display:"block", marginLeft:"auto", marginRight:"auto"}} />
                        <br></br>
                        <br></br>
                        <div style={{display: "flex", justifyContent: "center"}}>    
                            <ul>
                                <li>Lead Software Engineer at Cerner.</li> 
                                <li>Specialize in creating web apps.</li> 
                                <li>Technologies: Java, Spring, React, NodeJS, JQuery and many more.</li> 
                                <li>From Johnstown, Pennsylvania.</li> 
                                <li>Graduated from Univerity of Pittsburgh Johnstown.</li> 
                                <li>Bachelors in Computer Science and a minor in Math.</li> 
                            </ul>
                        </div>
                    </div>
                }>
            </Base>
        )
    }
}

export default Profile;