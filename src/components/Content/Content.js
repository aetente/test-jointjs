import React, { useEffect, useRef, useState, createContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Paper from '../Paper/Paper';
import { contextValues, DiagramContext } from './context';
import { protocols } from './protocols';
import "./styles.css";

// import fetch
import { protocolActions, tokenActions } from '../../actions';

function Content() {

  let theProtocols = useSelector(state => state.protocols.protocols);
  let theTokens = useSelector(state => state.tokens.tokens);
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(protocolActions.getProtocols());
    dispatch(tokenActions.getTokens());
  }, [])

  return (
    <div className="hold-content">
      <div className="content">
        <DiagramContext.Provider value={contextValues}>
          <Paper
            protocols={theProtocols}
            tokens={theTokens}
          />
        </DiagramContext.Provider>
      </div>
    </div>
  );
}

export default Content;