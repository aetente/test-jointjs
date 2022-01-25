import React, { useState, useEffect, useRef, useCallback } from 'react';
import ModalWindow from '../ModalWindow/ModalWindow';
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

function layout(graph, activeLink) {
    var autoLayoutElements = [];
    console.log(graph.getLinks())
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
    if (activeLink) {
        let targetCell = activeLink.getTargetCell()
        let sourceCell = activeLink.getSourceCell()
        if (activeLink.attributes.target.port) {
            let targetPort = targetCell.getPort(activeLink.attributes.target.port);
            let sourcePort = sourceCell.getPort(activeLink.attributes.source.port);
            // change the direction for root node as it has only output and you should be able to connect to it

            activeLink.target({ id: sourceCell.id, port: sourcePort.id })
            activeLink.source({ id: targetCell.id, port: targetPort.id })
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

    joint.layout.DirectedGraph.layout(graph.getSubgraph(autoLayoutElements), {
        dagre: dagre,
        graphlib: graphlib,
        setVertices: true,
        marginX: 320,
        marginY: 35,
        nodeSep: 150,
        edgeSep: 150,
        rankSep: 100,
        setLinkVertices: false,
        align: "UL"
    });

    // let graphRect = graph.getBBox();
    // console.log(graph.getBBox())
    // Manual Layout
    // autoLayoutElements.forEach(function(el) {
    //     var neighbors = graph.getNeighbors(el, { inbound: true });
    //     console.log(neighbors)
    //     if (neighbors.length === 0) return;
    //     var neighborPosition = neighbors[0].getBBox().center();
    //     el.position(neighborPosition.x + 100, neighborPosition.y - el.size().height / 2);
    // });
    
}

function Paper(props) {

    const canvas = useRef(null);

    const [openModalWindow, setOpenModalWindow] = useState(false);
    const [activeLink, setActiveLink] = useState(null);

    const [graph, setGraph] = useState(new joint.dia.Graph());

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
        layout(graph);
        
        setGraph(graph)
    }, []);

    useEffect(() => {
        let link = new joint.shapes.standard.Link();

        link.router('manhattan');
        link.attr({
            line: {
                strokeDasharray: '8 4',
                targetMarker: {
                    type: "none"
                }
            }
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
            restrictTranslate: true
        });

        cells.cells = cells.cells.map(cellData => {
            let cell = new joint.shapes.standard.Rectangle({ ...cellData, ports: portCellOptions });
            if (cellData.type === "root") {
                cell = new joint.shapes.standard.Polygon({ ...cellData, ports: rootPortCellOptions });
                cell.attr('body/refPoints', '0,10 10,0 20,10 10,20')
                // cell.attr('image/xlinkHref', donkeylogo)
            }

            graph.addCell(cell);
            return cell;
        });
        link.source({ id: cells.cells[0].id, port: cells.cells[0].attributes.ports.items[0].id });
        link.target({ id: cells.cells[1].id, port: cells.cells[1].attributes.ports.items[2].id });
        link.addTo(graph);

        paper.on("link:connect", ((linkView, event, elementViewConnected, magnet, arrowhead) => {
            layout(graph, activeLink);
            setOpenModalWindow(true);
        }));

        graph.on('add', (eventElement) => {
            if (eventElement.isLink()) {
                setActiveLink(eventElement);
            }
            paper.off("link:connect")
            paper.on("link:connect", ((linkView, event, elementViewConnected, magnet, arrowhead) => {
                layout(graph, eventElement);
                setOpenModalWindow(true);
            }))
        });
        layout(graph);

        paper.unfreeze();


        graph.on('change:position', function (cell) {
            let allLinks = graph.getLinks();
            allLinks.forEach(link => { // TODO probably don't update all links, but only the ones near the cell
                link.findView(paper).requestConnectionUpdate();
            })
        });

        setGraph(graph)


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
            <div id='canvas' ref={canvas} />
            {openModalWindow && <ModalWindow
                joint={joint}
                portCellOptions={portCellOptions}
                setOpenModalWindow={setOpenModalWindow}
                activeLink={activeLink}
                graph={graph}
                cellData={earnCell}
            />}
        </div>
    );
}

export default Paper;