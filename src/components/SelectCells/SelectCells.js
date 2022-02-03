import React, { Component } from "react";
import UndoButton from "../UndoButton/UndoButton";
import SelectCellButtons from "./SelectCellsButtons";
import { unicodeUnEscape } from "../../utils/utils";
import "./styles.css";

class SelectCells extends Component {

  constructor() {
    super();
    this.state = {
      imageBlobUrl: null
    };
    this.listToMatrix = this.listToMatrix.bind(this);
    this.mapProtocols = this.mapProtocols.bind(this);
    this.handleImageDownload = this.handleImageDownload.bind(this);
  }

  listToMatrix(list, elementsPerSubArray) {
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

  mapProtocols(protocols) {
    protocols = this.listToMatrix(protocols.protocols, 2);
    return protocols.map((pRow, i) => {
      return (
        <div key={`list-row-${i}`} className="list-row">
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
                {p.image && <div className="protocol-content">
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
    })
  }

  handleImageDownload() {

    let { paper, graph, svgElement } = this.props;

    paper.translate(0, 0);
    console.log(graph.getBBox());
    let graphBBox = graph.getBBox();
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
        width: 918,
        height: 532
      }
    });
    paper.translate(0, 0);
    let newWidth = graph.getBBox().width*paper.scale().sx;
    console.log(paper.scale().sx, newWidth)
    if (918 > newWidth) {
      leftPadd = (918 - newWidth)/2;
      rightPadd = (918 - newWidth)/2;
    }
    console.log(leftPadd, rightPadd)
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
        width: 918,
        height: 532
      }
    });
    let svgElementSvg = svgElement.children[2];
    let s = new XMLSerializer().serializeToString(svgElementSvg);
    let encodedData = window.btoa(unicodeUnEscape(encodeURIComponent(s)));

    let canvas = document.createElement('canvas');
    let ctx = canvas.getContext('2d');
    let imgSrc = 'data:image/svg+xml;base64,' + encodedData;

    // let imgSrc = 'data:image/svg+xml,' + encodedData;
    let image = document.createElement('img');
    // image.src = imgSrc;
    image.width = 918;
    image.height = 532;
    canvas.width = 918;
    canvas.height = 532;
    canvas.setAttributeNS("http://www.w3.org/XML/1998/namespace", "xml:space", "preserve");

    image.onload = () => {
      ctx.fillStyle = "#f6f6f6"
      ctx.fillRect(0, 0, 918, 532);

      let r = 2,
      cw = 10*paper.scale().sx,
      ch = 10*paper.scale().sx;
  
      for (let x = 1; x < 918; x+=cw) {
        for (let y = 1; y < 532; y+=ch) {
            ctx.fillStyle = "rgba(170,170,170,0.5)";   
            ctx.fillRect(x-r/2,y-r/2,r,r);
          }
      }
      ctx.drawImage(image, 0, 0);

      let png = canvas.toDataURL(); // default png
      let link = document.createElement('a');
      link.download = "a";
      link.style.opacity = "0";
      svgElementSvg.append(link);
      link.href = png;
      link.click();
      link.remove();
    }
    image.src = imgSrc;
  }

  render() {

    let { protocols } = this.props;

    return (
      // <div className="hold-select-cells" >

      // <SelectCellButtons />
      <div className="hold-cells" >
        <div className="list-cells">
          {this.mapProtocols(protocols)}
          <div className="list-row">
            <button className="temp-auto-layout-button" onClick={() => {
              this.props.layout();
            }}>Auto layout</button>
          </div>
          <div className="list-row">
            <button className="temp-auto-layout-button" onClick={this.handleImageDownload}>Save as image</button>
          </div>
        </div>
        <UndoButton reverseGraph={this.props.reverseGraph} />
      </div>
      // </div>
    );
  }
}

export default SelectCells;
