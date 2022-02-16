import React, { useEffect, useRef, useState, createContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Paper from '../Paper/Paper';
import { contextValues, DiagramContext } from './context';
import { protocols } from './protocols';
import "./styles.css";

// import fetch
import { protocolActions } from '../../actions';

function Content() {

  let theProtocols = useSelector(state => state.protocols.protocols)
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(protocolActions.getProtocols());
  }, [])

  return (
    <div className="hold-content">
      <div className="content">
        <DiagramContext.Provider value={contextValues}>
          <Paper
            protocols={theProtocols}
          />
        </DiagramContext.Provider>
      </div>
    </div>
  );
}

export default Content;