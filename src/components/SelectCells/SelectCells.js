import React, { useState, useContext, useEffect } from "react";
import UndoButton from "../UndoButton/UndoButton";
import HideSelect from "./HideSelect";
import SelectCellButtons from "./SelectCellsButtons";
import SelectInput from "./SelectInput";
import { DiagramContext } from '../Content/context';
import { unicodeUnEscape } from "../../utils/utils";
import "./styles.css";

import caretDown from "./caret-down.svg"

function SelectCells(props) {

  let { recentlyUsedProtocols } = props;


  const [filterString, setFilterString] = useState("");
  const [category, setCategory] = useState("Protocols");
  const [isOpenRecentlyUsed, setIsOpenRecentlyUsed] = useState(true);
  const [isOpenAllProtocols, setIsOpenAllProtocols] = useState(true);

  const [isSelectOpen, setIsSelectOpen] = useState(true);

  const contextValues = useContext(DiagramContext);

  useEffect(() => {

    return () => {
    };
  })

  const listToMatrix = (list, elementsPerSubArray) => {
    let matrix = [], i, k;

    for (i = 0, k = -1; i < list.length; i++) {
      if (i % elementsPerSubArray === 0) {
        k++;
        matrix[k] = [];
      }

      matrix[k].push(list[i]);
    }

    return matrix;
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

  const cropImageFromCanvas = (ctx, w, h) => {
    var canvas = ctx.canvas,
      pix = { x: [], y: [] },
      imageData = ctx.getImageData(0, 0, w, h),
      x, y, index;

    for (y = 0; y < h; y++) {
      for (x = 0; x < w; x++) {
        index = (y * w + x) * 4;
        if (imageData.data[index + 3] > 0) {
          pix.x.push(x);
          pix.y.push(y);
        }
      }
    }
    pix.x.sort(function (a, b) { return a - b });
    pix.y.sort(function (a, b) { return a - b });
    var n = pix.x.length - 1;

    w = 1 + pix.x[n] - pix.x[0];
    h = 1 + pix.y[n] - pix.y[0];
    var cut = ctx.getImageData(pix.x[0], pix.y[0], w, h);

    canvas.width = w;
    canvas.height = h;
    ctx.putImageData(cut, 0, 0);

    return ctx;

    // var image = canvas.toDataURL();  //open cropped image in a new window
    // var win=window.open(image, '_blank');
    // win.focus();
  }

  const handleImageDownload = () => {

    let { paper, graph, svgElement, drawFrame, isFrameAdded } = props;

    paper.translate(0, 0);

    let theElements = graph.getElements();
    let framePosition = { x: 0, y: 0 }
    if (isFrameAdded) {
      theElements.forEach(el => {
        if (el.attributes.typeOfCell === "frame") {
          // el.attr("body/stroke", "#777E90");
          el.attr(".l/stroke", "rgba(0,0,0,0)");
          el.attr(".t/stroke", "rgba(0,0,0,0)");
          el.attr(".r/stroke", "rgba(0,0,0,0)");
          el.attr(".b/stroke", "rgba(0,0,0,0)");
          framePosition = el.attributes.position;
        }
      });
      if (framePosition.x < 0 || framePosition.y < 0) {
        // paper.setOrigin(framePosition.x + 918,framePosition.y + 532)
        let allElements = graph.getElements();
        allElements.forEach(el => {
          el.translate(el.position.x - framePosition.x, el.position.y - framePosition.y);
        })
      }

    } else {

      // first we layout it all just with equal paddings
      let leftPadd = 35;
      let rightPadd = 35;
      paper.scaleContentToFit({
        padding: {
          top: 35,
          left: leftPadd,
          right: rightPadd,
          bottom: 35
        },
        fittingBBox: {
          x: 0,
          y: 0,
          width: contextValues.frameDimensions.w,
          height: contextValues.frameDimensions.h
        }
      });

      // then we do it the sacond time, to center out the graph in the image
      paper.translate(0, 0);
      let newWidth = graph.getBBox().width * paper.scale().sx;
      if (contextValues.frameDimensions.w > newWidth) {
        leftPadd = (contextValues.frameDimensions.w - newWidth) / 2;
        rightPadd = (contextValues.frameDimensions.w - newWidth) / 2;
      }

      paper.scaleContentToFit({
        padding: {
          top: 35,
          left: leftPadd,
          right: rightPadd,
          bottom: 35
        },
        fittingBBox: {
          x: 0,
          y: 0,
          width: contextValues.frameDimensions.w,
          height: contextValues.frameDimensions.h
        }
      });
    }

    //TODO remove setTimeout, sync it
    setTimeout(() => {
      let svgElementSvg = svgElement.children[2];
      let s = new XMLSerializer().serializeToString(svgElementSvg);
      let encodedData = window.btoa(unicodeUnEscape(encodeURIComponent(s)));

      let canvas = document.createElement('canvas');
      let ctx = canvas.getContext('2d');
      let imgSrc = 'data:image/svg+xml;base64,' + encodedData;

      let image = document.createElement('img');
      image.width = 9999;
      image.height = 9999;
      canvas.width = 9999;
      canvas.height = 9999;
      canvas.setAttributeNS("http://www.w3.org/XML/1998/namespace", "xml:space", "preserve");

      let scaleValue = paper.scale().sx;

      image.onload = () => {
        ctx.fillStyle = "#f6f6f6"
        ctx.fillRect(0, 0, contextValues.imageSize.w, contextValues.imageSize.h);

        let r = scaleValue * (contextValues.imageSize.w / contextValues.frameDimensions.w),
          cw = 10 * scaleValue * (contextValues.imageSize.w / contextValues.frameDimensions.w),
          ch = 10 * scaleValue * (contextValues.imageSize.w / contextValues.frameDimensions.w);

        // we need to draw the grid on our own, because it is not parsed for some reason
        // the new grid also needs to know, where the content was placed
        // because otherwise the grid would be as if in the wrong place
        let rectOffset = {
          x: Math.round(paper.translate().tx * scaleValue) % 10,
          y: Math.round(paper.translate().ty * scaleValue) % 10
        }

        for (let x = 1; x < contextValues.imageSize.w; x += cw) {
          for (let y = 1; y < contextValues.imageSize.h; y += ch) {
            ctx.fillStyle = "rgba(170,170,170,0.5)";
            let rectPos = {
              x: x - r / 2 + rectOffset.x,
              y: y - r / 2 + rectOffset.y
            }
            ctx.fillRect(rectPos.x, rectPos.y, r, r);
          }
        }
        // ctx.drawImage(image, 0, 0);

        let sourcePosition = {
          x: framePosition.x,
          y: framePosition.y
        }
        let sourceDimensions = {
          w: contextValues.frameDimensions.w,
          h: contextValues.frameDimensions.h
        }

        if (isFrameAdded) {
          sourcePosition.x *= scaleValue;
          sourcePosition.y *= scaleValue;
          sourceDimensions.w *= scaleValue;
          sourceDimensions.h *= scaleValue;
        }

        ctx.drawImage(image, sourcePosition.x, sourcePosition.y, sourceDimensions.w, sourceDimensions.h, 0, 0, contextValues.imageSize.w, contextValues.imageSize.h);
        ctx = cropImageFromCanvas(ctx, contextValues.imageSize.w, contextValues.imageSize.h);
        // svgElementSvg.parentElement.parentElement.parentElement.parentElement.append(ctx.canvas)


        // TODO may be there is a better way to save the image other than to create link, click it and delete the link
        let png = canvas.toDataURL(); // default png
        let link = document.createElement('a');
        link.download = "a";
        link.style.opacity = "0";
        svgElementSvg.append(link);
        link.href = png;
        link.click();
        link.remove();


        if (isFrameAdded) {
          theElements.forEach(el => {
            if (el.attributes.typeOfCell === "frame") {
              el.attr(".l/stroke", "#777E90");
              el.attr(".t/stroke", "#777E90");
              el.attr(".r/stroke", "#777E90");
              el.attr(".b/stroke", "#777E90");
              // el.attr("body/stroke", "rgba(0,0,0,0)");
            }
          })
        }
      }
      image.src = imgSrc;

    }, 500)

  }

  const handleShowFrame = () => {
    props.drawFrame();
  }

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
                  <div onClick={() => {  }} className="list-selection-title add-new">
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
            (<>
              <div className="list-row">
                <button className="select-action-button" onClick={() => {
                  props.layout();
                }}>Auto layout</button>
                
                <button className="select-action-button" onClick={handleImageDownload}>Save as image</button>
              </div>
              <div className="list-row">
              </div>
              <div className="list-row">
                <button className="select-action-button" onClick={handleShowFrame}>Show the frame</button>
              </div>
            </>)
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
