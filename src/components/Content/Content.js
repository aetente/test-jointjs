import React, { useEffect, useRef, useState, createContext } from 'react';
import Paper from '../Paper/Paper';
import { contextValues, DiagramContext } from './context';
import { protocols } from './protocols';
import "./styles.css";

function Content() {


  return (
    <div className="hold-content">
      <div className="content">
        <DiagramContext.Provider value={contextValues}>
          <Paper
            protocols={protocols}
          />
        </DiagramContext.Provider>
      </div>
    </div>
  );
}

export default Content;