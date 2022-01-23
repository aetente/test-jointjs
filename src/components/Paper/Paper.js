import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as joint from 'jointjs';
import dagre from 'dagre';
import graphlib from 'graphlib';
import { cells } from './cells';
import "./styles.css";


// this.chart = new Chart({elementID: 'canvas'});
// this.chart.updateFromList(this.state.cells);


const portRight = {
    group: "right",
    position: {
        name: 'right'
    },
    attrs: {
        portBody: {
            magnet: true,
            r: 6,
            fill: 'white',
            stroke: '#023047'
        }
    },
    label: {
        position: {
            name: 'right',
        },
        markup: [{
            tagName: 'text',
            selector: 'label'
        }]
    },
    markup: [{
        tagName: 'circle',
        selector: 'portBody'
    }]
};

const portLeft = {
    group: "left",
    position: {
        name: 'left',
    },
    attrs: {
        portBody: {
            magnet: true,
            r: 6,
            fill: 'white',
            stroke: '#023047'
        }
    },
    label: {
        position: {
            name: 'left',
        },
        markup: [{
            tagName: 'text',
            selector: 'label'
        }]
    },
    markup: [{
        tagName: 'circle',
        selector: 'portBody'
    }]
};


const portTop = {
    group: "top",
    position: {
        name: 'top',
    },
    attrs: {
        portBody: {
            magnet: true,
            r: 6,
            fill: 'white',
            stroke: '#023047'
        }
    },
    label: {
        position: {
            name: 'top',
        },
        markup: [{
            tagName: 'text',
            selector: 'label'
        }]
    },
    markup: [{
        tagName: 'circle',
        selector: 'portBody'
    }]
};


const portBottom = {
    group: "bottom",
    position: {
        name: 'bottom',
    },
    attrs: {
        portBody: {
            magnet: true,
            r: 6,
            fill: 'white',
            stroke: '#023047'
        }
    },
    label: {
        position: {
            name: 'bottom',
        },
        markup: [{
            tagName: 'text',
            selector: 'label'
        }]
    },
    markup: [{
        tagName: 'circle',
        selector: 'portBody'
    }]
};

const portCellOptions = {
    groups: {
        'top': {
            position: "top"
        },
        "bottom": {
            position: "bottom"
        },
        "right": {
            position: "right"
        },
        "left": {
            position: "left"
        },
    },
    items: [
        portLeft, portRight, portTop, portBottom
    ]
}

const rootPortCellOptions = {
    groups: {
        "bottom": {
            position: "bottom"
        }
    },
    items: [
        portBottom
    ]
}

const directedGraphOptions = {
    dagre: dagre,
    graphlib: graphlib,
    marginX: 50,
    marginY: 50,
    nodeSep: 50,
    edgeSep: 80,
    rankDir: "TB",
    // setVertices: true
    // ranker: "longest-path"
};

