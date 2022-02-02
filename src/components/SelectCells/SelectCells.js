import React, { Component } from "react";
import UndoButton from "../UndoButton/UndoButton";
import "./styles.css";

class SelectCells extends Component {
  
  render() {
    return (
      <div className="hold-cells" >
        <div className="list-cells">
          <div className="list-row">
            <div className="draggable protocol" color="#DBD9D2" draggable="true">Water</div>
            <div className="draggable protocol" draggable="true">Coffee</div>
          </div>
          <div className="list-row">
            <div className="draggable protocol" draggable="true">Milk</div>
            <div className="draggable protocol" draggable="true">Tea</div>
          </div>
          <div className="list-row">
            <button className="temp-auto-layout-button" onClick={() => {
              this.props.layout();
            }}>Auto layout</button>
          </div>
        </div>
        <UndoButton reverseGraph={this.props.reverseGraph} />
      </div>
    );
  }
}

export default SelectCells;
