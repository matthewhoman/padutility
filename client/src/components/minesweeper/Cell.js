import React, { Component } from 'react';

class Cell extends Component {
    getValue() {
      const {value} = this.props;
      
      if (!value.isRevealed) {
        return this.props.value.isFlagged ? "🚩" : null;
      }
      if (value.isMine) {
        return "💣";
      }
      if (value.neighbor === 0) {
        return null;
      }
      return value.neighbor;
    }
  
    render() {
      const {value, onClick, cMenu, 
        onTouchStart, onTouchEnd} = this.props;
      let className =
        "cell" +
        (value.isRevealed ? "" : " hidden") +
        (value.isMine ? " is-mine" : "") +
        (value.isFlagged ? " is-flag" : "");
  
      return (
        <div
          onClick={onClick}
          className={className}
          onContextMenu={cMenu}
          onTouchStart={onTouchStart} 
          onTouchEnd={onTouchEnd}
        >
          {this.getValue()}
        </div>
      );
    }
}

export default Cell;
  
