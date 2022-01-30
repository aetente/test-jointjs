import React, { useState, useEffect, useRef, useCallback } from 'react';
import ModalWindow from '../ModalWindow/ModalWindow';
import InitButtons from '../InitButtons/InitButtons';
import * as joint from 'jointjs';
import dagre from 'dagre';
import graphlib from 'graphlib';
import { cells, earnCell } from './cells';
import { ports, portCellOptions, rootPortCellOptions } from './ports';
import "./styles.css";

import donkeylogo from "./Group 3722.png";

const svgFile = [
    '<?xml version="1.0" standalone="no"?>',
    '<svg viewBox="0 0 1024 768" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" stroke-linecap="round" stroke-linejoin="round" fill-rule="evenodd" xml:space="preserve" >',
    '<defs >',
    '<mask id="image-mask" >',
    '<polygon points="0,100 100,0 200,100 100,200" />',
    '</mask>',
    '</defs>',
    '<g stroke-width="0.25" mask="url(#image-mask)" fill="rgb(0,0,0)" stroke="rgb(0,0,0)" >',
    '<polygon points="0,100 100,0 200,100 100,200" />',
    '</g>',
    '</svg>'
].join('');

const globalOffsetX = 350;
const globalOffsetY = 35;

function layout(graph, activeLink) {
    var autoLayoutElements = [];

    // let theLinks = graph.getLinks();
    // theLinks.forEach(link => {
    //     let targetCell = link.getTargetCell()
    //     let sourceCell = link.getSourceCell()
    //     if (link.attributes.target.port) {
    //         let targetPort = targetCell.getPort(link.attributes.target.port);
    //         let sourcePort = sourceCell.getPort(link.attributes.source.port);

    //         if ((targetPort.group === "bottom" && sourcePort.group === "top") ||
    //             (targetPort.group === "right" && sourcePort.group === "left")) {
    //             // change the direction for root node as it has only output and you should be able to connect to it

    //             link.target({ id: sourceCell.id, port: sourcePort.id })
    //             link.source({ id: targetCell.id, port: targetPort.id })
    //         }
    //     }
    // })
    // if (activeLink) {
    //     let targetCell = activeLink.getTargetCell()
    //     let sourceCell = activeLink.getSourceCell()
    //     if (activeLink.attributes.target.port) {
    //         let targetPort = targetCell.getPort(activeLink.attributes.target.port);
    //         let sourcePort = sourceCell.getPort(activeLink.attributes.source.port);
    //         // change the direction for root node as it has only output and you should be able to connect to it

    //         activeLink.target({ id: sourceCell.id, port: sourcePort.id })
    //         activeLink.source({ id: targetCell.id, port: targetPort.id })
    //     }
    // }

    if (activeLink) {
        let targetCell = activeLink.getTargetCell()
        let sourceCell = activeLink.getSourceCell()
        if (targetCell && sourceCell) {
            let sourcePort = sourceCell.getPort(activeLink.attributes.source.port);
            let targetPort = targetCell.getPort(activeLink.attributes.target.port);
            let sourcePortPosition = sourcePort.group;
            let targetPortPosition = targetPort.group;
            // if (sourcePortPosition === "top" && targetPortPosition === "bottom") {
            // console.log(graph.getNeighbors(targetCell), graph.getNeighbors(sourceCell))
            let sourceCellsNeighbors = graph.getNeighbors(sourceCell)
            // if (targetPortPosition === "bottom") {
            if (sourceCellsNeighbors.length <= 1) {
                activeLink.target({ id: sourceCell.id, port: sourcePort.id })
                activeLink.source({ id: targetCell.id, port: targetPort.id })
            }
        }
    }
    graph.getElements().forEach(function (el) {
        // var neighbors = graph.getNeighbors(el, { inbound: true });
        // if (theNeighbors.length > 0) {
        // manualLayoutElements.push(el);
        // } else {
        autoLayoutElements.push(el);
        // }
    });
    // Automatic Layout
    // check source neighbors

    joint.layout.DirectedGraph.layout(graph, {
        dagre: dagre,
        graphlib: graphlib,
        setVertices: true,
        marginX: globalOffsetX,
        marginY: globalOffsetY,
        nodeSep: 350,
        edgeSep: 150,
        rankSep: 100,
        setLinkVertices: false,
        ranker: "tight-tree",
        setPosition: function (element, glNode) {
            // console.log(element, graph.getNeighbors(element, { inbound: true }))
            element.set({
                position: {
                    x: glNode.x - glNode.width / 2,
                    y: glNode.y - glNode.height / 2
                },
                refresher: (element.get('refresher') || 0) + 1
            });
        }
    });

    let theLinks = graph.getLinks()
    let layoutLR = [];
    let layoutRL = [];
    let layoutTB = [];
    let layoutBT = [];
    let unlinkedCells = [];
    // theLinks.forEach(link => {
    //         let targetCell = link.getTargetCell()
    //         let sourceCell = link.getSourceCell()
    //         if (targetCell && sourceCell) {
    //             let sourcePort = sourceCell.getPort(link.attributes.source.port);
    //             let targetPort = targetCell.getPort(link.attributes.target.port);
    //             let sourcePortPosition = sourcePort.group;
    //             let targetPortPosition = targetPort.group;
    //             if (sourcePortPosition === "top" && targetPortPosition === "bottom") {
    //                 console.log("AAAAAAAAAAAAAAAAA")
    //                 link.target({ id: sourceCell.id, port: sourcePort.id })
    //                 link.source({ id: targetCell.id, port: targetPort.id })
    //             }
    //         }
    // })

    // if (activeLink) {
    //     let targetCell = activeLink.getTargetCell()
    //     let sourceCell = activeLink.getSourceCell()
    //     if (targetCell && sourceCell) {
    //         let sourcePort = sourceCell.getPort(activeLink.attributes.source.port);
    //         let targetPort = targetCell.getPort(activeLink.attributes.target.port);
    //         let sourcePortPosition = sourcePort.group;
    //         let targetPortPosition = targetPort.group;
    //         if (sourcePortPosition === "top" && targetPortPosition === "bottom") {
    //             console.log("AAAAAAA")
    //             activeLink.target({ id: sourceCell.id, port: sourcePort.id })
    //             activeLink.source({ id: targetCell.id, port: targetPort.id })
    //         }
    //     }
    // }

    // theLinks.forEach(link => {
    //     let targetCell = link.getTargetCell()
    //     let sourceCell = link.getSourceCell()
    //     if (targetCell && sourceCell) {
    //         let sourcePort = sourceCell.getPort(link.attributes.source.port);
    //         let targetPort = targetCell.getPort(link.attributes.target.port);
    //         let sourcePortPosition = sourcePort.group;
    //         let targetPortPosition = targetPort.group;
    //         if (sourcePortPosition === "top" && targetPortPosition === "bottom") {
    //             layoutTB.push(targetCell)
    //         } else if (sourcePortPosition === "bottom" && targetPortPosition === "top") {
    //             layoutBT.push(sourceCell)
    //         } else if (sourcePortPosition === "right" && targetPortPosition === "left") {
    //             layoutRL.push(sourceCell)
    //         } else if (sourcePortPosition === "left" && targetPortPosition === "right") {
    //             layoutLR.push(sourceCell)
    //         }
    //         // switch (sourcePortPosition) {
    //         //     case "left":
    //         //         layoutRL.push(targetCell)
    //         //         break;
    //         //     case "right":
    //         //         layoutLR.push(targetCell)
    //         //         break;
    //         //     case "top":
    //         //         layoutBT.push(targetCell)
    //         //         break;
    //         //     case "bottom":
    //         //         layoutTB.push(targetCell)
    //         //         break;

    //         //     default:
    //         //         break;
    //         // }
    //     }
    // });

    // console.log(layoutTB, layoutBT, layoutRL, layoutLR)

    // layoutTB.forEach(function (el) {
    //     let sources = graph.getNeighbors(el, { inbound: true });
    //     // console.log(neighbors)
    //     if (sources.length === 0) return;
    //     let sourcePosition = sources[0].getBBox().center();
    //     let targetSize = el.getBBox();
    //     el.position(sourcePosition.x - targetSize.width / 2, sourcePosition.y - 150);
    // });


    // layoutBT.forEach(function (el) {
    //     let sources = graph.getNeighbors(el, { outbound: true });
    //     // console.log(neighbors)
    //     if (sources.length === 0) return;
    //     let sourcePosition = sources[0].getBBox().center();
    //     let targetSize = el.getBBox();
    //     el.position(sourcePosition.x - targetSize.width / 2, sourcePosition.y - 250);
    // });

    // layoutRL.forEach(function (el) {
    //     let sources = graph.getNeighbors(el, { outbound: true });
    //     // console.log(neighbors)
    //     if (sources.length === 0) return;
    //     let sourcePosition = sources[0].getBBox().center();
    //     let targetSize = el.getBBox();
    //     el.position(sourcePosition.x - 150 - 3 * targetSize.width / 2, sourcePosition.y - targetSize.height / 2);
    // });


    // layoutLR.forEach(function (el) {
    //     let sources = graph.getNeighbors(el, { outbound: true });
    //     // console.log(neighbors)
    //     if (sources.length === 0) return;
    //     let sourcePosition = sources[0].getBBox().center();
    //     let targetSize = el.getBBox();
    //     el.position(sourcePosition.x + 150 + targetSize.width / 2, sourcePosition.y - targetSize.height / 2);
    // });

    // let graphRect = graph.getBBox();
    // console.log(graph.getBBox())
    // Manual Layout
    // autoLayoutElements.forEach(function (el) {
    //     console.log(graph.getPredecessors(el))
    //     // var neighbors = graph.getNeighbors(el, { inbound: true });
    //     // console.log(neighbors)
    //     // if (neighbors.length === 0) return;
    //     // var neighborPosition = neighbors[0].getBBox().center();
    //     // el.position(neighborPosition.x + 100, neighborPosition.y - el.size().height / 2);
    // });

}

