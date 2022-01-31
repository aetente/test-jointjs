import React, { Component } from "react";
import UndoButton from "../UndoButton/UndoButton";
import "./styles.css";

class SelectCells extends Component {
  
  render() {
    return (
      <div className="hold-cells" >
        <div className="list-cells">
          <div className="list-row">
            <div className="draggable" draggable="true">Water</div>
            <div className="draggable" draggable="true">Coffee</div>
          </div>
          <div className="list-row">
            <div className="draggable" draggable="true">Milk</div>
            <div className="draggable" draggable="true">Tea</div>
          </div>
        </div>
        <UndoButton reverseGraph={this.props.reverseGraph} />
      </div>
    );
  }
}

export default SelectCells;