function layout(graph) {
    var autoLayoutElements = [];
    var manualLayoutElements = [];
    let theLinks = graph.getLinks();
    let layoutTB = [];
    let layoutBT = [];
    let layoutRL = [];
    let layoutLR = [];
    theLinks.forEach(link => {
        let targetCell = link.getTargetCell()
        let sourceCell = link.getSourceCell()
        // if (targetCell && sourceCell) {
        //     let targetPort = targetCell.getPort(link.attributes.target.port);
        //     console.log(link, targetCell, targetPort)
        //     let portPosition = targetPort.group;
        //     switch (portPosition) {
        //         case "left":

        //             layoutLR.push(sourceCell)
        //             layoutLR.push(targetCell)
        //             break;
        //         case "right":
        //             layoutRL.push(sourceCell)
        //             layoutRL.push(targetCell)
        //             break;
        //         case "top":
        //             layoutTB.push(sourceCell)
        //             layoutTB.push(targetCell)
        //             break;
        //         case "bottom":
        //             layoutBT.push(sourceCell)
        //             layoutBT.push(targetCell)
        //             break;

        //         default:
        //             break;
        //     }
        // }
        if (targetCell.attributes.type === "root") {
            
            // let targetPort = targetCell.getPort(link.attributes.target.port);
            // let sourcePort = sourceCell.getPort(link.attributes.source.port);
            // console.log(targetPort, sourcePort)
            link.target(sourceCell)
            link.source(targetCell)
        }
    })
    graph.getElements().forEach(function (el) {
        var neighbors = graph.getNeighbors(el, { inbound: true });
        console.log(neighbors)
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
        marginY: 320,
        nodeSep: 50,
        edgeSep: 80,
        setLinkVertices: false
        // ranker: "longest-path"
    });
    // joint.layout.DirectedGraph.layout(graph.getSubgraph(layoutTB), {
    //     dagre: dagre,
    //     graphlib: graphlib,
    //     setVertices: true,
    //     marginX: 50,
    //     marginY: 50,
    //     nodeSep: 50,
    //     edgeSep: 80,
    //     setLinkVertices: false
    //     // ranker: "longest-path"
    // });
    // joint.layout.DirectedGraph.layout(graph.getSubgraph(layoutBT), {
    //     dagre: dagre,
    //     graphlib: graphlib,
    //     setVertices: true,
    //     marginX: 50,
    //     marginY: 50,
    //     nodeSep: 50,
    //     edgeSep: 80,
    //     setLinkVertices: false,
    //     rankDir: "BT"
    //     // ranker: "longest-path"
    // });
    // joint.layout.DirectedGraph.layout(graph.getSubgraph(layoutLR), {
    //     dagre: dagre,
    //     graphlib: graphlib,
    //     setVertices: true,
    //     marginX: 50,
    //     marginY: 50,
    //     nodeSep: 50,
    //     edgeSep: 80,
    //     setLinkVertices: false,
    //     rankDir: "LR"
    //     // ranker: "longest-path"
    // });
    // joint.layout.DirectedGraph.layout(graph.getSubgraph(layoutRL), {
    //     dagre: dagre,
    //     graphlib: graphlib,
    //     setVertices: true,
    //     marginX: 50,
    //     marginY: 50,
    //     nodeSep: 50,
    //     edgeSep: 80,
    //     setLinkVertices: false,
    //     rankDir: "RL"
    //     // ranker: "longest-path"
    // });
    // Manual Layout
    // autoLayoutElements.forEach(function(el) {
    //     var neighbors = graph.getNeighbors(el, { inbound: true });
    //     console.log(neighbors)
    //     if (neighbors.length === 0) return;
    //     var neighborPosition = neighbors[0].getBBox().center();
    //     el.position(neighborPosition.x + 100, neighborPosition.y - el.size().height / 2);
    // });

    // layoutTB.forEach(function (el) {
    //     let sources = graph.getNeighbors(el, { outbound: true });
    //     // console.log(neighbors)
    //     if (sources.length === 0) return;
    //     let sourcePosition = sources[0].getBBox().center();
    //     let targetPosition = el.getBBox().center();
    //     el.position(sourcePosition.x, sourcePosition.y - 200);
    // });

    // layoutBT.forEach(function (el) {
    //     let sources = graph.getNeighbors(el, { outbound: true });
    //     // console.log(neighbors)
    //     if (sources.length === 0) return;
    //     let sourcePosition = sources[0].getBBox().center();
    //     let targetPosition = el.getBBox().center();
    //     el.position(sourcePosition.x, sourcePosition.y + 200);
    // });


    // layoutLR.forEach(function (el) {
    //     let sources = graph.getNeighbors(el, { outbound: true });
    //     // console.log(neighbors)
    //     if (sources.length === 0) return;
    //     let sourcePosition = sources[0].getBBox().center();
    //     let targetPosition = el.getBBox().center();
    //     el.position(sourcePosition.x - 200, sourcePosition.y - el.size().height / 2);
    // });


    // layoutRL.forEach(function (el) {
    //     let sources = graph.getNeighbors(el, { outbound: true });
    //     // console.log(neighbors)
    //     if (sources.length === 0) return;
    //     let sourcePosition = sources[0].getBBox().center();
    //     let targetPosition = el.getBBox().center();
    //     el.position(sourcePosition.x + 100, sourcePosition.y - el.size().height / 2);
    // });
}

