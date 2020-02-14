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

        let subject = escape(formValues.Subject).trim();
        let name = escape(formValues.Name).trim();
        let message = escape(formValues.Message).trim();
        
        let link = "mailto:matthew.h.homan@gmail.com"
                    + "?subject=" + subject + " - " + name + " - (From PS Contact)"
                    + "&body=" +  message;
    
        window.location.href = link;
    }
    
    return (
        <Base header="Matthew&nbsp;Homan" 
            childComponent={
                <div>
                    <LinedTitle title="Contact" margBottom></LinedTitle>
                    <form onSubmit={handleSubmit} 
                            style={{width:"100%",maxWidth:"500px",marginLeft:"auto",marginRight:"auto"}}>
                        <label>Name*</label>
                        <input type="text" name="Name" placeHolder="Name" required onChange={handleChange}/>
                        <br/>
                        <br/>
                        <label>Subject*</label>
                        <input type="text" name="Subject" placeHolder="Subject" required onChange={handleChange}/>
                        <br/>
                        <br/>
                        <label>Message*</label>
                        <textarea type="text" name="Message" placeHolder="Message" required onChange={handleChange}
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

export default Contact;