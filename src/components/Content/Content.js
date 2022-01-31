import React, { useEffect, useRef, useState, createContext } from 'react';
import Paper from '../Paper/Paper';
import SelectCells from '../SelectCells/SelectCells';
import "./styles.css";

const DiagramContext = createContext({});

function Content() {


  return (
    <div className="hold-content">
      <div className="content">
        <Paper />
      </div>
    </div>
  );
}

export default Content;