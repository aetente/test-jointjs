import React, { useState, useContext, useEffect } from "react";
import UndoButton from "../UndoButton/UndoButton";
import HideSelect from "./HideSelect";
import SelectCellButtons from "./SelectCellsButtons";
import SelectInput from "./SelectInput";
import AutoLayoutButton from "./AutoLayoutButton";
import ImageDownloadButton from "./ImageDownloadButton";
import ShowFrameButton from "./ShowFrameButton";
import { DiagramContext } from '../Content/context';
import "./styles.css";

import { listToMatrix } from "../../utils/utils";

import caretDown from "./caret-down.svg"

function SelectCells(props) {

  let { recentlyUsedProtocols } = props;


  const [filterString, setFilterString] = useState("");
  const [category, setCategory] = useState("Protocols");
  const [isOpenRecentlyUsed, setIsOpenRecentlyUsed] = useState(true);
  const [isOpenAllProtocols, setIsOpenAllProtocols] = useState(true);

  const [isSelectOpen, setIsSelectOpen] = useState(true);

  const contextValues = useContext(DiagramContext);

  const actionsList = [
    {
      name: "Auto layout",
      component:
        <AutoLayoutButton
          layout={props.layout}
        />
    },
    {
      name: "Save as image",
      component:
        <ImageDownloadButton
          paper={props.paper}
          graph={props.graph}
          svgElement={props.svgElement}
          isFrameAdded={props.isFrameAdded}
          contextValues={contextValues}
        />
    },
    {
      name: "Show the frame",
      component:
        <ShowFrameButton
          drawFrame={props.drawFrame}
        />
    }
  ]

  const mapActions = (actions, isVisible) => {
    actions = actions.filter((action) => {
      return action.name.toLowerCase().includes(filterString.toLowerCase());
    });
    actions = listToMatrix(actions, 2);
    return (<div className={`mapped-protocols ${!isVisible && "hidden-protocols"}`}>

      {actions.map((aRow, i) => {
        return (
          <div key={`list-row-${i}`} className={`list-row`}>
            {aRow.map(action => (
              <div key={action.name} className="hold-protocol">
                {action.component}
                <div
                  className="protocol-title"
                >
                  {action.name}
                </div>
              </div>
            ))}
          </div>)
      })}
    </div>);
  }

  const mapProtocols = (protocols, isVisible) => {
    protocols = protocols.filter((protocol) => {
      return protocol.name.toLowerCase().includes(filterString.toLowerCase());
    });
    protocols = listToMatrix(protocols, 2);
    return (<div className={`mapped-protocols ${!isVisible && "hidden-protocols"}`}>

      {protocols.map((pRow, i) => {
        return (
          <div key={`list-row-${i}`} className={`list-row`}>
            {pRow.map(p => (
              <div key={p.name} className="hold-protocol">
                <div
                  className="draggable protocol"
                  color={p.backgroundColor}
                  bordercolor={p.borderColor}
                  protocolname={p.name}
                  image={p.image}
                  style={{
                    backgroundColor: p.backgroundColor,
                    border: `2px solid ${p.borderColor}`
                  }}
                  draggable
                >
                  {p.image && p.image !== "null" && <div className="protocol-content">
                    <img draggable={false} src={p.image} alt={p.name} />
                  </div>}
                </div>
                <div
                  className="protocol-title"
                >
                  {p.name}
                </div>
              </div>
            ))}
          </div>)
      })}
    </div>);
  }

  const handleShowFrame = () => {
    props.drawFrame();
  }


  useEffect(() => {

    return () => {
    };
  })

  // render() {

  let { protocols } = props;

  return (
    // <div className="hold-select-cells" >

    // <SelectCellButtons />
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
                  <div onClick={() => { setIsOpenRecentlyUsed(!isOpenRecentlyUsed) }} className="list-selection-title">
                    <img src={caretDown} alt="" />
                    <div>
                      Recently used
                    </div>
                  </div>
                </div>
                {mapProtocols(recentlyUsedProtocols, isOpenRecentlyUsed)}
                <div className="list-row list-section">
                  <div onClick={() => { setIsOpenAllProtocols(!isOpenAllProtocols) }} className="list-selection-title">
                    <img src={caretDown} alt="" />
                    <div>
                      All Protocols
                    </div>
                  </div>
                  <div onClick={() => { }} className="list-selection-title add-new">
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
          mapActions(actionsList, true)
            // (<>
            //   <div className="list-row">
            //     <AutoLayoutButton
            //       layout={props.layout}
            //     />

            //     <ImageDownloadButton
            //       paper={props.paper}
            //       graph={props.graph}
            //       svgElement={props.svgElement}
            //       isFrameAdded={props.isFrameAdded}
            //       contextValues={contextValues}
            //     />
            //   </div>
            //   <div className="list-row">
            //     <ShowFrameButton
            //       drawFrame={props.drawFrame}
            //     />
            //   </div>
            // </>)
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
