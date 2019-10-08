import React, { Component } from 'react';

import ReturnNav from './ReturnNav';

class Contact extends Component {
    constructor(props) {
        super(props);
        this.state = {};

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {

    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    handleSubmit(event) {
        event.preventDefault();

        var subject = escape(this.state.Subject);
        var name = escape(this.state.Name);
        var message = escape(this.state.Message);
        var fail = false;
        
        if(!name){
            //$("#Name").css("background","red");
            //$("#Name").attr("title","Name is required");
            fail = true;
        } else {
            //$("#Name").css("background","");
        }

        if(!subject){
            //$("#Subject").css("background","red");
            //$("#Subject").attr("title","Subject is required");
            fail = true;
        } else {
            //$("#Subject").css("background","");
        }
        
        if(!message){
            //$("#Message").css("background","red");
            //$("#Message").attr("title","Message is required");
            fail = true;
        } else {
            //$("#Message").css("background","");
        }
        
        if(fail){return;}
        
        var link = "mailto:matthew.h.homan@gmail.com"
                    + "?subject=" + subject + " - " + name + " - (PS)"
                    + "&body=" +  message;
    
        window.location.href = link;
    }
    
    render() {
        return (
            <div style={{paddingBottom:"50px"}}>
                <ReturnNav history={this.props.history} header="" suppressBack suppressSearch/>
                <br></br>
                <div className="w3-theme-dark" style={{marginLeft: "20px", marginRight:"20px"}}>
                    <p><i className="fa fa-map-marker w3-xlarge"></i>&nbsp;&nbsp;&nbsp;Pennsylvania, US</p>
                    <p><i className="fa fa-envelope-o w3-xlarge"></i>&nbsp;&nbsp;&nbsp;Matthew.h.homan@gmail.com</p>
                    <form onSubmit={this.handleSubmit}>
                        <label style={{width:"100%", maxWidth:"500px"}}>Name
                            <input type="text" name="Name" onChange={this.handleChange}/>
                        </label>
                        <br />
                        <label style={{width:"100%", maxWidth:"500px"}}>Subject
                            <input type="text" name="Subject" onChange={this.handleChange}/>
                        </label>
                        <br />
                        <label style={{width:"100%", maxWidth:"500px"}}>Message
                            <input type="text" name="Message" onChange={this.handleChange}/>
                        </label>
                        <br />
                        <br />
                        <input type="submit" value="Submit" />
                    </form>
                </div>
            </div>
        )
    }
}

export default Contact;