import React, { Component } from 'react';
import Board from './Board';
import LinedTitle from '../LinedTitle';
import Base from '../Base';

import './Game.scss';

class Game extends Component {
    constructor(props) {
        super(props);
        this.state = {
            height: 8,
            width: 8
        }
    }

    render() {
        const { 
            height, 
            width
        } = this.state;

        return (
            <Base suppressMargins header="Matthew&nbsp;Homan" 
                childComponent={
                    <div>
                        <LinedTitle title="Mine&nbsp;Sweeper" margBottom></LinedTitle>
                        <div className="game">
                            <Board height={height} width={width}/>
                        </div>
                    </div>
                }>
            </Base>
        );
    }
}

export default Game;