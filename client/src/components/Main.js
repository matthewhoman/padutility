import React, { Component } from 'react';
import Base from './Base';
import LinedTitle from './LinedTitle';

class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        return (
            <Base header="" 
                childComponent={
                    <div>
                        <LinedTitle title="" margBottom></LinedTitle>
                    </div>
                }>
            </Base>
        )
    }
}

export default Main;