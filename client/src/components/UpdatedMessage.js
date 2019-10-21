import React, { Component } from 'react';
import Alert from 'react-bootstrap/Alert';

class UpdatedMessage extends Component {

    constructor(props) {
        super(props);
        this.state = {};
        this.handleAlertClose = this.handleAlertClose.bind(this);
    }

    handleAlertClose() {
        this.setState(() => ({
            alertClosed: false 
        }))
    }

    UNSAFE_componentWillReceiveProps() {
        this.setState(() => ({
            alertClosed: true 
        }))
    }

    render() {
        let updated = this.props.updated;
        let msg =  this.props.customMsg ?  this.props.customMsg : (updated ? 'Updated!' : !updated ? 'Failed to update!' : '');
        let variant = updated ? "success" : "danger";

        return (
            updated !== undefined ?
                <Alert show={this.state.alertClosed} dismissible variant={variant} style={{margin:"0px"}} onClose={this.handleAlertClose}>
                    <div>{msg}</div>
                </Alert>
            :
            <div></div>
        )
    }

}

export default UpdatedMessage;