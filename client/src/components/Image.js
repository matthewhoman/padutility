import React, { Component } from 'react';

class Image extends Component {
    constructor(props) {
        super(props);
        this.state = {
            img: '',
            id: this.props.id
        };
    }

    componentDidMount() {
        fetch('/imgData?id=' + this.props.id)
        .then((res) => res.json())
        .then((imgData) => {
            var base64Flag = 'data:image/jpeg;base64,';
            this.setState({
                img: base64Flag + imgData
            })
        })
    }

    render() {
        const {img} = this.state;
        return (
            <img
                src={img}
                alt={this.props.alt}
                title={this.props.title}
                className={this.props.className}/>
        )
    }
}

export default Image;