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
    this.handleShowFrame = this.handleShowFrame.bind(this);
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

    let { paper, graph, svgElement, drawFrame } = this.props;

    paper.translate(0, 0);

    let theElements = graph.getElements();
    if (paper.options.restrictTranslate) {
      theElements.forEach(el => {
        if (el.attributes.typeOfCell === "frame") {
          // el.attr("body/stroke", "#777E90");
          el.attr("body/stroke", "rgba(0,0,0,0)");
        }
      })
    }

    //TODO remove setTimeout, sync it
    setTimeout(() => {

      // first we layout it all just with equal paddings
      let leftPadd = 0;
      let rightPadd = 0;
      paper.scaleContentToFit({
        padding: {
          top: 0,
          left: leftPadd,
          right: rightPadd,
          bottom: 0
        },
        fittingBBox: {
          x: 0,
          y: 0,
          width: 918,
          height: 532
        }
      });

      // then we do it the sacond time, to center out the graph in the image
      paper.translate(0, 0);
      let newWidth = graph.getBBox().width * paper.scale().sx;
      if (918 > newWidth) {
        leftPadd = (918 - newWidth) / 2;
        rightPadd = (918 - newWidth) / 2;
      }

      paper.scaleContentToFit({
        padding: {
          top: 0,
          left: leftPadd,
          right: rightPadd,
          bottom: 0
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

      let image = document.createElement('img');
      image.width = 918;
      image.height = 532;
      canvas.width = 918;
      canvas.height = 532;
      canvas.setAttributeNS("http://www.w3.org/XML/1998/namespace", "xml:space", "preserve");

      image.onload = () => {
        ctx.fillStyle = "#f6f6f6"
        ctx.fillRect(0, 0, 918, 532);
        let r = paper.scale().sx,
          cw = 10 * paper.scale().sx,
          ch = 10 * paper.scale().sx;

        // we need to draw the grid on our own, because it is not parsed for some reason
        // the new grid also needs to know, where the content was placed
        // because otherwise the grid would be as if in the wrong place
        let rectOffset = {
          x: Math.round(paper.translate().tx * paper.scale().sx) % 10,
          y: Math.round(paper.translate().ty * paper.scale().sx) % 10
        }

        for (let x = 1; x < 918; x += cw) {
          for (let y = 1; y < 532; y += ch) {
            ctx.fillStyle = "rgba(170,170,170,0.5)";
            let rectPos = {
              x: x - r / 2 + rectOffset.x,
              y: y - r / 2 + rectOffset.y
            }
            ctx.fillRect(rectPos.x, rectPos.y, r, r);
          }
        }
        ctx.drawImage(image, 0, 0);

        // TODO may be there is a better way to save the image other than to create link, click it and delete the link
        let png = canvas.toDataURL(); // default png
        let link = document.createElement('a');
        link.download = "a";
        link.style.opacity = "0";
        svgElementSvg.append(link);
        link.href = png;
        link.click();
        link.remove();


        if (paper.options.restrictTranslate) {
          theElements.forEach(el => {
            if (el.attributes.typeOfCell === "frame") {
              el.attr("body/stroke", "#777E90");
              // el.attr("body/stroke", "rgba(0,0,0,0)");
            }
          })
        }
      }
      image.src = imgSrc;

    }, 500)
  }

  handleShowFrame() {
    this.props.drawFrame();
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
          <div className="list-row">
            <button className="temp-auto-layout-button" onClick={this.handleShowFrame}>Show the frame</button>
          </div>
        </div>
        <UndoButton reverseGraph={this.props.reverseGraph} />
      </div>
      // </div>
    );
  }
}

export default SelectCells;
