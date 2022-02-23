import React, { useState, useContext, useEffect } from "react";
import UndoButton from "../UndoButton/UndoButton";
import HideSelect from "./HideSelect";
import SelectCellButtons from "./SelectCellsButtons";
import SelectInput from "./SelectInput";
import AutoLayoutButton from "./AutoLayoutButton";
import ImageDownloadButton from "./ImageDownloadButton";
import ShowFrameButton from "./ShowFrameButton";
import LoopActionButton from "./LoopActionButton";
import MergeButton from "./MergeButton";
import { DiagramContext } from '../Content/context';
import "./styles.css";

import { listToMatrix } from "../../utils/utils";

import caretDown from "../../assets/drawings/caret-down.svg";

function SelectCells(props) {

  let {
    recentlyUsedProtocols,
    recentlyUsedActions,
    recentlyUsedTokens,
    addRecentlyUsedAction,
    setActiveProtocol,
    setOpenModalWindow,
    addEmptyNode,
    addEmptyToken
  } = props;


  const [filterString, setFilterString] = useState("");
  const [category, setCategory] = useState("Protocols");
  const [isOpenRecentlyUsedProtocols, setIsOpenRecentlyUsedProtocols] = useState(true);
  const [isOpenAllProtocols, setIsOpenAllProtocols] = useState(true);
  const [isOpenRecentlyUsedActions, setIsOpenRecentlyUsedActions] = useState(true);
  const [isOpenAllActions, setIsOpenAllActions] = useState(true);
  const [isOpenRecentlyUsedTokens, setIsOpenRecentlyUsedTokens] = useState(true);
  const [isOpenAllTokens, setIsOpenAllTokens] = useState(true);

  const [isSelectOpen, setIsSelectOpen] = useState(true);

  const contextValues = useContext(DiagramContext);

  const actionsList = [
    {
      name: "Auto deploy",
      component:
        <AutoLayoutButton
          actionName={"Auto deploy"}
          layout={props.layout}
          addRecentlyUsedAction={addRecentlyUsedAction}
        />
    },
    {
      name: "Save as image",
      component:
        <ImageDownloadButton
          actionName={"Save as image"}
          paper={props.paper}
          graph={props.graph}
          svgElement={props.svgElement}
          isFrameAdded={props.isFrameAdded}
          contextValues={contextValues}
          addRecentlyUsedAction={addRecentlyUsedAction}
        />
    },
    {
      name: "Show the frame",
      component:
        <ShowFrameButton
          actionName={"Show the frame"}
          drawFrame={props.drawFrame}
          addRecentlyUsedAction={addRecentlyUsedAction}
        />
    },
    {
      name: "Loop",
      component:
        <LoopActionButton
          actionName={"Loop"}
          createCircle={props.createCircle}
          addRecentlyUsedAction={addRecentlyUsedAction}
        />
    },
    {
      name: "Merge",
      component:
        <MergeButton
          actionName={"Merge"}
          mergeAction={props.mergeAction}
          addRecentlyUsedAction={addRecentlyUsedAction}
        />
    }
  ]

  const mapActions = (actions, isVisible, isRecentlyUsed) => {
    if (isRecentlyUsed) {
      let originalActions = actionsList;
      actions = actions.map((action) => {
        let foundAction = null;
        for (let i = 0; i < originalActions.length; i++) {
          if (action.name === originalActions[i].name) {
            foundAction = originalActions[i];
            break;
          }
        }
        return foundAction
      })
    }
    actions = actions.filter((action) => {
      return action && action.name.toLowerCase().includes(filterString.toLowerCase());
    });
    actions = listToMatrix(actions, 2);
    return (<div className={`mapped-menu-options ${!isVisible && "hidden-menu-options"}`}>

      {actions.map((aRow, i) => {
        return (
          <div key={`list-row-${i}`} className={`list-row`}>
            {aRow.map(action => (
              <div key={action.name} className="hold-menu-option hold-action-option">
                {action.component}
                <div
                  className="menu-option-title"
                >
                  {action.name}
                </div>
              </div>
            ))}
          </div>)
      })}
    </div>);
  }

  const mapProtocols = (protocols, isVisible, isRecentlyUsed) => {
    if (isRecentlyUsed) {
      let originalProtocols = props.protocols;
      protocols = protocols.map((protocol) => {
        let foundProtocol = null;
        for (let i = 0; i < originalProtocols.length; i++) {
          if (protocol.id === originalProtocols[i].id) {
            foundProtocol = originalProtocols[i];
            break;
          }
        }
        return foundProtocol
      })
    }
    protocols = protocols.filter((protocol) => {
      return protocol && protocol.name.toLowerCase().includes(filterString.toLowerCase());
    });
    protocols = listToMatrix(protocols, 2);
    return (<div className={`mapped-menu-options ${!isVisible && "hidden-menu-options"}`}>

      {protocols.map((pRow, i) => {
        return (
          <div key={`list-row-${i}`} className={`list-row`}>
            {pRow.map(p => (
              <div key={p.id} className="hold-menu-option">
                <div
                  className="draggable protocol"
                  color={p.backgroundColor}
                  bordercolor={p.borderColor}
                  protocolname={p.name}
                  protocolid={p.id}
                  protocolurl={p.url}
                  image={p.image}
                  style={{
                    backgroundColor: p.backgroundColor,
                    border: `2px solid ${p.borderColor}`
                  }}
                  draggable
                >
                  {p.image && p.image !== "null" && <div className="menu-option-content">
                    <img draggable={false} src={p.image} alt={p.name} />
                  </div>}
                </div>
                <div
                  className="menu-option-title"
                >
                  {p.name}
                </div>
              </div>
            ))}
          </div>)
      })}
    </div>);
  }

  const mapTokens = (tokens, isVisible, isRecentlyUsed) => {
    if (isRecentlyUsed) {
      let originalTokens = props.tokens;
      tokens = tokens.map((token) => {
        let foundToken = null;
        for (let i = 0; i < originalTokens.length; i++) {
          if (token.id === originalTokens[i].id) {
            foundToken = originalTokens[i];
            break;
          }
        }
        return foundToken
      })
    }
    tokens = tokens.filter((token) => {
      return token && token.name.toLowerCase().includes(filterString.toLowerCase());
    });
    tokens = listToMatrix(tokens, 2);
    return (<div className={`mapped-menu-options ${!isVisible && "hidden-menu-options"}`}>

      {tokens.map((tRow, i) => {
        return (
          <div key={`list-row-${i}`} className={`list-row`}>
            {tRow.map(t => (
              <div key={t.id} className="hold-menu-option hold-token-option">
                <div
                  className="draggable select-token"
                  color={t.backgroundColor}
                  bordercolor={t.borderColor}
                  tokenname={t.name}
                  tokenid={t.id}
                  tokenurl={t.url}
                  image={t.image}
                  draggable
                >
                  {t.image && t.image !== "null" && <div className="menu-option-content no-transform">
                    <img draggable={false} src={t.image} alt={t.name} />
                  </div>}
                </div>
                <div
                  className="menu-option-title"
                >
                  {t.name}
                </div>
              </div>
            ))}
          </div>)
      })}
    </div>);
  }


  useEffect(() => {

    return () => {
    };
  }, [])

  let { protocols, tokens } = props;

  return (
    <div className={`hold-cells ${!isSelectOpen && "hide-cells"}`} >
      <div className={`list-cells`}>
        <div className="list-row">
          <SelectCellButtons
            setCategory={setCategory}
          />
        </div>
        <div className="list-row">
          <SelectInput
            setFilterString={setFilterString}
          />
        </div>
        {
          (category === "Protocols" &&

            (
              <div>
                <div className="list-row list-section">
                  <div onClick={() => { setIsOpenRecentlyUsedProtocols(!isOpenRecentlyUsedProtocols) }} className="list-selection-title">
                    <img src={caretDown} alt="" />
                    <div>
                      Recently used
                    </div>
                  </div>
                </div>
                {mapProtocols(recentlyUsedProtocols, isOpenRecentlyUsedProtocols, true)}
                <div className="list-row list-section">
                  <div onClick={() => { setIsOpenAllProtocols(!isOpenAllProtocols) }} className="list-selection-title">
                    <img src={caretDown} alt="" />
                    <div>
                      All Protocols
                    </div>
                  </div>
                  <div onClick={() => {
                    addEmptyNode();
                    // setActiveProtocol({ name: "" });
                    setOpenModalWindow(true);
                  }} className="list-selection-title add-new">
                    <div>
                      + Add New
                    </div>
                  </div>
                </div>
                {mapProtocols(protocols, isOpenAllProtocols)}
              </div>
            )

          ) ||
          (category === "Actions" &&

            <div>
              <div className="list-row list-section">
                <div onClick={() => { setIsOpenRecentlyUsedActions(!isOpenRecentlyUsedActions) }} className="list-selection-title">
                  <img src={caretDown} alt="" />
                  <div>
                    Recently used
                  </div>
                </div>
              </div>
              {mapActions(recentlyUsedActions, isOpenRecentlyUsedActions, true)}
              <div className="list-row list-section">
                <div onClick={() => { setIsOpenAllActions(!isOpenAllActions) }} className="list-selection-title">
                  <img src={caretDown} alt="" />
                  <div>
                    All Actions
                  </div>
                </div>
              </div>
              {mapActions(actionsList, isOpenAllActions)}
            </div>
            // mapActions(actionsList, true)
          ) ||
          (category === "Tokens" &&

            <div>
              <div className="list-row list-section">
                <div onClick={() => { setIsOpenRecentlyUsedTokens(!isOpenRecentlyUsedTokens) }} className="list-selection-title">
                  <img src={caretDown} alt="" />
                  <div>
                    Recently used
                  </div>
                </div>
              </div>
              {mapTokens(recentlyUsedTokens, isOpenRecentlyUsedTokens, true)}
              <div className="list-row list-section">
                <div onClick={() => { setIsOpenAllTokens(!isOpenAllTokens) }} className="list-selection-title">
                  <img src={caretDown} alt="" />
                  <div>
                    All Tokens
                  </div>
                </div>

                <div onClick={() => {
                  addEmptyToken();
                  // setActiveProtocol({ name: "" });
                  setOpenModalWindow(true);
                }} className="list-selection-title add-new">
                  <div>
                    + Add New
                  </div>
                </div>
              </div>
              {mapTokens(tokens, isOpenAllTokens)}
            </div>
            // mapActions(actionsList, true)
          )
        }
      </div>
      <UndoButton reverseGraph={props.reverseGraph} />
      <HideSelect
        isSelectOpen={isSelectOpen}
        setIsSelectOpen={setIsSelectOpen}
      />
    </div>
    // </div>
  );
  // }
}

export default SelectCells;
