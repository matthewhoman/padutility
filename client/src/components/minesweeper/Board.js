import React, { Component } from 'react';
import Cell from './Cell';

let difficulties = [
  {value : 5},
  {value : 10, selected: true}, 
  {value : 15}, 
  {value : 20}
];
let gameStatus = "Game in progress";

class Board extends Component {
      constructor(props) {
        super(props);
        this.state = {
          boardData: this.initBoardData(this.props.height, this.props.width, 10),
          gameStatus: gameStatus,
          mineCount: 10,
          selectedMines: 10,
          difficulties: difficulties
        }
        this.changeDifficulty = this.changeDifficulty.bind(this);
        this.handleButtonPress = this.handleButtonPress.bind(this)
        this.handleButtonRelease = this.handleButtonRelease.bind(this)
    }

    changeDifficulty(event) {
      let numberOfMines = event.target.value;
      this.setState({
        mineCount : numberOfMines,
        selectedMines : numberOfMines
      })
      this.reset(numberOfMines);
    }

    reset(mines) {
      this.setState({
        boardData: this.initBoardData(this.props.height, 
                      this.props.width, mines ? mines : this.state.selectedMines),
        gameStatus: gameStatus,
        mineCount: mines ? mines : this.state.selectedMines,
        difficulties: difficulties
      })
    }

    // get mines
    getMines(data) {
        let mineArray = [];

        data.map(datarow => {
            datarow.map((dataitem) => {
                if (dataitem.isMine) {
                    mineArray.push(dataitem);
                }
            });
        });

        return mineArray;
    }

    // get Flags
    getFlags(data) {
        let mineArray = [];

        data.map(datarow => {
            datarow.map((dataitem) => {
                if (dataitem.isFlagged) {
                    mineArray.push(dataitem);
                }
            });
        });

        return mineArray;
    }

    // get Hidden cells
    getHidden(data) {
        let mineArray = [];

        data.map(datarow => {
            datarow.map((dataitem) => {
                if (!dataitem.isRevealed) {
                    mineArray.push(dataitem);
                }
            });
        });

        return mineArray;
    }

    // get random number given a dimension
    getRandomNumber(dimension) {
        // return Math.floor(Math.random() * dimension);
        return Math.floor((Math.random() * 1000) + 1) % dimension;
    }

    // Gets initial board data
    initBoardData(height, width, mines) {
        let data = this.createEmptyArray(height, width);
        data = this.plantMines(data, height, width, mines);
        data = this.getNeighbors(data, height, width);
        return data;
    }
    
    createEmptyArray(height, width) {
        let data = [];

        for (let i = 0; i < height; i++) {
            data.push([]);
            for (let j = 0; j < width; j++) {
                data[i][j] = {
                    x: i,
                    y: j,
                    isMine: false,
                    neighbor: 0,
                    isRevealed: false,
                    isEmpty: false,
                    isFlagged: false,
                };
            }
        }
        return data;
    }

    // plant mines on the board
    plantMines(data, height, width, mines) {
        let randomx, randomy, minesPlanted = 0;

        while (minesPlanted < mines) {
            randomx = this.getRandomNumber(width);
            randomy = this.getRandomNumber(height);
            if (!(data[randomx][randomy].isMine)) {
                data[randomx][randomy].isMine = true;
                minesPlanted++;
            }
        }

        return (data);
    }

