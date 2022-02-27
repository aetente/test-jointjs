import React, { useEffect, useRef, useState, createContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Paper from '../Paper/Paper';
import EditProtocolsDesign from '../EditProtocolsDesign/EditProtocolsDesign';
import { contextValues, DiagramContext } from './context';
import "./styles.css";

// import fetch
import { protocolActions, tokenActions } from '../../actions';

function Content() {

  let [isEdit, setIsEdit] = useState(false);

  let theProtocols = useSelector(state => state.protocols.protocols);
  let theTokens = useSelector(state => state.tokens.tokens);
  const dispatch = useDispatch();

  const initClient = () => {
    window.gapi.client.init({
        apiKey: process.env.REACT_APP_API_KEY,
        clientId: process.env.REACT_APP_CLIENT_ID,
        // clientEmail: process.env.REACT_APP_CLIENT_EMAIL,
        // privateKey: process.env.REACT_APP_PRIVATE_KEY,
        discoveryDocs: ["https://sheets.googleapis.com/$discovery/rest?version=v4"],
        scope: "https://www.googleapis.com/auth/spreadsheets"
    }).then(() => {
      window.gapi.auth2.getAuthInstance().signIn();
      dispatch(protocolActions.getProtocols());
      dispatch(tokenActions.getTokens());
    }, (error) => {
        console.log(error)
    });
}

  useEffect(() => {
    // window.gapi.load('client:auth2', async () => {await initClient()});
    
    dispatch(protocolActions.getProtocols());
    dispatch(tokenActions.getTokens());

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const editValue = urlParams.get("edit");
    setIsEdit(editValue)
  }, [])

  return (
      <div className="hold-content">
        {
          (isEdit && <EditProtocolsDesign
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