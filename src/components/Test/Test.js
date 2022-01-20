import React, { useEffect, useRef } from 'react';
import Paper from '../Paper/Paper';
import SelectCells from '../SelectCells/SelectCells';
import "./styles.css";

function Test() {
  return (
    <div className="hold-content">
      <div className="content-title" >New Strategy</div>
      <div className="content">
        <SelectCells />
        <Paper />
      </div>
    </div>
  );
}

export default Test;