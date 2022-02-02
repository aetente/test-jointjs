import React, { useState, useEffect, useRef, useCallback } from 'react';
import { findDOMNode } from 'react-dom';
import ModalWindow from '../ModalWindow/ModalWindow';
import InitButtons from '../InitButtons/InitButtons';
import SelectCells from '../SelectCells/SelectCells';
import * as joint from 'jointjs';
import dagre from 'dagre';
import graphlib from 'graphlib';
import { cells, earnCell } from './cells';
import { ports, portCellOptions, rootPortCellOptions } from './ports';
import { diamondShape, toolsView, toolsViewVertices } from './options';
import "./styles.css";

import donkeylogo from "./Group 3722.png";

// the name space needed for importing graph from json, which is what we do when press undo button
// in here we added custom node, so that now jointjs nows what to build when it finds that the type of a node is custom.Diamond
const customNameSpace = Object.assign(joint.shapes, {
    custom: {
        Diamond: diamondShape
    }
});

// joint.shapes.basic.Rhombus = diamondShape;

const globalOffsetX = 350;
const globalOffsetY = 35;


const NODE_SEP = 300;
const EDGE_SEP = 150;
const RANK_SEP = 97.5;

// change direction of pareting for new cells
// the jointjs defines parent cell as the on from which the link was dragged
// but new nodes can never be parents, becuase auto layout strongly depends on it
// so for new nodes if the link was dragged from them, we flip the relation
function changeActiveLinkParenting(graph, activeLink) {
    if (activeLink && activeLink.isLink()) {
        // activeLink.vertices([])
        let targetCell = activeLink.getTargetCell()
        let sourceCell = activeLink.getSourceCell()
        if (targetCell && sourceCell) {
            let sourcePort = sourceCell.getPort(activeLink.attributes.source.port);
            let targetPort = targetCell.getPort(activeLink.attributes.target.port);
            let sourcePortPosition = sourcePort.group;
            let targetPortPosition = targetPort.group;
            // if (sourcePortPosition === "top" && targetPortPosition === "bottom") {
            let sourceCellsNeighbors = graph.getNeighbors(sourceCell)
            // if (targetPortPosition === "bottom") {
            if (sourceCellsNeighbors.length <= 1) {
                activeLink.target({ id: sourceCell.id, port: sourcePort.id })
                activeLink.source({ id: targetCell.id, port: targetPort.id })
            }
        }
    }
}