function Paper() {

    const canvas = useRef(null);

    const graph = new joint.dia.Graph({}, { cellNamespace: joint.shapes });

    const dragStart = useCallback(event => {
        if (event.target.className !== "draggable") return;
        event.dataTransfer.setData("text", event.target.textContent);
        event.dataTransfer.setData("element", event.target);
    }, []);

    const dragEnter = useCallback(event => {
        event.preventDefault();
    }, []);

    const dragOver = useCallback(event => {

        // if (event.target.className === "dropzone") {
        //   // Disallow a drop by returning before a call to preventDefault:
        //   return;
        // }
        event.preventDefault();
    }, []);

    const dragDrop = useCallback(event => {
        event.preventDefault();
        if (!graph) return;

        let rectBounds = event.target.getBoundingClientRect();

        let newCell = new joint.shapes.standard.Rectangle({
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
            size: { width: 100, height: 50 },
            inPorts: ['in'],
            outPorts: ['out'],
            ports: portCellOptions
        });
        graph.addCell(newCell)

        // when we call this, the cells are rearranged
        // let graphBBox = joint.layout.DirectedGraph.layout(graph, directedGraphOptions);
        layout(graph);

        // If we were using drag data, we could get it here, ie:
        // let data = event.dataTransfer.getData('text');
    }, []);

    useEffect(() => {
        // const graph = new joint.dia.Graph({}, { cellNamespace: joint.shapes });

        let connector = new joint.shapes.standard.Link({
            line: {
                stroke: "#3498DB",
                strokeWidth: 2,
                width: 30,
                targetMarker: {
                    type: "circle",
                    stroke: "#3498DB",
                    fill: "#ffffff",
                    cx: "0",
                    cy: "0",
                    r: "6"
                }
            }
        });

        connector.router('manhattan');

        const paper = new joint.dia.Paper({
            el: document.getElementById('canvas'),
            model: graph,
            background: {
                color: '#F8F9FA',
            },
            // grid: {
            //     name: "dot"
            // },
            drawGrid: true,
            gridSize: 10,
            frozen: true,
            async: true,
            cellViewNamespace: joint.shapes,
            defaultLink: connector,
            linkPinning: false,
            allowLink: (linkView, paper) => {
                // console.log(linkView.getNodeBBox())
                return true
            }
        });
        // paper.setGrid({
        //     name: "dot"})
        // paper.drawGrid()

        cells.cells.forEach(cellData => {
            let cell = new joint.shapes.standard.Rectangle({ ...cellData, ports: cellData.type === "root" && rootPortCellOptions || portCellOptions });
            graph.addCell(cell);
        });
        paper.on("link:connect", (linkView, event, elementViewConnected, magnet, arrowhead) => {
            console.log(linkView, event, elementViewConnected, magnet, arrowhead)
            // joint.layout.DirectedGraph.layout(graph, directedGraphOptions);
            layout(graph)
        })
        // let graphBBox = joint.layout.DirectedGraph.layout(graph, directedGraphOptions);
        layout(graph);
        // graphBBox.layout();

        paper.unfreeze();
        // setGraphEl(graph);


        graph.on('change:position', function (cell) {
            // has an obstacle been moved? Then reroute the link.
            // if (graph.getCells().indexOf(cell) > -1 && paper.findViewByModel(connector)) {
            //     paper.findViewByModel(connector).requestConnectionUpdate();
            // }
            let allLinks = graph.getLinks();
            allLinks.forEach(link => { // TODO probably don't update all links, but only the ones near the cell
                link.findView(paper).requestConnectionUpdate();
            })
        });


        window.addEventListener("dragstart", dragStart);
        window.addEventListener("dragenter", dragEnter);
        window.addEventListener("dragover", dragOver);
        window.addEventListener("drop", dragDrop);

        // console.log("events", graph, graphEl)

        return () => {
            window.removeEventListener("dragstart", dragStart);
            window.removeEventListener("dragenter", dragEnter);
            window.removeEventListener("dragover", dragOver);
            window.removeEventListener("drop", dragDrop);
        };

    }, []);

    return (
        <div id='canvas' ref={canvas}>
        </div>
    );
}

export default Paper;