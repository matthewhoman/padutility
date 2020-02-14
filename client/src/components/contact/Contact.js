import React, { Component } from 'react';
import LinedTitle from '../common/LinedTitle';
import Base from '../common/Base';

class Contact extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };

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

        let subject = escape(this.state.Subject).trim();
        let name = escape(this.state.Name).trim();
        let message = escape(this.state.Message).trim();
        
        let link = "mailto:matthew.h.homan@gmail.com"
                    + "?subject=" + subject + " - " + name + " - (From PS Contact)"
                    + "&body=" +  message;
    
        window.location.href = link;
    }
    
    render() {
        return (
            <Base header="Matthew&nbsp;Homan" 
                childComponent={
                    <div>
                        <LinedTitle title="Contact" margBottom></LinedTitle>
                        <form onSubmit={this.handleSubmit} 
                                style={{width:"100%",maxWidth:"500px",marginLeft:"auto",marginRight:"auto"}}>
                            <label>Name*</label>
                            <input type="text" name="Name" placeHolder="Name" required onChange={this.handleChange}/>
                            <br/>
                            <br/>
                            <label>Subject*</label>
                            <input type="text" name="Subject" placeHolder="Subject" required onChange={this.handleChange}/>
                            <br/>
                            <br/>
                            <label>Message*</label>
                            <textarea type="text" name="Message" placeHolder="Message" required onChange={this.handleChange}
                                    style={{height:"200px", width:"100%"}}/>
                            <br/>
                            <br/>
                            <input type="submit" value="Submit" />
                        </form>
                    </div>
                }>
            </Base>
        )
    }
}

export default Contact;