    // get number of neighboring mines for each board cell
    getNeighbors(data, height, width) {
        let updatedData = data;

        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                if (data[i][j].isMine !== true) {
                    let mine = 0;
                    const area = this.traverseBoard(data[i][j].x, data[i][j].y, data);
                    area.map(value => {
                        if (value.isMine) {
                            mine++;
                        }
                    });
                    if (mine === 0) {
                        updatedData[i][j].isEmpty = true;
                    }
                    updatedData[i][j].neighbor = mine;
                }
            }
        }

        return (updatedData);
    };

    // looks for neighboring cells and returns them
    traverseBoard(x, y, data) {
        const el = [];

        //up
        if (x > 0) {
            el.push(data[x - 1][y]);
        }

        //down
        if (x < this.props.height - 1) {
            el.push(data[x + 1][y]);
        }

        //left
        if (y > 0) {
            el.push(data[x][y - 1]);
        }

        //right
        if (y < this.props.width - 1) {
            el.push(data[x][y + 1]);
        }

        // top left
        if (x > 0 && y > 0) {
            el.push(data[x - 1][y - 1]);
        }

        // top right
        if (x > 0 && y < this.props.width - 1) {
            el.push(data[x - 1][y + 1]);
        }

        // bottom right
        if (x < this.props.height - 1 && y < this.props.width - 1) {
            el.push(data[x + 1][y + 1]);
        }

        // bottom left
        if (x < this.props.height - 1 && y > 0) {
            el.push(data[x + 1][y - 1]);
        }

        return el;
    }

    // reveals the whole board
    revealBoard() {
        let updatedData = this.state.boardData;
        updatedData.map((datarow) => {
            datarow.map((dataitem) => {
                dataitem.isRevealed = true;
            });
        });
        this.setState({
            boardData: updatedData
        })
    }

    /* reveal logic for empty cell */
    revealEmpty(x, y, data) {
        let area = this.traverseBoard(x, y, data);
        area.map(value => {
            if (!value.isFlagged && !value.isRevealed && (value.isEmpty || !value.isMine)) {
                data[value.x][value.y].isRevealed = true;
                if (value.isEmpty) {
                    this.revealEmpty(value.x, value.y, data);
                }
            }
        });
        return data;

    }

    // Handle User Events

    _handleCellClick(x, y) {

        // check if revealed. return if true.
        if (this.state.boardData[x][y].isRevealed || this.state.boardData[x][y].isFlagged) return null;

        // check if mine. game over if true
        if (this.state.boardData[x][y].isMine) {
            this.setState({gameStatus: "You Lost."});
            this.revealBoard();
        }

        let updatedData = this.state.boardData;
        updatedData[x][y].isFlagged = false;
        updatedData[x][y].isRevealed = true;

        if (updatedData[x][y].isEmpty) {
            updatedData = this.revealEmpty(x, y, updatedData);
        }

        if (this.getHidden(updatedData).length === this.state.mineCount) {
            this.setState({mineCount: 0, gameStatus: "You Win."});
            this.revealBoard();
        }

        this.setState({
            boardData: updatedData,
            mineCount: this.state.selectedMines - this.getFlags(updatedData).length,
        });
    }

    _handleContextMenu(e, x, y) {
        e.preventDefault();
        e.stopPropagation();
        e.cancelBubble = true;
        e.returnValue = false;

        let updatedData = this.state.boardData;
        let mines = this.state.mineCount;

        // check if already revealed
        if (updatedData[x][y].isRevealed) return;

        if (updatedData[x][y].isFlagged) {
            updatedData[x][y].isFlagged = false;
            mines = mines + 1;
        } else {
            updatedData[x][y].isFlagged = true;
            mines = mines - 1;
        }

        if (mines === 0) {
            const mineArray = this.getMines(updatedData);
            const FlagArray = this.getFlags(updatedData);
            if (JSON.stringify(mineArray) === JSON.stringify(FlagArray)) {
                this.setState({mineCount: 0, gameStatus: "You Win."});
                this.revealBoard();
            }
        }

        this.setState({
            boardData: updatedData,
            mineCount: mines,
        });

        return false;
    }

    handleButtonPress (e, x, y) {
      this.buttonPressTimer = setTimeout(() => this._handleContextMenu(e, x, y), 500);
    }
  
    handleButtonRelease () {
      clearTimeout(this.buttonPressTimer);
    }

    renderBoard(data) {
        return data.map((datarow) => {
            return datarow.map((dataitem) => {
                return (
                    <div key={dataitem.x * datarow.length + dataitem.y}>
                        <Cell
                            onClick={() => this._handleCellClick(dataitem.x, dataitem.y)}
                            cMenu={(e) => this._handleContextMenu(e, dataitem.x, dataitem.y)}
                            onTouchStart={(e) => this.handleButtonPress(e, dataitem.x, dataitem.y)} 
                            onTouchEnd={this.handleButtonRelease} 
                            value={dataitem}
                        />
                        {(datarow[datarow.length - 1] === dataitem) ? <div className="clear" /> : ""}
                    </div>);
            })
        });

    }

  render() {
        return (
            <div className="board">
                <div className="game-info">
                    <h1 className="info">{this.state.gameStatus}</h1>
                    <h3 style={{display:"inline-block"}}>Difficulty:&nbsp;&nbsp;</h3>
                    <select onChange={this.changeDifficulty} style={{height:"22px", verticalAlign:"text-bottom"}}>
                    { 
                        this.state.difficulties.map(item => <option key={item.value} 
                            value={item.value} selected={item.selected}>{item.value}</option>)
                    }
                    </select>
                    <span className="info">Mines remaining: {this.state.mineCount}</span>
                </div>
                <div className="cells">
                {
                    this.renderBoard(this.state.boardData)
                }
                <button onClick={() => this.reset()}>Restart</button>
                </div>
            </div>
        );
    }
}

export default Board;