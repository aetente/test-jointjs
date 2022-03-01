import React, { useState, useEffect, useRef, useCallback, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as joint from 'jointjs';
import dagre from 'dagre';
import graphlib from 'graphlib';


import ModalWindow from '../ModalWindow/ModalWindow';
import InitButtons from '../InitButtons/InitButtons';
import SelectCells from '../SelectCells/SelectCells';

import { DiagramContext } from '../Content/context';
import { cells, earnCell, frameCell, tradingFeeCell } from './cells';
import { ports, portCellOptions, rootPortCellOptions, tradingFeePortCellOptions } from './ports';
import { diamondShape, frameShape, bridgeShape, rectDiamondShape, toolsView, toolsViewVertices, loopActionShape, LoopActionTools, tokenShape } from './options';
import "./styles.css";
import { convertObjToStr, swapItems } from '../../utils/utils';

import { uiActions } from '../../actions';

import donkeylogo from "./Group 3722.png";

const linkMarkup = [
    {
        tagName: 'path',
        selector: 'line',
    }, {
        tagName: 'path',
        selector: 'offsetLabelPositiveConnector'
    }, {
        tagName: 'path',
        selector: 'offsetLabelNegativeConnector'
    }
]

// the name space needed for importing graph from json, which is what we do when press undo button
// in here we added custom node, so that now jointjs nows what to build when it finds that the type of a node is custom.Diamond
const customNameSpace = Object.assign(joint.shapes, {
    custom: {
        RectDiamond: rectDiamondShape,
        Diamond: diamondShape,
        Frame: frameShape,
        LoopAction: loopActionShape,
        Token: tokenShape,
        Bridge: bridgeShape
    }
});

const globalOffsetX = 350;
const globalOffsetY = 40;


const NODE_SEP = 300;
const EDGE_SEP = 150;
const RANK_SEP = 157.5;

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
    const [openAddTokenToSelect, setOpenAddTokenToSelect] = useState(false);
    const [activeLink, setActiveLink] = useState(null);
    const [activeProtocol, setActiveProtocol] = useState(null);
    const [activeLinkView, setActiveLinkView] = useState(null);
    const [baseTokenCellView, setBaseTokenCellView] = useState(null);
    const [activeCellViewsArray, setActiveCellViewsArray] = useState([]);
    const [recentlyUsedProtocols, setRecentlyUsedProtocols] = useState([]);
    const [recentlyUsedTokens, setRecentlyUsedTokens] = useState([]);
    const [recentlyUsedActions, setRecentlyUsedActions] = useState([]);

    const [protocols, setProtocols] = useState([])
    const [protocolCells, setProtocolCells] = useState([])


    const [graph, setGraph] = useState(new joint.dia.Graph({}, { cellNamespace: customNameSpace }));
    const [graphHistory, setGraphHistory] = useState([])
    const [paper, setPaper] = useState(null);

    const [rootCell, setRootCell] = useState(null);

    const [isFrameAdded, setIsFrameAdded] = useState(false);

    const [activeLabel, setActiveLabel] = useState(null);

    const [labelsToMove, setLabelsToMove] = useState([]);

    const [editingGeometry, setEditingGeometry] = useState(false);

    const [activeLoopAction, setActiveLoopAction] = useState(null);

    const [activeToken, setActiveToken] = useState(null);
    const [tokenCells, setTokenCells] = useState([]);

    const [isMerge, setIsMerge] = useState(false);

    const [activeBridge, setActiveBridge] = useState(null);

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

    const recentlyUsedTokensRef = useRef(recentlyUsedTokens);

    const getRecentlyUsedTokensRef = () => {
        return recentlyUsedTokensRef.current;
    }

    const setRecentlyUsedTokensRef = (val) => {
        recentlyUsedTokensRef.current = val;
    }

    const activeLabelRef = useRef(activeLabel);

    const getActiveLabelRef = () => {
        return activeLabelRef.current;
    }

    const setActiveLabelRef = (val) => {
        activeLabelRef.current = val;
    }

    const labelsToMoveRef = useRef(labelsToMove);

    const getLabelsToMoveRef = () => {
        return labelsToMoveRef.current;
    }

    const setLabelsToMoveRef = (val) => {
        labelsToMoveRef.current = val;
    }

    const editingGeometryRef = useRef(editingGeometry);

    const getEditingGeometryRef = () => {
        return editingGeometryRef.current;
    }

    const setEditingGeometryRef = (val) => {
        editingGeometryRef.current = val;
    }


    const dispatch = useDispatch();

    const createCircle = () => {
        // setEditingGeometry(true);
        // setEditingGeometryRef(true);

        let paperCoords = getPaperRef().translate();
        let paperScale = getPaperRef().scale().sx;
        paperCoords.tx = paperCoords.tx / paperScale;
        paperCoords.ty = paperCoords.ty / paperScale;
        let cellCoords = {
            x: -paperCoords.tx + (window.innerWidth / 2) / paperScale,
            y: -paperCoords.ty + (window.innerHeight / 2) / paperScale
        }
        cellCoords.x = cellCoords.x - (cellCoords.x % 10);
        cellCoords.y = cellCoords.y - (cellCoords.y % 10);
        let loopCell = new loopActionShape({
            position: {
                x: cellCoords.x,
                y: cellCoords.y
            }
        });
        setActiveLoopAction(loopCell)
        setActiveProtocol(null);
        setActiveToken(null);
        setActiveBridge(null);
        setActiveLink(null);
        setOpenModalWindow(true);
        loopCell.toBack();
        graph.addCell(loopCell)
        loopCell.findView(getPaperRef()).addTools(LoopActionTools)
    }

    const dragStart = useCallback(event => {
        if (!event.target ||
            !event.target.getAttribute ||
            !event.target.getAttribute("class") ||
            !event.target.getAttribute("class").includes("draggable")
        ) {
            event.preventDefault();
            event.stopPropagation();
            return
        };
        event.dataTransfer.setData("type",
            (event.target.getAttribute("protocolid") && "protocol") ||
            (event.target.getAttribute("tokenid") && "token")
        );
        let urlValue = (event.target.getAttribute("protocolurl") || event.target.getAttribute("tokenurl")) || "";
        event.dataTransfer.setData("id", event.target.getAttribute("protocolid") || event.target.getAttribute("tokenid"));
        event.dataTransfer.setData("urlValue", urlValue);
        event.dataTransfer.setData("text", event.target.getAttribute("protocolname") || event.target.getAttribute("tokenname"));
        event.dataTransfer.setData("color", event.target.getAttribute("color") || "#FFFFFF");
        event.dataTransfer.setData("borderColor", event.target.getAttribute("bordercolor") || "#222222");
        event.dataTransfer.setData("image", event.target.getAttribute("image"));
        event.dataTransfer.setData("designImage", event.target.getAttribute("designimage"));
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
        let dragText = (event.dataTransfer.getData('designImage') === "null" && event.dataTransfer.getData('text')) || "";
        let scaleText = (dragText.length > 5 && Math.pow(5 / dragText.length, 1 / 2)) || 1;
        let scaleValue = `scale(${scaleText},${scaleText})`;
        let newCell = null;
        let typeOfDragElement = event.dataTransfer.getData('type');
        if (typeOfDragElement === "protocol") {
            newCell = new rectDiamondShape({
                attrs: {
                    label: {
                        text: dragText
                    },
                    text: {
                        text: dragText,
                        transform: scaleValue
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
                ports: portCellOptions,
                protocolText: event.dataTransfer.getData('text'),
                protocolId: event.dataTransfer.getData('id'),
                protocolUrl: event.dataTransfer.getData('urlValue'),
                backgroundColor: event.dataTransfer.getData('color'),
                borderColor: event.dataTransfer.getData('borderColor')
            });
            if (event.dataTransfer.getData('designImage') === "null") {
                newCell.attr('.rect-body/fill', event.dataTransfer.getData('color'));
                newCell.attr('.rect-body/stroke', event.dataTransfer.getData('borderColor'));
                if (event.dataTransfer.getData('image') !== "null") {
                    newCell.attr('image/xlink:href', event.dataTransfer.getData('image'));
                }
            } else {
                newCell.attr('design-image/xlink:href', event.dataTransfer.getData('designImage'));
                newCell.attr('.rect-body/fill', "none");
                newCell.attr('.rect-body/stroke', "none");
            }
        } else {
            newCell = new tokenShape({
                ...earnCell,
                attrs: {
                    ...earnCell.attrs,
                    label: {
                        text: dragText
                    }
                },
                position: {
                    x: cellCoords.x,
                    y: cellCoords.y
                },
                ports: portCellOptions,
                tokenText: event.dataTransfer.getData('text'),
                tokenId: event.dataTransfer.getData('id'),
                tokenUrl: event.dataTransfer.getData('urlValue'),
                backgroundColor: event.dataTransfer.getData('color'),
                borderColor: event.dataTransfer.getData('borderColor'),
                image: event.dataTransfer.getData('image') || "",
                typeOfCell: "earn_cell"
            });

            if (event.dataTransfer.getData('designImage') === "null") {
                newCell.attr('token-body/fill', event.dataTransfer.getData('color'));
                newCell.attr('token-body/stroke', event.dataTransfer.getData('borderColor'));
            } else {
                newCell.attr('design-image/xlink:href', event.dataTransfer.getData('designImage'));
                newCell.attr('token-body/fill', "none");
                newCell.attr('token-body/stroke', "none");
            }
        }

        if (newCell) {
            graph.addCell(newCell)
            // layout();

            stackGraph(graph)


            if (typeOfDragElement === "protocol") {
                let isProtocolAdded = false;
                getRecentlyUsedProtocolsRef().forEach((protocol) => {
                    if (protocol.id === event.dataTransfer.getData("id")) {
                        isProtocolAdded = true;
                    }
                })
                if (!isProtocolAdded) {
                    let newRecentlyUsedProtocol = {
                        id: event.dataTransfer.getData("id")
                    };
                    setRecentlyUsedProtocols(protocols => [...protocols, newRecentlyUsedProtocol]);
                    setRecentlyUsedProtocolsRef([...getRecentlyUsedProtocolsRef(), newRecentlyUsedProtocol]);
                    localStorage.setItem("recentlyUsedProtocols", JSON.stringify([...getRecentlyUsedProtocolsRef()]))
                }
            } else {
                let isTokenAdded = false;
                getRecentlyUsedTokensRef().forEach((token) => {
                    if (token.id === event.dataTransfer.getData("id")) {
                        isTokenAdded = true;
                    }
                })
                if (!isTokenAdded) {
                    let newRecentlyUsedToken = {
                        id: event.dataTransfer.getData("id")
                    };
                    setRecentlyUsedTokens(tokens => [...tokens, newRecentlyUsedToken]);
                    setRecentlyUsedTokensRef([...getRecentlyUsedTokensRef(), newRecentlyUsedToken]);
                    localStorage.setItem("recentlyUsedTokens", JSON.stringify([...getRecentlyUsedTokensRef()]))
                }
            }
        }
    }, []);

    const addEmptyNode = () => {
        let paperCoords = getPaperRef().translate();
        let paperScale = getPaperRef().scale().sx;
        paperCoords.tx = paperCoords.tx / paperScale;
        paperCoords.ty = paperCoords.ty / paperScale;
        let cellCoords = {
            x: -paperCoords.tx + (window.innerWidth / 2) / paperScale,
            y: -paperCoords.ty + (window.innerHeight / 2) / paperScale
        }
        cellCoords.x = cellCoords.x - (cellCoords.x % 10);
        cellCoords.y = cellCoords.y - (cellCoords.y % 10);
        let newProtocolId = props.protocols.length;
        props.protocols.forEach((p) => {
            if (+p.id >= newProtocolId) {
                newProtocolId = (+p.id) + 1;
            }
        })
        newProtocolId = String(newProtocolId);
        let newCell = new rectDiamondShape({
            position: {
                x: cellCoords.x,
                y: cellCoords.y
            },
            size: { width: 100, height: 100 },
            inPorts: ['in'],
            outPorts: ['out'],
            ports: portCellOptions,
            protocolId: newProtocolId,
        });
        // newCell.attr('polygon/fill', "#19384d");
        // newCell.attr('polygon/stroke', "#19384d");

        newCell.attr('.rect-body/fill', "#DBD9D2")
        newCell.attr('.rect-body/stroke', "#19384d");


        setProtocolCells([newCell]);
        setActiveProtocol({
            id: newProtocolId,
            backgroundColor: "#19384d",
            borderColor: "#19384d",
            name: "",
            new: true
        });
        setActiveLoopAction(null);
        setActiveToken(null);
        setActiveBridge(null);
        graph.addCell(newCell)
    }

    const addEmptyToken = () => {
        let paperCoords = getPaperRef().translate();
        let paperScale = getPaperRef().scale().sx;
        paperCoords.tx = paperCoords.tx / paperScale;
        paperCoords.ty = paperCoords.ty / paperScale;
        let cellCoords = {
            x: -paperCoords.tx + (window.innerWidth / 2) / paperScale,
            y: -paperCoords.ty + (window.innerHeight / 2) / paperScale
        }
        cellCoords.x = cellCoords.x - (cellCoords.x % 10);
        cellCoords.y = cellCoords.y - (cellCoords.y % 10);
        let newTokenId = props.tokens.length;
        props.tokens.forEach((t) => {
            if (+t.id >= newTokenId) {
                newTokenId = (+t.id) + 1;
            }
        })
        newTokenId = String(newTokenId);
        let newCell = new tokenShape({
            ...earnCell,
            attrs: {
                ...earnCell.attrs,
            },
            label: {
                text: ""
            },
            position: {
                x: cellCoords.x,
                y: cellCoords.y
            },
            ports: portCellOptions,
            typeOfCell: "earn_cell",
            tokenId: newTokenId
        });



        setTokenCells([newCell]);
        setActiveToken({
            id: newTokenId,
            name: "",
            new: true
        })
        setActiveBridge(null);
        setActiveLoopAction(null);
        setActiveProtocol(null);
        graph.addCell(newCell)
    }

    const addEmptyBridge = () => {
        setActiveBridge({ from: "", to: "" });
        setActiveLoopAction(null);
        setActiveProtocol(null);
        setActiveToken(null);
        setOpenModalWindow(true);
    }

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
            if (element.attributes.typeOfCell !== "frame" &&
                element.attributes.type !== "custom.LoopAction" &&
                element.attributes.type !== "custom.Bridge") {
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
        if (!sourceCell && link) {
            sourceCell = link.getSourceCell();
        }
        if (sourceCell) {
            let sourceChildren = graph.getSuccessors(sourceCell);

            let cellsToLayout = [sourceCell, ...sourceChildren];

            let sourceCellPosition = sourceCell.attributes.position;
            let cellsSubgraph = graph.getSubgraph(cellsToLayout);

            const SUPPOSED_CELL_WIDTH = 100;
            joint.layout.DirectedGraph.layout(cellsSubgraph, {
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
            let subgraphBBox = graph.getCellsBBox(cellsSubgraph);
            joint.layout.DirectedGraph.layout(cellsSubgraph, {
                dagre: dagre,
                graphlib: graphlib,
                setVertices: true,
                marginX: sourceCellPosition.x - subgraphBBox.width / 2 + SUPPOSED_CELL_WIDTH / 2,
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

        let newLink = new joint.shapes.standard.Link({
            markup: linkMarkup
        });
        newLink.router('manhattan', { excludeTypes: ['custom.Frame', 'custom.LoopAction', 'custom.Bridge'] });

        newLink.attr({
            line: {
                strokeDasharray: '8 4',
                fill: "none",
                targetMarker: {
                    type: "none"
                }
            },
            text: {
                fontFamily: 'Roboto, sans-serif',
                fontStyle: "normal",
                // fontWeight: 600,
                // fontSize: "15px",
                lineHeight: "18px",
            }
        });

        let newCell = new tokenShape({
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
        setActiveProtocol(null);
        setActiveToken(null);
        setActiveBridge(null);
        setActiveLoopAction(null);
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

    const mergeAction = () => {

        let activeCells = [...getActiveCellViewsArrayRef()];
        let graph = getGraphRef();
        activeCells = activeCells.filter(activeCell => {
            return activeCell.model.attributes.type === "custom.Token"
        })
        if (activeCells.length > 1) {
            let isTheSameParent = true;
            let isSameToken = true;
            let parentEl = graph.getNeighbors(activeCells[0].model, { inbound: true })[0];
            let tokenName = activeCells[0].model.attributes.attrs.label.text;
            activeCells.forEach(cell => {
                let cellParents = graph.getNeighbors(cell.model, { inbound: true });
                let cellTokenName = cell.model.attributes.attrs.label.text;
                if (cellParents[0].id !== parentEl.id) {
                    isTheSameParent = false;
                }
                if (cellTokenName !== tokenName) {
                    isSameToken = false;
                }
            })
            if (isTheSameParent) {
                activeCells = activeCells.filter((cell, i) => {
                    if (i === 0) {
                        return true;
                    }
                    cell.model.remove();
                    return false;
                });
                if (!isSameToken) {
                    let theCellToken = {}
                    theCellToken.id = activeCells[0].model.attributes.tokenId;
                    theCellToken.name = activeCells[0].model.attributes.attrs.label.text;
                    theCellToken.url = activeCells[0].model.attributes.tokenUrl;
                    theCellToken.image = activeCells[0].model.attributes.image || "";
                    setActiveToken(theCellToken);
                    setTokenCells([activeCells[0].model]);
                    setActiveBridge(null);
                    setActiveProtocol(null);
                    setActiveLoopAction(null);
                    setActiveLink(null);
                    setOpenModalWindow(true);
                    setIsMerge(true);
                }
                subLayout(null, parentEl);
                setActiveCellViewsArray(activeCells);
                setActiveCellViewsArrayRef(activeCells);
            }
        }
    }

    useEffect(() => {
        dispatch(uiActions.pushTokenOption(
            {
                value: "Add new...",
                callback: () => { setOpenAddTokenToSelect(true) }
            }
        ));
        let link = new joint.shapes.standard.Link({
            markup: linkMarkup
        });

        link.router('manhattan', { excludeTypes: ['custom.Frame', 'custom.LoopAction', 'custom.Bridge'] });
        link.attr({
            line: {
                strokeDasharray: '8 4',
                fill: "none",
                targetMarker: {
                    type: "none"
                }
            },
            text: {
                fontFamily: 'Roboto, sans-serif',
                fontStyle: "normal",
                // fontWeight: 600,
                // fontSize: "15px",
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
            snapLabels: true,
            highlighting: {
                connecting: {
                    name: "stroke",
                    options: {
                        padding: 30
                    }
                }
            },
            interactive: (cellView, a) => {
                return true;
            },
            // restrictTranslate: true,
            validateConnection: (cellViewS, magnetS, cellViewT, magnetT, end, linkView) => {
                let sourceTypeOfCell = cellViewS.model.attributes.type;
                let targetTypeOfCell = cellViewT.model.attributes.type;
                return cellViewS.id !== cellViewT.id && targetTypeOfCell !== "custom.Bridge" &&
                    !cellViewS.model.isLink() && !cellViewT.model.isLink()
            }
        });

        cells.cells = cells.cells.map((cellData, i) => {
            let cell = new tokenShape({ ...cellData, ports: portCellOptions });
            if (cellData.typeOfCell === "root") {
                // cell = new diamondShape({ ...cellData, ports: rootPortCellOptions });

                cell = new rectDiamondShape({ ...cellData, ports: rootPortCellOptions });
                cell.attr('image/xlinkHref', donkeylogo)
                // cell.attr('polygon/fill', "#DBD9D2")
                cell.attr('.rect-body/fill', "#DBD9D2")
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
                setActiveToken(null);
                setActiveBridge(null);
                setActiveLoopAction(null);
                stackGraph(graph);
                let targetCell = linkView.model.getTargetCell()
                let sourceCell = linkView.model.getSourceCell()
                // if (sourceCell.attributes.typeOfCell !== "root" && targetCell.attributes.typeOfCell !== "root") {
                setOpenModalWindow(true);
                // }
            }
        }));

        paper.on("link:disconnect", ((linkView, event, elementViewConnected, magnet, arrowhead) => {
            // layout(activeLink);
            // setActiveLink(null);
            // setOpenModalWindow(false);
        }));

        paper.on("link:pointerdown", ((linkView, event, elementViewConnected, magnet, arrowhead) => {
            // in some cases we need to move other labels of the link along with the which was clicked on
            // console.log("link:pointerdown", linkView, event)
            let eventTarget = event.originalEvent.target;
            let eventTargetSelector = eventTarget.getAttribute("joint-selector") || eventTarget.parentElement.getAttribute("joint-selector");
            setActiveLabel(eventTargetSelector);
            setActiveLabelRef(eventTargetSelector);
        }))

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

        paper.on("cell:pointerdown", (cellView) => {
            cellView.model.toFront();
        })

        paper.on("cell:pointermove", (cellView, e, x, y) => {
            let activeCells = getActiveCellViewsArrayRef();
            let isHighlighted = false;
            activeCells.forEach(activeCell => {
                if (activeCell.model.id === cellView.model.id) {
                    isHighlighted = true;
                }
            })
            let { originalEvent } = e;
            let paperScale = getPaperRef().scale().sx;
            if (isHighlighted) {
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
                let elementClassName = e.target.getAttribute("class")
                if (elementClassName && (elementClassName.includes("to-circle") || elementClassName.includes("from-circle"))) {
                    // cellView.model.attr("from-text/cx", x);
                    // cellView.model.attr("from-circle/cy", y);
                } else {
                    // calculate placement for vertices of connected links
                    // let theLinks = getGraphRef().getLinks();
                    let cellsToUpdateLink = getActiveCellViewsArrayRef();
                    if (cellsToUpdateLink.length < 1 || !isHighlighted) {
                        cellsToUpdateLink = [cellView];
                    }
                    let theLinks = [];
    
                    cellsToUpdateLink.forEach(cellV => {
                        theLinks = [...theLinks, ...getGraphRef().getConnectedLinks(cellV.model)];
                    });
                    theLinks = theLinks.filter((l, i) => {
                        let posInLinks = theLinks.findIndex(link => link.id === l.id);
                        return posInLinks === i;
                    });
                    // cellsToUpdateLink.forEach(cellV => {
                    //     let theLinks = getGraphRef().getConnectedLinks(cellV.model);
    
                    theLinks.forEach(link => {
                        if (link.get("vertices")) {
                            let currentVertices = [...link.get("vertices")];
                            currentVertices = currentVertices.map(currentVertex => {
    
                                let dx = originalEvent.movementX / paperScale;
                                let dy = originalEvent.movementY / paperScale;
                                let newVertex = {
                                    x: Math.round(currentVertex.x + dx),
                                    y: Math.round(currentVertex.y + dy)
                                };
                                return newVertex;
                            })
                            link.vertices(currentVertices);
                        } else {
                            let linkView = link.findView(getPaperRef());
                            let verticeX = (linkView.sourceAnchor.x + linkView.targetAnchor.x) / 2;
                            let verticeY = (linkView.sourceAnchor.y + linkView.targetAnchor.y) / 2;
                            verticeX -= (verticeX % 10);
                            verticeY -= (verticeY % 10);
                            link.vertices([{
                                x: verticeX,
                                y: verticeY
                            }]);
                        }
                    })
                }
                // })
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
                        let roundByBaseX = thePos.x % 10;
                        if (roundByBaseX <= 5) {
                            roundByBaseX = -roundByBaseX
                        } else {
                            roundByBaseX = 10 - roundByBaseX
                        }
                        let roundByBaseY = thePos.y % 10;
                        if (roundByBaseY <= 5) {
                            roundByBaseY = -roundByBaseY
                        } else {
                            roundByBaseY = 10 - roundByBaseY
                        }
                        activeCellModel.translate(
                            roundByBaseX,
                            roundByBaseY,
                        );
                    }
                })
            }



            if (cellView.model.isElement()) {
                // let theLinks = getGraphRef().getLinks();
                let cellsToUpdateLink = getActiveCellViewsArrayRef();
                if (cellsToUpdateLink.length < 1) {
                    cellsToUpdateLink = [cellView];
                }
                cellsToUpdateLink.forEach(cellV => {
                    let theLinks = getGraphRef().getConnectedLinks(cellV.model);

                    theLinks.forEach(link => {
                        if (link.get("vertices")) {
                            let currentVertices = [...link.get("vertices")];
                            currentVertices = currentVertices.map(currentVertex => {
                                let newVertex = { ...link.get("vertices")[0] };
                                let roundByBaseX = currentVertex.x % 10;
                                if (roundByBaseX <= 5) {
                                    roundByBaseX = -roundByBaseX
                                } else {
                                    roundByBaseX = 10 - roundByBaseX
                                }
                                let roundByBaseY = currentVertex.y % 10;
                                if (roundByBaseY <= 5) {
                                    roundByBaseY = -roundByBaseY
                                } else {
                                    roundByBaseY = 10 - roundByBaseY
                                }
                                newVertex.x += roundByBaseX;
                                newVertex.y += roundByBaseY;
                                return newVertex;
                            })
                            link.vertices(currentVertices);
                        }
                    })
                })
            }

        })

        paper.on("cell:pointerdblclick", ((cellView, e, x, y) => {
            if (!cellView.model.isLink() && cellView.model.attributes.typeOfCell === "base_token") {
                // edit base token
                setBaseTokenCellView(cellView);
            } else if (!cellView.model.isLink()) {
                let cellModel = cellView.model;
                if (cellModel.attributes.type === "custom.RectDiamond" && cellModel.attributes.attrs.label) {
                    // edit protocol
                    let theCellProtocol = {}
                    theCellProtocol.id = cellModel.attributes.protocolId;
                    theCellProtocol.name = cellModel.attributes.protocolText;
                    theCellProtocol.url = cellModel.attributes.protocolUrl;
                    theCellProtocol.backgroundColor = cellModel.attributes.backgroundColor;
                    theCellProtocol.borderColor = cellModel.attributes.borderColor;
                    theCellProtocol.image = cellModel.attributes.attrs.image["xlink:href"];

                    let theElements = graph.getElements();
                    // for now I changed the elements on the paper which should be update
                    // only to the cell, which was double clicked on
                    // because it seems to be intiutive thing that only that cell would change
                    let elementsToChange = [];
                    // let elementsToChange = [...theElements];
                    // elementsToChange = elementsToChange.filter((el) => {
                    //     return el.attributes.protocolId === theCellProtocol.id;
                    // })
                    if (elementsToChange.length === 0) {
                        elementsToChange = [cellModel];
                    }
                    setProtocolCells(elementsToChange);
                    setActiveProtocol(theCellProtocol);
                    setActiveToken(null);
                    setActiveBridge(null);
                    setActiveLoopAction(null);
                    setActiveLink(null);
                    setOpenModalWindow(true);
                } else if (cellModel.attributes.typeOfCell === "earn_cell") {
                    // edit token
                    let theCellToken = {}
                    theCellToken.id = cellModel.attributes.tokenId;
                    theCellToken.name = cellModel.attributes.tokenText;
                    theCellToken.url = cellModel.attributes.tokenUrl;
                    theCellToken.backgroundColor = cellModel.attributes.backgroundColor;
                    theCellToken.borderColor = cellModel.attributes.borderColor;
                    theCellToken.image = cellModel.attributes.image || "";

                    let theElements = graph.getElements();
                    let elementsToChange = [];
                    // let elementsToChange = [...theElements];
                    // elementsToChange = elementsToChange.filter((el) => {
                    //     //TODO change it when will start to implement syncing tokens for different inputs
                    //     return theCellToken.id && el.attributes.tokenId === theCellToken.id;
                    // })
                    if (elementsToChange.length === 0) {
                        elementsToChange = [cellModel];
                    }

                    setTokenCells(elementsToChange);
                    setActiveToken(theCellToken);
                    setActiveProtocol(null);
                    setActiveBridge(null);
                    setActiveLoopAction(null);
                    setActiveLink(null);
                    setOpenModalWindow(true);
                } else if (cellModel.attributes.type === "custom.LoopAction") {
                    setActiveLoopAction(cellModel);
                    setActiveProtocol(null);
                    setActiveToken(null);
                    setActiveBridge(null);
                    setActiveLink(null);
                    setOpenModalWindow(true);
                }
            }
        }))

        paper.on("link:pointerdblclick", ((linkView, e, x, y) => {
            if (!e.ctrlKey && linkView.model.isLink()) {
                let currentLink = linkView.model;
                setActiveLink(currentLink);
                setActiveProtocol(null);
                setActiveToken(null);
                setActiveBridge(null);
                setActiveLoopAction(null);
                let targetCell = linkView.model.getTargetCell()
                let sourceCell = linkView.model.getSourceCell()
                // if (sourceCell.attributes.typeOfCell !== "root" && targetCell.attributes.typeOfCell !== "root") {
                setOpenModalWindow(true);
                // }
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
                let editingGeometry = getEditingGeometryRef();
                if (editingGeometry) {
                    console.log("resize the circle");
                } else {
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
                }

            }));
            let editingGeometry = getEditingGeometryRef();
            if (editingGeometry) {
                console.log("put the circle");
            }
        }))

        paper.on("blank:pointerup", () => {
            let editingGeometry = getEditingGeometryRef();
            if (editingGeometry) {
                console.log("stop editing the circle");
                setEditingGeometry(false);
                setEditingGeometryRef(false);
            }
        })

        paper.on("link:pointermove", (linkView, event) => {
            // let eventTarget = event.originalEvent.target;
            // let eventTargetSelector = eventTarget.getAttribute("joint-selector") || eventTarget.parentElement.getAttribute("joint-selector");
            let eventTargetSelector = getActiveLabelRef();
            let labelsToMove = [];
            let activeLabel = null;
            // here we check if we clicked on the label, which should trigger moving other labels
            if (eventTargetSelector === "offsetLabelNegativeConnector" ||
                eventTargetSelector === "offsetLabelPositiveConnector" ||
                eventTargetSelector === "leverageCircle" ||
                eventTargetSelector === "leverageText" ||
                eventTargetSelector === "rect") {
                let linkModel = linkView.model;
                let linkLabels = linkModel.labels();
                // here we find which exactly label was clicked on
                labelsToMove = linkLabels;
                linkLabels.forEach(label => {
                    if (label.attrs[eventTargetSelector]) {
                        activeLabel = label;
                    }
                })
            }

            if (activeLabel && labelsToMove.length > 0) {
                labelsToMove.forEach(label => {
                    // if (!label.attrs.rect) {
                    label.position = { ...label.position, distance: activeLabel.position.distance }
                    // }
                })
            }
        })

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
                    setActiveToken(null);
                    setActiveBridge(null);
                    setActiveLoopAction(null);
                    stackGraph(graph);
                    let targetCell = linkView.model.getTargetCell()
                    let sourceCell = linkView.model.getSourceCell()
                    // if (sourceCell.attributes.typeOfCell !== "root" && targetCell.attributes.typeOfCell !== "root") {
                    setOpenModalWindow(true);
                    // }
                }
            }))
        });

        paper.on('link:mouseenter', (linkView, e) => {
            linkView.addTools(toolsView);
            setActiveLinkViewRef(linkView);
            setActiveLinkView(linkView);
        });

        paper.on("link:pointerup", (linkView, e, x, y) => {
            // here we try to find closest port on the cell when we release the link
            let sourceCell = graph.getCell(linkView.model.attributes.source.id);
            let jointSelector = e.target.getAttribute("joint-selector");
            // make sure that the link was released on a cell and not something else, for example other link
            if (!jointSelector || jointSelector === "token-body" || jointSelector === "body" || jointSelector === ".rect-body" || jointSelector === ".pool-body" || jointSelector === "polygon" || jointSelector === "image" || jointSelector === "design-image") {
                // there is no specific way to get which cell was the link released on
                // get the id of the cell
                // so we need to iterate through each cell and check the distance to
                // the closest one would be the cell we put the link on
                let theElements = graph.getElements();
                let thePosition = { x, y };
                let closestElement = theElements[0];

                let closestElementPosition = { ...closestElement.attributes.position };
                closestElementPosition.x += closestElement.attributes.size.width / 2;
                closestElementPosition.y += closestElement.attributes.size.height / 2;

                let closestDistance = Math.sqrt(Math.pow(closestElementPosition.x - thePosition.x, 2) + Math.pow(closestElementPosition.y - thePosition.y, 2));
                theElements.forEach((el, i) => {

                    let elPosition = { ...el.attributes.position };
                    elPosition.x += el.attributes.size.width / 2;
                    elPosition.y += el.attributes.size.height / 2;

                    let distanceToElement = Math.sqrt(Math.pow(elPosition.x - thePosition.x, 2) + Math.pow(elPosition.y - thePosition.y, 2));
                    if (distanceToElement < closestDistance) {
                        closestElement = theElements[i];
                        closestDistance = distanceToElement;
                        closestElementPosition = { ...closestElement.attributes.position };
                        closestElementPosition.x += closestElement.attributes.size.width / 2;
                        closestElementPosition.y += closestElement.attributes.size.height / 2;
                    }
                })

                closestElementPosition.x -= closestElement.attributes.size.width / 2;
                closestElementPosition.y -= closestElement.attributes.size.height / 2;

                // after we found our cell we need to check the closest port of the cell the same way
                // but we iterate only through ports of this cell
                // check if the target cell is not the source cell
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
                    setActiveToken(null);
                    setActiveBridge(null);
                    setActiveLoopAction(null);
                    stackGraph(graph);
                    setOpenModalWindow(true);
                }
            }
            setActiveLabel(null);
            setActiveLabelRef(null);
            setLabelsToMove([]);
            setLabelsToMoveRef([]);
        })

        paper.on('blank:mouseover', () => {
            // paper.removeTools();
            let theLinks = getGraphRef().getLinks();
            theLinks.forEach(link => {
                link.findView(getPaperRef()).removeTools();
            })
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

        let localStorageTokens = localStorage.getItem("recentlyUsedTokens");
        if (localStorageTokens) {
            setRecentlyUsedTokens(JSON.parse(localStorageTokens));
            setRecentlyUsedTokensRef(JSON.parse(localStorageTokens));
        }

        setProtocols(props.protocols);

        let canvasEl = getCanvas();
        let canvasStyle = canvasEl.getAttribute("style").split(";");
        canvasStyle = canvasStyle.map(b => {
            if (b.split(":")[0] === " height") {
                return ` height: ${window.innerHeight - 20 || 884}px !important`;
            }
            return b;
        })
        canvasEl.setAttribute("style", canvasStyle.join(";"));


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
                tokens={props.tokens}
                layout={layout}
                paper={getPaperRef()}
                graph={graph}
                drawFrame={drawFrame}
                isFrameAdded={isFrameAdded}
                recentlyUsedProtocols={recentlyUsedProtocols}
                recentlyUsedActions={recentlyUsedActions}
                recentlyUsedTokens={recentlyUsedTokens}
                addRecentlyUsedAction={addRecentlyUsedAction}
                setActiveProtocol={setActiveProtocol}
                setActiveToken={setActiveToken}
                setOpenModalWindow={setOpenModalWindow}
                addEmptyNode={addEmptyNode}
                addEmptyToken={addEmptyToken}
                createCircle={createCircle}
                mergeAction={mergeAction}
                addEmptyBridge={addEmptyBridge}
            />
            <div
                id='canvas'
                onWheel={handleScroll}
                ref={canvas}
                style={{
                    height: `${window.innerHeight || 884}px !important`
                }}
            />
            {openModalWindow &&
                // ((activeLink && !activeProtocol) ||
                // (activeProtocol && !activeLink))
                (activeBridge || activeToken || activeLoopAction || activeProtocol || activeLink)
                &&
                <ModalWindow
                    joint={joint}
                    portCellOptions={portCellOptions}
                    linkMarkup={linkMarkup}
                    tradingFeePortCellOptions={tradingFeePortCellOptions}
                    setOpenModalWindow={setOpenModalWindow}
                    activeLink={activeLink}
                    key={(activeLink && `link-window-${activeLink.id}`) || "protocol-window"}
                    setActiveLink={setActiveLink}
                    activeProtocol={activeProtocol}
                    activeToken={activeToken}
                    graph={graph}
                    stackGraph={stackGraph}
                    cellData={earnCell}
                    tradingFeeCell={tradingFeeCell}
                    layout={layout}
                    subLayout={subLayout}
                    setActiveProtocol={setActiveProtocol}
                    setActiveToken={setActiveToken}
                    protocols={props.protocols}
                    tokens={props.tokens}
                    protocolCells={protocolCells}
                    tokenCells={tokenCells}
                    setProtocolCells={setProtocolCells}
                    setTokenCells={setTokenCells}
                    setOpenAddTokenToSelect={setOpenAddTokenToSelect}
                    activeLoopAction={activeLoopAction}
                    setActiveLoopAction={setActiveLoopAction}
                    isMerge={isMerge}
                    setIsMerge={setIsMerge}
                    tokenShape={tokenShape}
                    activeBridge={activeBridge}
                    setActiveBridge={setActiveBridge}
                    bridgeShape={bridgeShape}
                />}
            <InitButtons
                addBaseToken={addBaseToken}
                baseTokenCellView={baseTokenCellView}
                editBaseToken={editBaseToken}
                openAddTokenToSelect={openAddTokenToSelect}
                setOpenAddTokenToSelect={setOpenAddTokenToSelect}
                openModalWindow={openModalWindow}
                tokens={props.tokens}
            />
        </div>
    );
}

export default Paper;