import React, { useState, useEffect, useRef, useCallback, useContext } from 'react';
import ModalWindow from '../ModalWindow/ModalWindow';
import InitButtons from '../InitButtons/InitButtons';
import SelectCells from '../SelectCells/SelectCells';

import { DiagramContext } from '../Content/context';
import * as joint from 'jointjs';
import dagre from 'dagre';
import graphlib from 'graphlib';
import { cells, earnCell, frameCell, frameHorizantalLine, frameVerticalLine } from './cells';
import { ports, portCellOptions, rootPortCellOptions } from './ports';
import { diamondShape, frameShape, toolsView, toolsViewVertices } from './options';
import "./styles.css";
import { convertObjToStr, swapItems } from '../../utils/utils';

import donkeylogo from "./Group 3722.png";

// the name space needed for importing graph from json, which is what we do when press undo button
// in here we added custom node, so that now jointjs nows what to build when it finds that the type of a node is custom.Diamond
const customNameSpace = Object.assign(joint.shapes, {
    custom: {
        Diamond: diamondShape,
        Frame: frameShape
    }
});

// joint.shapes.basic.Rhombus = diamondShape;

const globalOffsetX = 350;
const globalOffsetY = 40;


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
        let targetCell = activeLink.getTargetCell();
        let sourceCell = activeLink.getSourceCell();
        if (targetCell && sourceCell) {
            let targetCellType = convertObjToStr(targetCell.attributes.typeOfCell);
            let sourceCellType = convertObjToStr(sourceCell.attributes.typeOfCell);
            let sourcePort = sourceCell.getPort(activeLink.attributes.source.port);
            let targetPort = targetCell.getPort(activeLink.attributes.target.port);
            let sourcePortPosition = sourcePort.group;
            let targetPortPosition = targetPort.group;
            // if (sourcePortPosition === "top" && targetPortPosition === "bottom") {
            let sourceCellsNeighbors = graph.getNeighbors(sourceCell)
            // if (targetPortPosition === "bottom") {
            let isNewCell = sourceCellsNeighbors.length <= 1;
            let isConnectionBetweenEarns = sourceCellType === "earn_cell" && targetCellType === "base_token";

            if (isNewCell || isConnectionBetweenEarns) {
                activeLink.target({ id: sourceCell.id, port: sourcePort.id })
                activeLink.source({ id: targetCell.id, port: targetPort.id })
            }
        }
    }
}

