import React, { useState } from 'react';
import LinedTitle from '../common/LinedTitle';
import Base from '../common/Base';

const Contact = () => {
    const [formValues, setFormValues] = useState({});

    function handleChange(event) {
        formValues[event.target.name] = event.target.value;
        setFormValues(formValues);
    }

    function handleSubmit(event) {
        event.preventDefault();

        if(!formValues.Subject) {
            return;
        }

        let subject = escape(formValues.Subject).trim();
        let name = escape(formValues.Name).trim();
        let message = escape(formValues.Message).trim();
        
        let link = "mailto:matthew.h.homan@gmail.com"
                    + "?subject=" + subject + " - " + name + " - (From PS Contact)"
                    + "&body=" +  message;
    
        window.location.assign(link);
    }
    
    return (
        <Base header="Matthew&nbsp;Homan" 
            childComponent={
                <>
                    <LinedTitle title="Contact" margBottom></LinedTitle>
                    <form onSubmit={handleSubmit} 
                            style={{width:"100%",maxWidth:"500px",marginLeft:"auto",marginRight:"auto"}}
                                data-test='form'>
                        <label>Name*</label>
                        <input type="text" name="Name" placeholder="Name" required onChange={handleChange} 
                            data-test="nameInput"/>
                        <br/>
                        <br/>
                        <label>Subject*</label>
                        <input type="text" name="Subject" placeholder="Subject" required onChange={handleChange}
                            data-test="subjectInput"/>
                        <br/>
                        <br/>
                        <label>Message*</label>
                        <textarea type="text" name="Message" placeholder="Message" required onChange={handleChange}
                                style={{height:"200px", width:"100%"}} data-test="messageTextArea"/>
                        <br/>
                        <br/>
                        <input type="submit" value="Submit" data-test="submit" />
                    </form>
                </>
            }>
        </Base>
    )
}

export default Contact;