function Paper(props) {

    const canvas = useRef(null);

    const [openModalWindow, setOpenModalWindow] = useState(false);
    const [activeLink, setActiveLink] = useState(null);
    const [activeLinkView, setActiveLinkView] = useState(null);
    const [baseTokenCellView, setBaseTokenCellView] = useState(null);
    const [activeCellView, setActiveCellView] = useState(null);

    const [graph, setGraph] = useState(new joint.dia.Graph({}, { cellNamespace: customNameSpace }));
    const [graphHistory, setGraphHistory] = useState([])
    const [paper, setPaper] = useState(null);

    const [rootCell, setRootCell] = useState(null);

    // we need refs for events

    const paperRef = useRef(paper);

    const getPaperRef = () => {
        return paperRef.current;
    }

    const setPaperRef = (val) => {
        paperRef.current = val;
    }

    const graphRef = useRef(graph);

    const getGraphRef = () => {
        return graphRef.current;
    }

    const setGraphRef = (val) => {
        graphRef.current = val;
    }


    const activeLinkViewRef = useRef(activeLinkView);

    const getActiveLinkViewRef = () => {
        return activeLinkViewRef.current;
    }

    const setActiveLinkViewRef = (val) => {
        activeLinkViewRef.current = val;
    }

    const activeCellViewRef = useRef(activeCellView);

    const getActiveCellViewRef = () => {
        return activeCellViewRef.current;
    }

    const setActiveCellViewRef = (val) => {
        activeCellViewRef.current = val;
    }

    const dragStart = useCallback(event => {
        if (!event.target.className.includes("draggable")) return;
        console.log(event.target.getAttribute("color"))
        event.dataTransfer.setData("text", event.target.textContent);
        event.dataTransfer.setData("color", event.target.getAttribute("color") || "#FFFFFF");
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
        let paperCoords = getPaperRef().translate();
        let newCell = new diamondShape({
            attrs: {
                label: {
                    text: event.dataTransfer.getData('text')
                },
                text: {
                    text: event.dataTransfer.getData('text')
                },
                '.': { magnet: false }
            },
            position: {
                x: -paperCoords.tx + (event.clientX - rectBounds.left),
                y: -paperCoords.ty + (event.clientY - rectBounds.top)
            },
            size: { width: 100, height: 100 },
            inPorts: ['in'],
            outPorts: ['out'],
            ports: portCellOptions
        });
        
        newCell.attr('polygon/fill', event.dataTransfer.getData('color'))
        graph.addCell(newCell)
        // layout();

        stackGraph(graph)
    }, []);

    const layout = (activeLink) => {
    
        changeActiveLinkParenting(graph, activeLink)
    
        joint.layout.DirectedGraph.layout(graph, {
            dagre: dagre,
            graphlib: graphlib,
            // setVertices: true,
            marginX: globalOffsetX,
            marginY: globalOffsetY,
            nodeSep: NODE_SEP,
            edgeSep: EDGE_SEP,
            rankSep: RANK_SEP,
            setLinkVertices: false,
            ranker: "tight-tree",
            setPosition: function (element, glNode) {
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
        theLinks.forEach(alink => {
            alink.vertices([]) // disable all vertices
        })
    
    }

    const subLayout = (link, cell) => {
        // the idea is not to layout the whole graph but only a little subtree
        let sourceCell = cell;
        if (!sourceCell) {
            sourceCell = link.getSourceCell();
        }
        let sourceChildren = graph.getSuccessors(sourceCell);

        let cellsToLayout = [sourceCell, ...sourceChildren];

        let sourceCellPosition = sourceCell.attributes.position;
        joint.layout.DirectedGraph.layout(graph.getSubgraph(cellsToLayout), {
            dagre: dagre,
            graphlib: graphlib,
            // setVertices: true,
            marginX: sourceCellPosition.x,
            marginY: sourceCellPosition.y,
            nodeSep: NODE_SEP,
            edgeSep: EDGE_SEP,
            rankSep: RANK_SEP,
            setLinkVertices: false,
            ranker: "tight-tree"
        });

    }

    const addBaseToken = (tokenName, tokenUrl) => {

        let newLink = new joint.shapes.standard.Link();
        newLink.router('manhattan');

        newLink.attr({
            line: {
                strokeDasharray: '8 4',
                targetMarker: {
                    type: "none"
                }
            }
        });

        let newCell = new joint.shapes.standard.Rectangle({
            ...earnCell,
            attrs: {
                ...earnCell.attrs,
                label: {
                    text: tokenName,
                    tokenName,
                    tokenUrl
                }
            },
            ports: portCellOptions,
            typeOfCell: "base_token",
        });
        graph.addCell(newCell);
        newLink.source({ id: rootCell.id, port: rootCell.attributes.ports.items[0].id });
        newLink.target({ id: newCell.id, port: newCell.attributes.ports.items[2].id });
        newLink.addTo(graph);


        layout();

        stackGraph(graph)
    }

    const editBaseToken = (tokenName, tokenUrl) => {
        if (baseTokenCellView) {
            baseTokenCellView.model.attr({
                label: {
                    text: tokenName,
                    tokenName,
                    tokenUrl
                }
            })
            setBaseTokenCellView(null);
        }
        stackGraph(graph)
    }

    const handleScroll = (e) => {

        if (e.ctrlKey) {
            let prevScale = paper.scale();
            let deltaY = e.deltaY;
            if (deltaY < 0) {
                paper.scale(prevScale.sx + 0.05, prevScale.sy + 0.05)
            } else if (deltaY > 0) {
                paper.scale(prevScale.sx - 0.05, prevScale.sy - 0.05)
            }
        }
    }

    const stackGraph = (newGraph) => {
        setGraphHistory(graphHistory => {
            graphHistory.push(newGraph.toJSON())
            return [...graphHistory];
        });
        setGraphRef(newGraph);
        setGraph(newGraph);
    }

    const reverseGraph = () => {
        setGraphHistory(graphHistory => {
            if (graphHistory.length > 1) {
                let graphJSON = graphHistory[graphHistory.length - 2];
                graphHistory.pop();
                let graph = getGraphRef().fromJSON(graphJSON);
                setGraphRef(graph)
                setGraph(graph);
                return [...graphHistory];
            } else {
                let graph = getGraphRef().fromJSON(graphHistory[0]);
                setGraphRef(graph);
                setGraph(graph);
                graphHistory.push(graphHistory[0]);
            }
            return graphHistory
        });
        setOpenModalWindow(false);
        setActiveLink(null);
    }

    const handleKeyPress = (e) => {
        if (e.key === "z" && e.ctrlKey) {
            reverseGraph()
        }

        if (getActiveLinkViewRef()) {
            if (e.key === "Control") {
                getActiveLinkViewRef().addTools(toolsView);
            } else if (e.key === "Delete") {
                // console.log(activeLinkViewRef.current)
                stackGraph(getGraphRef())
                getActiveLinkViewRef().model.remove();
                setActiveLinkViewRef(null);
                setActiveLinkView(null);
                // stackGraph
            }
        } else if (getActiveCellViewRef()) {
            if (e.key === "Delete" && getActiveCellViewRef().model.attributes.typeOfCell !== "root") {
                stackGraph(getGraphRef())
                getActiveCellViewRef().model.remove();
                setActiveCellViewRef(null);
                setActiveCellView(null);
            }
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === "Control") {
            if (getActiveLinkViewRef()) {
                if (!getActiveLinkViewRef().hasTools("toolsViewVertices")) {
                    getActiveLinkViewRef().addTools(toolsViewVertices);
                }
            }
        }
    }

    const preventZoom = (e) => {
        if (e.ctrlKey) {
            e.preventDefault()
        }
    }

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
            cellViewNamespace: customNameSpace,
            interactive: (cellView, a) => {
                // if (cellView.model.isLink()) {
                //     return { vertexAdd: false }
                // }
                return true;
            },
            // restrictTranslate: true,
            validateConnection: (cellViewS, magnetS, cellViewT, magnetT, end, linkView) => {
                let sourceTypeOfCell = cellViewS.model.attributes.typeOfCell;
                let targetTypeOfCell = cellViewT.model.attributes.typeOfCell;
                return cellViewS.id !== cellViewT.id &&
                    !cellViewT.model.isLink() &&
                    (sourceTypeOfCell !== "root" || 
                    (sourceTypeOfCell === "root" && targetTypeOfCell === "base_token") ||
                    (sourceTypeOfCell === "base_token" && targetTypeOfCell === "root"));
            }
        });

        cells.cells = cells.cells.map((cellData, i) => {
            let cell = new joint.shapes.standard.Rectangle({ ...cellData, ports: portCellOptions });
            if (cellData.typeOfCell === "root") {
                cell = new diamondShape({ ...cellData, ports: rootPortCellOptions });
                cell.attr('image/xlinkHref', donkeylogo)
                cell.attr('polygon/fill', "#DBD9D2")
                setRootCell(cell)
            }
            if (i == 0) {
                graph.addCell(cell);
            }
            return cell;
        });

        paper.on("link:connect", ((linkView, event, elementViewConnected, magnet, arrowhead) => {
            // layout(activeLink);
            changeActiveLinkParenting(graph, activeLink)
            if (linkView.model.isLink()) {
                if (linkView.model.vertices().length === 0) {
                    linkView.model.vertices([{
                        x: (linkView.sourceAnchor.x + linkView.targetAnchor.x) / 2,
                        y: (linkView.sourceAnchor.y + linkView.targetAnchor.y) / 2
                    }])
                }
                // linkView.model.vertices([])
                setActiveLink(linkView.model);
                stackGraph(graph);
                let targetCell = linkView.model.getTargetCell()
                let sourceCell = linkView.model.getSourceCell()
                if (sourceCell.attributes.typeOfCell !== "root" && targetCell.attributes.typeOfCell !== "root") {
                    setOpenModalWindow(true);
                }
            }
        }));

        paper.on("link:disconnect", ((linkView, event, elementViewConnected, magnet, arrowhead) => {
            // layout(activeLink);
            // setActiveLink(null);
            // setOpenModalWindow(false);
        }));

        paper.on("cell:pointerclick", ((cellView, e, x, y) => {
            if (!cellView.model.isLink()) {
                if (getActiveCellViewRef()) {
                    if (getActiveCellViewRef().id === cellView.id) {

                        getActiveCellViewRef().unhighlight();
                        setActiveCellViewRef(null);
                        setActiveCellView(null);
                    } else {

                        getActiveCellViewRef().unhighlight();
                        cellView.highlight();
                        setActiveCellViewRef(cellView);
                        setActiveCellView(cellView);
                    }
                } else {

                    cellView.highlight();
                    setActiveCellViewRef(cellView);
                    setActiveCellView(cellView);
                }
            }
        }))

        paper.on("cell:pointerdblclick", ((cellView, e, x, y) => {
            if (!cellView.model.isLink() && cellView.model.attributes.typeOfCell === "base_token") {
                // console.log("cell:pointerdblclick", cellView)
                setBaseTokenCellView(cellView);
            }
        }))

        paper.on("link:pointerdblclick", ((linkView, e, x, y) => {
            if (!e.ctrlKey) {
                let currentLink = linkView.model;
                setActiveLink(currentLink);
                let targetCell = linkView.model.getTargetCell()
                let sourceCell = linkView.model.getSourceCell()
                if (sourceCell.attributes.typeOfCell !== "root" && targetCell.attributes.typeOfCell !== "root") {
                    setOpenModalWindow(true);
                }
            }
        }))


        paper.on("blank:pointerdown", ((event, x, y) => {
            let newClickPos = { x: event.clientX, y: event.clientY };
            let paperPos = paper.translate();

            paper.off("blank:pointermove");
            paper.on("blank:pointermove", ((event, x, y) => {
                let movePos = { x: event.clientX, y: event.clientY };
                paper.translate(
                    paperPos.tx + movePos.x - newClickPos.x,
                    paperPos.ty + movePos.y - newClickPos.y
                )
            }))
        }))

        graph.on('add', (eventElement) => {
            // if (eventElement.isLink()) {
            //     setActiveLink(eventElement);
            // }
            paper.off("link:connect")
            paper.on("link:connect", ((linkView, event, elementViewConnected, magnet, arrowhead) => {
                // layout(eventElement);
                changeActiveLinkParenting(graph, eventElement)
                if (linkView.model.isLink()) {
                    if (linkView.model.vertices().length === 0) {
                        linkView.model.vertices([{
                            x: (linkView.sourceAnchor.x + linkView.targetAnchor.x) / 2,
                            y: (linkView.sourceAnchor.y + linkView.targetAnchor.y) / 2
                        }])
                    }
                    // linkView.model.vertices([])
                    setActiveLink(linkView.model);
                    stackGraph(graph);
                    let targetCell = linkView.model.getTargetCell()
                    let sourceCell = linkView.model.getSourceCell()
                    if (sourceCell.attributes.typeOfCell !== "root" && targetCell.attributes.typeOfCell !== "root") {
                        setOpenModalWindow(true);
                    }
                }
            }))
        });

        paper.on('link:mouseenter', (linkView, e) => {
            linkView.addTools(toolsView);
            setActiveLinkViewRef(linkView);
            setActiveLinkView(linkView);
        });

        paper.on('blank:mouseover', () => {
            paper.removeTools();
            setActiveLinkViewRef(null);
            setActiveLinkView(null);
        });

        paper.unfreeze();


        graph.on('change:position', function (cell) {
            let allLinks = graph.getLinks();
            allLinks.forEach(link => { // TODO probably don't update all links, but only the ones near the cell
                link.findView(paper).requestConnectionUpdate();
            })
        });

        stackGraph(graph)
        setPaperRef(paper);
        setPaper(paper);

        let theCells = graph.getCells();

        theCells.forEach(cell => {
            cell.position(globalOffsetX, globalOffsetY);
        })
        // layout();


        window.addEventListener("dragstart", dragStart);
        window.addEventListener("dragenter", dragEnter);
        window.addEventListener("dragover", dragOver);
        window.addEventListener("drop", dragDrop);
        window.addEventListener("keyup", handleKeyPress);
        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("mousewheel", preventZoom, { passive: false });

        return () => {
            window.removeEventListener("dragstart", dragStart);
            window.removeEventListener("dragenter", dragEnter);
            window.removeEventListener("dragover", dragOver);
            window.removeEventListener("drop", dragDrop);
            window.removeEventListener("keyup", handleKeyPress);
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("mousewheel", preventZoom);
        };

    }, []);

    return (
        <div className='hold-paper'>
            <SelectCells
                reverseGraph={reverseGraph}
                layout={layout}
            />
            <div
                id='canvas'
                onWheel={handleScroll}
                ref={canvas}
            />
            {openModalWindow && activeLink && <ModalWindow
                joint={joint}
                portCellOptions={portCellOptions}
                setOpenModalWindow={setOpenModalWindow}
                activeLink={activeLink}
                graph={graph}
                stackGraph={stackGraph}
                cellData={earnCell}
                layout={layout}
                subLayout={subLayout}
            />}
            <InitButtons
                addBaseToken={addBaseToken}
                baseTokenCellView={baseTokenCellView}
                editBaseToken={editBaseToken}
            />
        </div>
    );
}

export default Paper;