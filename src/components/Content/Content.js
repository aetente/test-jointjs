import React, { useEffect, useRef, useState, createContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Paper from '../Paper/Paper';
import EditProtocolsDesign from '../EditProtocolsDesign/EditProtocolsDesign';
import { contextValues, DiagramContext } from './context';
import "./styles.css";

// import fetch
import { protocolActions, tokenActions, uiActions } from '../../actions';

function Content() {

  let [isDesign, setIsDesign] = useState(false);

  let theProtocols = useSelector(state => state.protocols.protocols);
  let theTokens = useSelector(state => state.tokens.tokens);
  const dispatch = useDispatch();

  useEffect(() => {
    
    dispatch(protocolActions.getProtocols());
    dispatch(tokenActions.getTokens());

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const designValue = urlParams.get("design");
    const editAccessValue = urlParams.get("access");
    if ((editAccessValue && editAccessValue === process.env.REACT_APP_EDIT_ACCESS) || designValue) {
      dispatch(uiActions.setEditAccess(true));
    }
    setIsDesign(designValue)
  }, [])

  return (
      <div className="hold-content">
        {
          (isDesign && <EditProtocolsDesign
            protocols={theProtocols}
            tokens={theTokens}
          />) ||

          (
            <div className="content">
              <DiagramContext.Provider value={contextValues}>
                <Paper
                  protocols={theProtocols}
                  tokens={theTokens}
                />
              </DiagramContext.Provider>
            </div>)
        }
      </div>
  );
}

export default Content;