function Paper(props) {

    const canvas = useRef(null);

    const [openModalWindow, setOpenModalWindow] = useState(false);
    const [activeLink, setActiveLink] = useState(null);

    const [graph, setGraph] = useState(new joint.dia.Graph());
    const [paper, setPaper] = useState(null);

    const [rootCell, setRootCell] = useState(null);
    const [changeCount, setchangeCount] = useState(0);

    const dragStart = useCallback(event => {
        if (event.target.className !== "draggable") return;
        event.dataTransfer.setData("text", event.target.textContent);
        event.dataTransfer.setData("element", event.target);
    }, []);

    const dragEnter = useCallback(event => {
        event.preventDefault();
    }, []);

    const dragOver = useCallback(event => {
        event.preventDefault();
    }, []);

    const dragDrop = useCallback(event => {
        event.preventDefault();
        if (!graph) return;

        let rectBounds = event.target.getBoundingClientRect();

        let newCell = new joint.shapes.standard.Polygon({
            attrs: {
                label: {
                    text: event.dataTransfer.getData('text')
                },
                '.': { magnet: false }
            },
            position: {
                x: event.clientX - rectBounds.left,
                y: event.clientY - rectBounds.top
            },
            size: { width: 100, height: 100 },
            inPorts: ['in'],
            outPorts: ['out'],
            ports: portCellOptions
        });
        newCell.attr('body/refPoints', '0,10 10,0 20,10 10,20')
        graph.addCell(newCell)
        // layout(graph);

        setGraph(graph)
    }, []);

    const addBaseToken = (tokenName, tokenUrl) => {

        let newLink = new joint.dia.Link({
            attrs: {
                '.connection': {
                    strokeDasharray: '8 4'
                }
            }
        });
        newLink.router('manhattan');

        let newCell = new joint.shapes.standard.Rectangle({
            ...earnCell,
            attrs: {
                ...earnCell.attrs,
                label: {
                    text: tokenName
                }
            },
            ports: portCellOptions
        });
        graph.addCell(newCell);
        console.log(rootCell, newCell)
        newLink.source({ id: rootCell.id, port: rootCell.attributes.ports.items[0].id });
        newLink.target({ id: newCell.id, port: newCell.attributes.ports.items[2].id });
        newLink.addTo(graph);


        layout(graph);
        
        // setGraph(graph)
    }

    const handleScroll = (e) => {
        let prevScale = paper.scale();
        let deltaY = e.deltaY;
        if (deltaY < 0) {
            paper.scale(prevScale.sx + 0.05, prevScale.sy + 0.05)
        } else 
        if (deltaY > 0) {
            paper.scale(prevScale.sx - 0.05, prevScale.sy - 0.05)
        }
    }

    useEffect(() => {
        // let link = new joint.shapes.standard.Link();
        let link = new joint.dia.Link({
            attrs: {
                '.connection': {
                    strokeDasharray: '8 4'
                }
            }
        });


        let targetArrowheadTool = new joint.linkTools.TargetArrowhead();
        let toolsView = new joint.dia.ToolsView({
            tools: [targetArrowheadTool]
        })

        link.router('manhattan');
        link.attr({
            // line: {
            //     strokeDasharray: '8 4',
            //     targetMarker: {
            //         type: "none"
            //     }
            // }
        });

        const paper = new joint.dia.Paper({
            el: document.getElementById('canvas'),
            model: graph,
            gridSize: 10,
            drawGrid: true,
            frozen: true,
            height: 9999,
            width: 9999,
            async: true,
            defaultLink: link,
            linkPinning: false,
            background: {
                color: '#F6F6F6',
            },
            perpendicularLinks: true,
            // restrictTranslate: true
        });

        // link.findView(paper).addTools(toolsView)

        cells.cells = cells.cells.map((cellData, i) => {
            let cell = new joint.shapes.standard.Rectangle({ ...cellData, ports: portCellOptions });
            if (cellData.type === "root") {
                cell = new joint.shapes.standard.Polygon({ ...cellData, ports: rootPortCellOptions });
                cell.attr('body/refPoints', '0,10 10,0 20,10 10,20')
                // cell.attr('image/xlinkHref', donkeylogo)
                setRootCell(cell)
            }
            if (i == 0) {
                graph.addCell(cell);
            }
            return cell;
        });

        paper.on("link:connect", ((linkView, event, elementViewConnected, magnet, arrowhead) => {
            layout(graph, activeLink);
            if (linkView.model.isLink()) {
                setActiveLink(linkView.model);
            }
            setOpenModalWindow(true);
        }));

        paper.on("link:disconnect", ((linkView, event, elementViewConnected, magnet, arrowhead) => {
            // layout(graph, activeLink);
            // setActiveLink(null);
            // setOpenModalWindow(false);
        }));

        paper.on("link:pointerdblclick", ((linkView, event, x, y) => {
            let currentLink = linkView.model;
            setActiveLink(currentLink);
            setOpenModalWindow(true);
        }))

        
        paper.on("blank:pointerdown", ((event, x, y) => {
            let newClickPos = {x: event.clientX, y: event.clientY};
            let paperPos = paper.translate();
            setchangeCount(changeCount => changeCount + 1)
            
            paper.off("blank:pointermove");
            paper.on("blank:pointermove", ((event, x, y) => {
                let movePos = {x: event.clientX, y: event.clientY};
                paper.translate(
                    paperPos.tx + movePos.x - newClickPos.x,
                    paperPos.ty + movePos.y - newClickPos.y
                )
            }))
        }))

        
        paper.on("blank:pointermove", ((event, x, y) => {
            console.log("OLD", x, y)
        }))

        paper.on("blank:scroll", () => {
            console.log("A")
        })

        graph.on('add', (eventElement) => {
            // if (eventElement.isLink()) {
            //     setActiveLink(eventElement);
            // }
            paper.off("link:connect")
            paper.on("link:connect", ((linkView, event, elementViewConnected, magnet, arrowhead) => {
                layout(graph, eventElement);
                if (linkView.model.isLink()) {
                    setActiveLink(linkView.model);
                }
                setOpenModalWindow(true);
            }))
        });

        paper.unfreeze();


        graph.on('change:position', function (cell) {
            let allLinks = graph.getLinks();
            allLinks.forEach(link => { // TODO probably don't update all links, but only the ones near the cell
                link.findView(paper).requestConnectionUpdate();
            })
        });

        setGraph(graph)
        setPaper(paper)

        let theCells = graph.getCells();

        theCells.forEach(cell => {
            cell.position(globalOffsetX, globalOffsetY);
        })
        layout(graph);


        window.addEventListener("dragstart", dragStart);
        window.addEventListener("dragenter", dragEnter);
        window.addEventListener("dragover", dragOver);
        window.addEventListener("drop", dragDrop);

        return () => {
            window.removeEventListener("dragstart", dragStart);
            window.removeEventListener("dragenter", dragEnter);
            window.removeEventListener("dragover", dragOver);
            window.removeEventListener("drop", dragDrop);
        };

    }, []);

    return (
        <div className='hold-paper'>
            <div id='canvas' onWheel={handleScroll} ref={canvas} />
            {openModalWindow && <ModalWindow
                joint={joint}
                portCellOptions={portCellOptions}
                setOpenModalWindow={setOpenModalWindow}
                activeLink={activeLink}
                graph={graph}
                setGraph={setGraph}
                cellData={earnCell}
                layout={layout}
            />}
            <InitButtons
                addBaseToken={addBaseToken}
            />
        </div>
    );
}

export default Paper;