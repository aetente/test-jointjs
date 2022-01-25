import React, { useEffect, useRef, useState } from 'react';
import Paper from '../Paper/Paper';
import SelectCells from '../SelectCells/SelectCells';
import "./styles.css";

function Test() {


  return (
    <div className="hold-content">
      <div className="content">
        <SelectCells />
        <Paper />
      </div>
    </div>
  );
}

export default Test;