function Paper(props) {


    const [openModalWindow, setOpenModalWindow] = useState(false);
    const [activeLink, setActiveLink] = useState(null);
    const [activeProtocol, setActiveProtocol] = useState(null);
    const [activeLinkView, setActiveLinkView] = useState(null);
    const [baseTokenCellView, setBaseTokenCellView] = useState(null);
    const [activeCellViewsArray, setActiveCellViewsArray] = useState([]);
    const [recentlyUsedProtocols, setRecentlyUsedProtocols] = useState([]);
    const [recentlyUsedActions, setRecentlyUsedActions] = useState([]);


    const [graph, setGraph] = useState(new joint.dia.Graph({}, { cellNamespace: customNameSpace }));
    const [graphHistory, setGraphHistory] = useState([])
    const [paper, setPaper] = useState(null);

    const [rootCell, setRootCell] = useState(null);

    const [isFrameAdded, setIsFrameAdded] = useState(false);

    const contextValues = useContext(DiagramContext);

    // we need refs for events


    const canvas = useRef(null);

    const getCanvas = () => {
        return canvas.current;
    }

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

    const activeCellViewsArrayRef = useRef(activeCellViewsArray);

    const getActiveCellViewsArrayRef = () => {
        return activeCellViewsArrayRef.current;
    }

    const setActiveCellViewsArrayRef = (val) => {
        activeCellViewsArrayRef.current = val;
    }

    const recentlyUsedProtocolsRef = useRef(recentlyUsedProtocols);

    const getRecentlyUsedProtocolsRef = () => {
        return recentlyUsedProtocolsRef.current;
    }

    const setRecentlyUsedProtocolsRef = (val) => {
        recentlyUsedProtocolsRef.current = val;
    }

    const dragStart = useCallback(event => {
        if (!event.target.className.includes("draggable")) return;
        event.dataTransfer.setData("text", event.target.getAttribute("protocolname"));
        event.dataTransfer.setData("color", event.target.getAttribute("color") || "#FFFFFF");
        event.dataTransfer.setData("borderColor", event.target.getAttribute("bordercolor") || "#222222");
        event.dataTransfer.setData("image", event.target.getAttribute("image"));
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
        if (!graph || (event.target.tagName !== "svg" && event.target.tagName !== "path")) return;

        let rectBounds = event.target.getBoundingClientRect();
        let paperCoords = getPaperRef().translate();
        let paperScale = getPaperRef().scale().sx;
        paperCoords.tx = paperCoords.tx / paperScale;
        paperCoords.ty = paperCoords.ty / paperScale;
        let cellCoords = {
            x: -paperCoords.tx + (event.clientX - rectBounds.left) / paperScale,
            y: -paperCoords.ty + (event.clientY - rectBounds.top) / paperScale
        }
        cellCoords.x = cellCoords.x - (cellCoords.x % 10);
        cellCoords.y = cellCoords.y - (cellCoords.y % 10);
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
                x: cellCoords.x,
                y: cellCoords.y
            },
            size: { width: 100, height: 100 },
            inPorts: ['in'],
            outPorts: ['out'],
            ports: portCellOptions
        });

        newCell.attr('polygon/fill', event.dataTransfer.getData('color'))
        newCell.attr('polygon/stroke', event.dataTransfer.getData('borderColor'))
        if (event.dataTransfer.getData('image') !== "null") {
            newCell.attr('image/xlink:href', event.dataTransfer.getData('image'))
        }
        graph.addCell(newCell)
        // layout();

        stackGraph(graph)


        let isProtocolAdded = false;
        getRecentlyUsedProtocolsRef().forEach((protocol) => {
            if (protocol.name === event.dataTransfer.getData("text")) {
                isProtocolAdded = true;
            }
        })
        if (!isProtocolAdded) {
            let newRecentlyUsedProtocol = {
                name: event.dataTransfer.getData("text")
            };
            setRecentlyUsedProtocols(protocols => [...protocols, newRecentlyUsedProtocol]);
            setRecentlyUsedProtocolsRef([...getRecentlyUsedProtocolsRef(), newRecentlyUsedProtocol]);
            localStorage.setItem("recentlyUsedProtocols", JSON.stringify([...getRecentlyUsedProtocolsRef()]))
        }
    }, []);

    const addRecentlyUsedAction = (actionName) => {
        let isActionAdded = false;
        recentlyUsedActions.forEach((action) => {
            if (action.name === actionName) {
                isActionAdded = true;
            }
        })
        if (!isActionAdded) {
            let newRecentlyUsedAction = {
                name: actionName
            };
            setRecentlyUsedActions(action => [...action, newRecentlyUsedAction]);
            localStorage.setItem("recentlyUsedActions", JSON.stringify([...recentlyUsedActions, newRecentlyUsedAction]))
        }
    }

    const layout = (activeLink) => {

        changeActiveLinkParenting(graph, activeLink)

        let theElements = graph.getElements();
        let newElements = [...theElements];
        let swapIndexes = [];

        let theLinks = graph.getLinks()

        // here we reorder elements according to what port they are connected (left, top, bottom, right)
        theLinks.forEach((alink, i) => {
            // disable all vertices
            // it doesn't have to do anything with reordering
            // it is because auto layout will add new vertices
            alink.vertices([]);

            let targetCell = alink.getTargetCell()
            let sourceCell = alink.getSourceCell()
            let sourcePort = sourceCell.getPort(alink.attributes.source.port);

            // here we only write dowm which elements to swap
            // we don't swap on the spot, because it is not really about ordering of the elements
            // but about which element was updated last, which includes if it has changed position in the elements array
            // the logic is that all elements , which has LEFT source port should be updated first
            // then go BOTTOM and TOP source ports (doesn't matter which exactly)
            // and lastly we update elements with RIGHT source ports
            if (sourcePort.group === "left") {
                let theIndexToReplace = theElements.findIndex(el => {
                    return el.id === targetCell.id;
                });
                swapIndexes.unshift([0, theIndexToReplace, "L"])
            } else if (sourcePort.group === "right") {
                let theIndexToReplace = theElements.findIndex(el => {
                    return el.id === targetCell.id;
                });
                swapIndexes.push([theElements.length - 1, theIndexToReplace, "R"])
            } else {
                let theIndexToReplace = theElements.findIndex(el => {
                    return el.id === targetCell.id;
                });
                swapIndexes.splice(Math.floor((swapIndexes.length - 1) / 2), 0, [Math.floor((theElements.length - 1) / 2), theIndexToReplace, "B/T"])
            }
        })

        // TODO for some reason the ordering could still be wrong
        // so we have to iterate the array one more time to make sure
        // needs to be fixed
        swapIndexes.forEach((indexes, i) => {
            if (indexes[2] === "L") {
                swapIndexes = swapItems(swapIndexes, 0, i)
            } else if (indexes[2] === "R") {
                swapIndexes = swapItems(swapIndexes, swapIndexes.length - 1, i)
            }
        })

        // here we finaly swap the elements according to logic described above
        swapIndexes.forEach((indexes) => {
            newElements = swapItems(theElements, indexes[0], indexes[1]);
        })

        let elementsToLayout = theElements;
        elementsToLayout = [];
        theElements.forEach(element => {
            if (element.attributes.typeOfCell !== "frame") {
                elementsToLayout.push(element)
            }
        })

        joint.layout.DirectedGraph.layout(graph.getSubgraph(elementsToLayout), {
            dagre: dagre,
            graphlib: graphlib,
            setVertices: true,
            marginX: globalOffsetX,
            marginY: globalOffsetY,
            nodeSep: NODE_SEP,
            edgeSep: EDGE_SEP,
            rankSep: RANK_SEP,
            setLinkVertices: false,
            ranker: "network-simplex",
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


    }

    const subLayout = (link, cell) => {
        // the idea is not to layout the whole graph but only a little subtree
        let sourceCell = cell;
        if (!sourceCell) {
            sourceCell = link.getSourceCell();
        }
        if (sourceCell) {
            let sourceChildren = graph.getSuccessors(sourceCell);

            let cellsToLayout = [sourceCell, ...sourceChildren];

            let sourceCellPosition = sourceCell.attributes.position;
            joint.layout.DirectedGraph.layout(graph.getSubgraph(cellsToLayout), {
                dagre: dagre,
                graphlib: graphlib,
                setVertices: true,
                marginX: sourceCellPosition.x,
                marginY: sourceCellPosition.y,
                nodeSep: NODE_SEP,
                edgeSep: EDGE_SEP,
                rankSep: RANK_SEP,
                setLinkVertices: false,
                ranker: "network-simplex"
            });
        }

    }

    const addBaseToken = (tokenName, tokenUrl) => {

        let newLink = new joint.shapes.standard.Link();
        newLink.router('manhattan', { excludeTypes: ['custom.Frame'] });

        newLink.attr({
            line: {
                strokeDasharray: '8 4',
                targetMarker: {
                    type: "none"
                }
            },
            text: {
                fontFamily: 'Roboto, sans-serif',
                fontStyle: "normal",
                fontWeight: 600,
                fontSize: "15px",
                lineHeight: "18px",
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
        let activeCells = getActiveCellViewsArrayRef()

        if (getActiveLinkViewRef()) {
            if (e.key === "Control") {
                getActiveLinkViewRef().addTools(toolsView);
            } else if (e.key === "Delete") {
                stackGraph(getGraphRef())
                getActiveLinkViewRef().model.remove();
                setActiveLinkViewRef(null);
                setActiveLinkView(null);
                // stackGraph
            }
        } else if (activeCells.length > 0) {
            if (e.key === "Delete") {
                stackGraph(getGraphRef());
                let newActiveCells = [];
                activeCells.forEach(activeCell => {
                    if (activeCell.model.attributes.typeOfCell !== "root") {
                        activeCell.model.remove();
                    } else {
                        newActiveCells.push(activeCell)
                    }
                })
                setActiveCellViewsArrayRef([...newActiveCells]);
                setActiveCellViewsArray(a => [...newActiveCells]);
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

    const drawFrame = () => {
        // if (paper.options.restrictTranslate) {
        if (isFrameAdded) {
            // paper.options.restrictTranslate = false;
            setIsFrameAdded(false);
            let cells = graph.getElements();
            cells.forEach(cell => {
                if (cell.attributes.typeOfCell === "frame") {
                    cell.remove();
                }
            })
        } else {
            setIsFrameAdded(true);
            let frameElement = new frameShape({ ...frameCell });
            frameElement.attr(".l/height", contextValues.frameDimensions.h)
            frameElement.attr(".l/d", `M 0 0 L 0 ${contextValues.frameDimensions.h} Z`);
            frameElement.attr(".t/width", contextValues.frameDimensions.w)
            frameElement.attr(".t/d", `M 0 ${contextValues.frameDimensions.h} L ${contextValues.frameDimensions.w} ${contextValues.frameDimensions.h} Z`);
            frameElement.attr(".r/height", contextValues.frameDimensions.h)
            frameElement.attr(".r/d", `M ${contextValues.frameDimensions.w} ${contextValues.frameDimensions.h} L ${contextValues.frameDimensions.w} 0 Z`);
            frameElement.attr(".b/width", contextValues.frameDimensions.w)
            frameElement.attr(".b/d", `M ${contextValues.frameDimensions.w} 0 L 0 0 Z`);
            graph.addCell(frameElement);
        }
    }

    useEffect(() => {
        let link = new joint.shapes.standard.Link();

        link.router('manhattan', { excludeTypes: ['custom.Frame'] });
        link.attr({
            line: {
                strokeDasharray: '8 4',
                targetMarker: {
                    type: "none"
                }
            },
            text: {
                fontFamily: 'Roboto, sans-serif',
                fontStyle: "normal",
                fontWeight: 600,
                fontSize: "15px",
                lineHeight: "18px",
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
                // color: 'linear-gradient(90deg, #F6F6F6 50%, #00FFFF 50%)'
            },
            perpendicularLinks: true,
            cellViewNamespace: customNameSpace,
            highlighting: {
                connecting: {
                    name: "stroke",
                    options: {
                        padding: 30
                    }
                }
            },
            interactive: (cellView, a) => {
                // if (cellView.model.attributes.typeOfCell === "frame") {
                //     return false;
                // }
                return true;
            },
            // restrictTranslate: true,
            validateConnection: (cellViewS, magnetS, cellViewT, magnetT, end, linkView) => {
                let sourceTypeOfCell = cellViewS.model.attributes.typeOfCell;
                let targetTypeOfCell = cellViewT.model.attributes.typeOfCell;
                return cellViewS.id !== cellViewT.id &&
                    !cellViewT.model.isLink()
                // &&
                // ((sourceTypeOfCell !== "root" &&
                //     targetTypeOfCell !== "root") ||
                //     (sourceTypeOfCell === "root" && targetTypeOfCell === "base_token") ||
                //     (sourceTypeOfCell === "base_token" && targetTypeOfCell === "root"));
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
                    let verticeX = (linkView.sourceAnchor.x + linkView.targetAnchor.x) / 2;
                    let verticeY = (linkView.sourceAnchor.y + linkView.targetAnchor.y) / 2;
                    verticeX -= (verticeX % 10);
                    verticeY -= (verticeY % 10);
                    linkView.model.vertices([{
                        x: verticeX,
                        y: verticeY
                    }])
                }
                // linkView.model.vertices([])
                setActiveLink(linkView.model);
                setActiveProtocol(null);
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
            let activeCells = getActiveCellViewsArrayRef();
            if (!cellView.model.isLink()) {
                if (e.ctrlKey) {
                    let deltedFromSelection = false;
                    let newActiveCells = activeCells.filter((activeCell, i) => {
                        if (activeCell.model.id === cellView.model.id) {
                            deltedFromSelection = true;
                            cellView.unhighlight();
                            return false;
                        }
                        return true;
                    });
                    if (!deltedFromSelection) {
                        cellView.highlight();
                        newActiveCells = [...activeCells, cellView];
                    }

                    setActiveCellViewsArrayRef([...newActiveCells]);
                    setActiveCellViewsArray(a => [...newActiveCells]);
                } else {
                    if (activeCells.length > 0) {
                        if (activeCells.length === 1 && activeCells[0].id === cellView.id) {

                            let activeCells = getActiveCellViewsArrayRef()
                            activeCells.forEach(activeCell => {
                                activeCell.unhighlight()
                            })
                            setActiveCellViewsArrayRef([]);
                            setActiveCellViewsArray(a => []);
                        } else {

                            let activeCells = getActiveCellViewsArrayRef()
                            activeCells.forEach(activeCell => {
                                activeCell.unhighlight()
                            })
                            cellView.highlight();
                            setActiveCellViewsArrayRef([cellView]);
                            setActiveCellViewsArray(a => [cellView]);
                        }
                    } else {
                        cellView.highlight();
                        setActiveCellViewsArrayRef([cellView]);
                        setActiveCellViewsArray(a => [cellView]);
                    }
                }
            }
        }))

        paper.on("cell:pointermove", (cellView, e, x, y) => {
            // console.log(e.target)
            let activeCells = getActiveCellViewsArrayRef();
            let isHighlighted = false;
            activeCells.forEach(activeCell => {
                if (activeCell.model.id === cellView.model.id) {
                    isHighlighted = true;
                }
            })
            if (isHighlighted) {
                let { originalEvent } = e;
                let paperScale = getPaperRef().scale().sx;
                activeCells.forEach(activeCell => {
                    let activeCellModel = activeCell.model;
                    if (activeCellModel.id !== cellView.model.id) {
                        activeCellModel.translate(
                            originalEvent.movementX / paperScale,
                            originalEvent.movementY / paperScale,
                        );
                    }
                })
            }

            if (cellView.model.isElement()) {
                let theLinks = getGraphRef().getLinks();

                theLinks.forEach(link => {
                    let linkView = link.findView(getPaperRef());
                    let verticeX = (linkView.sourceAnchor.x + linkView.targetAnchor.x) / 2;
                    let verticeY = (linkView.sourceAnchor.y + linkView.targetAnchor.y) / 2;
                    verticeX -= (verticeX % 10);
                    verticeY -= (verticeY % 10);
                    link.vertices([{
                        x: verticeX,
                        y: verticeY
                    }]);
                })
            }
        })

        paper.on("cell:pointerup", (cellView, e, x, y) => {
            let activeCells = getActiveCellViewsArrayRef();
            let isHighlighted = false;
            activeCells.forEach(activeCell => {
                if (activeCell.model.id === cellView.model.id) {
                    isHighlighted = true;
                }
            })
            if (isHighlighted) {
                activeCells.forEach(activeCell => {
                    let activeCellModel = activeCell.model;
                    if (activeCellModel.id !== cellView.model.id) {
                        let thePos = activeCellModel.attributes.position;
                        // first make it so the position is a fractional number
                        activeCellModel.translate(
                            -(thePos.x % 1),
                            -(thePos.y % 1),
                        );
                        // then snap it to grid
                        thePos = activeCellModel.attributes.position;
                        activeCellModel.translate(
                            -(thePos.x % 10),
                            -(thePos.y % 10),
                        );
                    }
                })
            }

        })

        paper.on("cell:pointerdblclick", ((cellView, e, x, y) => {
            if (!cellView.model.isLink() && cellView.model.attributes.typeOfCell === "base_token") {
                setBaseTokenCellView(cellView);
            }
        }))

        paper.on("link:pointerdblclick", ((linkView, e, x, y) => {
            if (!e.ctrlKey && linkView.model.isLink()) {
                let currentLink = linkView.model;
                setActiveLink(currentLink);
                setActiveProtocol(null);
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
                let newTranslate = {
                    x: paperPos.tx + movePos.x - newClickPos.x,
                    y: paperPos.ty + movePos.y - newClickPos.y
                }
                paper.translate(
                    newTranslate.x,
                    newTranslate.y
                )
                if (paper.options.restrictTranslate) {
                    let paperTranslate = paper.translate();
                    paper.options.restrictTranslate = {
                        x: paperTranslate.x,
                        y: paperTranslate.y,
                        width: contextValues.frameDimensions.w,
                        height: contextValues.frameDimensions.h
                    };
                }
            }))
        }))

        graph.on('add', (eventElement) => {
            paper.off("link:connect")
            paper.on("link:connect", ((linkView, event, elementViewConnected, magnet, arrowhead) => {
                // layout(eventElement);
                changeActiveLinkParenting(graph, eventElement)
                if (linkView.model.isLink()) {
                    if (linkView.model.vertices().length === 0) {
                        let verticeX = (linkView.sourceAnchor.x + linkView.targetAnchor.x) / 2;
                        let verticeY = (linkView.sourceAnchor.y + linkView.targetAnchor.y) / 2;
                        verticeX -= (verticeX % 10);
                        verticeY -= (verticeY % 10);
                        linkView.model.vertices([{
                            x: verticeX,
                            y: verticeY
                        }])
                    }
                    // linkView.model.vertices([])
                    setActiveLink(linkView.model);
                    setActiveProtocol(null);
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

        paper.on("link:pointerup", (linkView, e, x, y) => {
            
            let sourceCell = graph.getCell(linkView.model.attributes.source.id);
            let jointSelector = e.target.getAttribute("joint-selector");
            if (!jointSelector || jointSelector === "body" || jointSelector === "polygon" || jointSelector === "image") {
                let theElements = graph.getElements();
                let thePosition = { x, y };
                let closestElement = theElements[0];

                let closestElementPosition = {...closestElement.attributes.position};
                closestElementPosition.x += closestElement.attributes.size.width / 2;
                closestElementPosition.y += closestElement.attributes.size.height / 2;

                let closestDistance = Math.sqrt(Math.pow(closestElementPosition.x - thePosition.x, 2) + Math.pow(closestElementPosition.y - thePosition.y, 2));
                theElements.forEach((el, i) => {

                    let elPosition = {...el.attributes.position};
                    elPosition.x += el.attributes.size.width / 2;
                    elPosition.y += el.attributes.size.height / 2;

                    let distanceToElement = Math.sqrt(Math.pow(elPosition.x - thePosition.x, 2) + Math.pow(elPosition.y - thePosition.y, 2));
                    if (distanceToElement < closestDistance) {
                        closestElement = theElements[i];
                        closestDistance = distanceToElement;
                        closestElementPosition = {...closestElement.attributes.position};
                        closestElementPosition.x += closestElement.attributes.size.width / 2;
                        closestElementPosition.y += closestElement.attributes.size.height / 2;
                    }
                })

                closestElementPosition.x -= closestElement.attributes.size.width / 2;
                closestElementPosition.y -= closestElement.attributes.size.height / 2;

                if (sourceCell.id !== closestElement.id) {

                    let cellPorts = closestElement.getPorts();
                    let closestPort = cellPorts[0];

                    let closestPortPosition = closestElement.getPortsPositions(closestPort.group);
                    closestPortPosition = closestPortPosition[Object.keys(closestPortPosition)[0]];
                    closestPortPosition.x += closestElementPosition.x;
                    closestPortPosition.y += closestElementPosition.y;

                    closestDistance = Math.sqrt(Math.pow(closestPortPosition.x - thePosition.x, 2) + Math.pow(closestPortPosition.y - thePosition.y, 2));

                    cellPorts.forEach((port, i) => {

                        let currentPortPosition = closestElement.getPortsPositions(port.group);
                        currentPortPosition = currentPortPosition[Object.keys(currentPortPosition)[0]];
                        currentPortPosition.x += closestElementPosition.x;
                        currentPortPosition.y += closestElementPosition.y;

                        let distanceToPort = Math.sqrt(Math.pow(currentPortPosition.x - thePosition.x, 2) + Math.pow(currentPortPosition.y - thePosition.y, 2));

                        if (distanceToPort < closestDistance) {

                            closestPort = cellPorts[i];
                            closestDistance = distanceToPort;
                        }

                    })


                    let sourcePort = sourceCell.getPort(linkView.model.attributes.source.port);


                    let sourceCellsNeighbors = graph.getNeighbors(sourceCell)
                    // if (targetPortPosition === "bottom") {
                    let isNewCell = sourceCellsNeighbors.length < 1;

                    if (isNewCell) {
                        linkView.model.target({ id: sourceCell.id, port: sourcePort.id })
                        linkView.model.source({ id: closestElement.id, port: closestPort.id })
                    } else {
                        linkView.model.target({ id: closestElement.id, port: closestPort.id })
                        linkView.model.source({ id: sourceCell.id, port: sourcePort.id })
                    }

                    

                    linkView.model.addTo(graph)
                    setActiveLink(linkView.model);
                    setActiveProtocol(null);
                    stackGraph(graph);
                    setOpenModalWindow(true);
                }
            }
        })

        paper.on('blank:mouseover', () => {
            paper.removeTools();
            setActiveLinkViewRef(null);
            setActiveLinkView(null);
        });

        paper.on('blank:pointerclick', () => {
            let activeCells = getActiveCellViewsArrayRef()
            if (activeCells.length > 0) {

                activeCells.forEach(activeCell => {
                    activeCell.unhighlight()
                })
                setActiveCellViewsArrayRef([]);
                setActiveCellViewsArray(a => []);
            }
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
        layout();

        let localStorageProtocols = localStorage.getItem("recentlyUsedProtocols");
        if (localStorageProtocols) {
            setRecentlyUsedProtocols(JSON.parse(localStorageProtocols));
            setRecentlyUsedProtocolsRef(JSON.parse(localStorageProtocols));
        }

        let localStorageActions = localStorage.getItem("recentlyUsedActions");
        if (localStorageActions) {
            setRecentlyUsedActions(JSON.parse(localStorageActions));
        }

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
                svgElement={getCanvas()}
                reverseGraph={reverseGraph}
                protocols={props.protocols}
                layout={layout}
                paper={getPaperRef()}
                graph={graph}
                drawFrame={drawFrame}
                isFrameAdded={isFrameAdded}
                recentlyUsedProtocols={recentlyUsedProtocols}
                recentlyUsedActions={recentlyUsedActions}
                addRecentlyUsedAction={addRecentlyUsedAction}
                setActiveProtocol={setActiveProtocol}
                setOpenModalWindow={setOpenModalWindow}
            />
            <div
                id='canvas'
                onWheel={handleScroll}
                ref={canvas}
            />
            {openModalWindow &&
            // ((activeLink && !activeProtocol) ||
            // (activeProtocol && !activeLink))
            (activeProtocol || activeLink) 
            &&
            <ModalWindow
                joint={joint}
                portCellOptions={portCellOptions}
                setOpenModalWindow={setOpenModalWindow}
                activeLink={activeLink}
                activeProtocol={activeProtocol}
                graph={graph}
                stackGraph={stackGraph}
                cellData={earnCell}
                layout={layout}
                subLayout={subLayout}
                setActiveProtocol={setActiveProtocol}
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