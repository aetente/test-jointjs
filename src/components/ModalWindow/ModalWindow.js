import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import EarnInputsHolder from './EarnInputsHolder';

import LinkBody from './LinkBody';
import ProtocolsBody from './ProtocolsBody';
import LoopActionBody from './LoopActionBody';
import TokensBody from './TokensBody';

import { convertObjToStr } from '../../utils/utils';
import "./styles.css";

import { protocolActions, tokenActions } from '../../actions';
import iconPlus from "../../assets/drawings/icon-plus.svg";
import loopActionImage from "../../assets/images/loopActionImage.png";

export default function ModalWindow(props) {
    let {
        joint,
        graph,
        portCellOptions,
        linkMarkup,
        tradingFeePortCellOptions,
        setOpenModalWindow,
        activeLink,
        setActiveLink,
        cellData,
        tradingFeeCell,
        layout,
        subLayout,
        stackGraph,
        activeProtocol,
        activeToken,
        setActiveProtocol,
        setActiveToken,
        tokenCells,
        protocolCells,
        setProtocolCells,
        setTokenCells,
        protocols,
        tokens,
        setOpenAddTokenToSelect,
        activeLoopAction,
        setActiveLoopAction,
        isMerge,
        setIsMerge,
        stateProtocols,
        setStateProtocols,
        stateTokens,
        setStateTokens,
        isDesign,
        parentUpdateCount,
        setParentUpdateCount
    } = props;

    const [action, setAction] = useState([{ name: "Stake" }]);
    const [tokenName, setTokenName] = useState("COIN");
    const [typeOfLink, setTypeOfLink] = useState("action");
    const [actionLink, setActionLink] = useState(null);
    const [linksAndCellsToAdd, setLinksAndCellsToAdd] = useState([]);
    const [updateCounter, setUpdateCounter] = useState(0);

    const [sourceCellsInfo, setSourceCellsInfo] = useState([]);
    const [targetCellsInfo, setTargetCellsInfo] = useState([]);
    const [tokenNamesInfo, setTokenNamesInfo] = useState([]);

    const [earnLinks, setEarnLinks] = useState([]);

    // the cell where the information about current connection would be stored
    const [infoCell, setInfoCell] = useState(null);

    const modalScrollRef = useRef(null);

    const getModalScrollRef = () => {
        return modalScrollRef.current;
    }

    const setModalScrollRef = (val) => {
        modalScrollRef.current = val;
    }

    let tokenOptions = useSelector(state => state.ui.tokenOptions);

    const dispatch = useDispatch();

    const scrollInput = (val) => {
        let scrollEl = getModalScrollRef();
        if (scrollEl && val !== null) {
            setTimeout(() => {
                scrollEl.scrollTo({ left: 0, top: val, behavior: "smooth" });
            }, 100);
        }
    }

    const addStakeEarn = (activeLink) => {
        // here we add new cells representing the earn and according links
        let newEarnLink = new joint.shapes.standard.Link({
            markup: linkMarkup
        });
        // set how the link looks and behaves
        newEarnLink.router('manhattan', { excludeTypes: ['custom.Frame'] });
        newEarnLink.attr({
            typeOfLink: "earn",
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
        // create cell instance for the link
        let newEarnCell = new joint.shapes.standard.Rectangle({
            ...cellData,
            attrs: {
                ...cellData.attrs,
                label: {
                    text: tokenName
                }
            },
            ports: portCellOptions,
            typeOfCell: "earn_cell"
        });
        // connect the link with the cells
        // here we get the target of the previous connection, representing the action (stake)
        // now we will refer to it as the source cell
        let sourceCell = null;
        // if the link we double clicked on was action link
        // then the source cell for new link should be the target cell of action link
        // otherwise if it was earn cell, then the source cell for new link should be the actual source cell

        let typeOfLink = activeLink.attributes.attrs.typeOfLink
        if (!typeOfLink || typeOfLink === 'action') {
            sourceCell = activeLink.getTargetCell();
        } else {
            sourceCell = activeLink.getSourceCell();
        }
        // by default we connect from bottom port to top port
        if (sourceCell && sourceCell.attributes.ports.items[3]) {
            let sourcePort = sourceCell.attributes.ports.items[3].id;
            newEarnLink.source({ id: sourceCell.id, port: sourcePort });
            newEarnLink.target({ id: newEarnCell.id, port: newEarnCell.attributes.ports.items[2].id });
            // save information about connected links and cells
            activeLink.attr({
                earnLinkId: newEarnLink.id
            });
            newEarnLink.attr({
                actionLinkId: activeLink.id,
                earnCellId: newEarnCell.id
            });
            // save it to state to add them later to graph by iteration
            setLinksAndCellsToAdd(linksAndCellsToAdd => [...linksAndCellsToAdd, [newEarnLink, newEarnCell]])
            // set earns to state, to be able to edit it
            setEarnLinks(earnLinks => [...earnLinks, [newEarnLink, newEarnCell]]);

        }
        scrollInput(9999);
    }

    const mapEarnOptions = (earnArray, action) => {
        // we can have multiple earns in the model window
        // so this function maps the earns
        if (action[0].name === "Stake" ||
            action[0].name === "Swap" ||
            action[0].name === "Borrow" ||
            action[0].name === "Harvest" ||
            (action[1] && action[1].name === "Borrow other token")) {
            return earnArray.map((earnData, i) => {
                let earnLink = earnData[0];
                let earnCell = earnData[1];

                // method to edit what is the earn (rewards, etc) for the link
                let setEarn = (earn) => {
                    earnLink.label(0, {
                        attrs: {
                            text: {
                                text: (earn !== "Trading fee" && `[\u00a0Earn\u00a0${earn}\u00a0]`) || "",
                                earn,
                                tokenName: (earnLink.label(0) && earnLink.label(0).attrs.text.tokenName) || "COIN",
                                fontFamily: 'Roboto, sans-serif',
                                fontStyle: "normal",
                                fontWeight: 600,
                                fontSize: "15px",
                                lineHeight: "18px",
                            },
                            rect: {
                                fill: "#f6f6f6"
                            }
                        },
                        position: {
                            distance: 0.6
                        }
                    });
                };

                // method to edit in what token to receive the earn,reward for the cell
                let setTokenName = (tokenName) => {
                    earnCell.attr({
                        label: {
                            text: tokenName
                        }
                    })
                    let earnLinkEarnValue = (earnLink.label(0) && earnLink.label(0).attrs.text.earn) || "None";
                    let earnValueString = earnLinkEarnValue !== "None" && `[\u00a0Earn\u00a0${earnLinkEarnValue}\u00a0]` || "";
                    // for the case when we picked borrow other token as second action, it should appear in the earn link as label
                    if (action[1] && action[1].name === "Borrow other token") {
                        earnValueString = `[ ${action[1].allocation || 50}% Borrow ]`
                    }
                    earnLink.label(0, {
                        attrs: {
                            text: {
                                text: earnValueString,
                                earn: earnLinkEarnValue,
                                tokenName: tokenName,
                                fontFamily: 'Roboto, sans-serif',
                                fontStyle: "normal",
                                fontWeight: 600,
                                fontSize: "15px",
                                lineHeight: "18px",
                            },
                            rect: {
                                fill: "#f6f6f6"
                            }
                        },
                        position: {
                            distance: 0.6
                        }
                    })
                }
                return (
                    <EarnInputsHolder
                        scrollInput={scrollInput}
                        key={`earn-${i}`}
                        action={action}
                        arrayLength={earnArray.length}
                        earnCell={earnCell}
                        setTokenName={setTokenName}
                        setEarn={setEarn}
                        activeLink={earnLink}
                        tokensToSelect={tokenOptions}
                        setOpenAddTokenToSelect={setOpenAddTokenToSelect}
                        i={i}
                    />
                );
            }
            )
        } else {
            return <></>
        }
    }

    const handleLinkDone = () => {

        // if it was the link we just added a new link or double clicked the link, which represents an action
        if (!typeOfLink || typeOfLink === "action") {
            // update how the link looks (change title and remember which exactly action was chosen)
            let isMoreActions = action.length > 1 && action[1].name === "Borrow the same token";

            if (action.length > 1 && (action[1].name === "Borrow the same token")) {
                actionLink.label(2, {
                    markup: [
                        {
                            tagName: 'path',
                            selector: 'offsetLabelPositiveConnector'
                        }, {
                            tagName: 'path',
                            selector: 'offsetLabelNegativeConnector'
                        }
                    ],
                    attrs: {
                        offsetLabelPositiveConnector: {
                            d: 'M 20 10 -10 10',
                            stroke: 'black',
                            strokeWidth: 2,
                            fill: "rgba(0,0,0,0)",
                            elementMove: true,
                            targetMarker: {
                                type: "path",
                                d: 'M 0 -3 -10 0.5 0 4'
                            },
                            // ref: "offsetLabelNegativeConnector"
                            // strokeDasharray: '5 5'
                        },
                        offsetLabelNegativeConnector: {
                            d: 'M -10 -10 20 -10',
                            stroke: 'black',
                            strokeWidth: 2,
                            fill: "rgba(0,0,0,0)",
                            elementMove: true,
                            targetMarker: {
                                type: "path",
                                d: 'M 0 -3 -10 0.5 0 4',
                            },
                            // ref: "offsetLabelPositiveConnector"
                            // strokeDasharray: '5 5'
                        }
                    },
                    position: {
                        distance: 0.5,
                        args: {
                            keepGradient: true
                        }
                    }
                });

                actionLink.label(3, {
                    markup: [ {
                            tagName: 'image',
                            selector: 'leverageCircle'
                        }, {
                            tagName: 'circle',
                            selector: 'wrapLeverageText'
                        },
                        {
                            tagName: 'text',
                            selector: 'leverageText'
                        },
                    ],
                    // markup: '<g class="rotatable"><g class="scalable"><image joint-selector="leverageCircle" class="leverage-circle"/><circle class="hold-leverage-text" /><text joint-selector="leverageText" class="leverage-text"/></g></g>',
                    attrs: {
                        leverageText: {
                            text: (action[1].leverage > 0 && `${action[1].leverage}x`) || "",
                            fontSize: "12px",
                            leverage: action[1].leverage,
                            ref: "wrapLeverageText",
                            textAnchor: "middle",
                            refX: "50%",
                            refY: "25%",
                            fontFamily: 'Roboto, sans-serif',
                            fontStyle: "normal",
                            fontWeight: 500,
                            fill: '#ffffff',
                        },
                        leverageCircle: {
                            x: -65,
                            y: -65,
                            height: 130,
                            width: 130,
                            href: loopActionImage
                        },
                        wrapLeverageText: {
                            ref: "leverageCircle",
                            refX: "50%",
                            refDy: "-7%",
                            r: "10",
                            fill: '#FAC200'
                        }
                    },
                    position: {
                        distance: 0.5,
                    }
                });
            }
            action.forEach((a, i) => {
                let allocationValue = a.allocation || "50";
                let offsetValue = 0;
                let distanceValue = 0.6;
                let arrowDistanceAttr = {
                    atConnectionRatio: distanceValue,
                    connection: true
                }
                let textAnchorValue = "middle";
                if (isMoreActions && action[1].name === "Borrow the same token") {
                    if (i === 0) {
                        offsetValue = -80;
                        textAnchorValue="start";
                    } else {
                        offsetValue = 80;
                        textAnchorValue="end";
                    }
                    distanceValue = 0.5;

                } else if (isMoreActions && action[1].name !== "Borrow the same token") {
                    // remove old labels
                    actionLink.removeLabel(1);
                    actionLink.removeLabel(2);
                    actionLink.removeLabel(3);
                }
                if (isMoreActions && i > 0 && a.name === "No borrow") {
                    return;
                }
                let actionName = a.name;
                if (actionName === "Borrow other token") {
                    return;
                }
                if (actionName === "Borrow the same token") {
                    actionName = "Borrow";
                }
                actionLink.label(i, {
                    // markup: [{
                    //     tagName: "text",
                    //     selector: "text"
                    // },{
                    //     tagName: "rect",
                    //     selector: "rect"
                    // }],
                    attrs: {
                        text: {
                            text: (isMoreActions && `${allocationValue}%\u00a0${actionName}`) || `[\u00a0${allocationValue}%\u00a0${actionName}\u00a0]`,
                            action: a.name,
                            allocation: allocationValue,
                            fontFamily: 'Roboto, sans-serif',
                            fontStyle: "normal",
                            fontWeight: (isMoreActions && 500) || 600,
                            fill: (isMoreActions && "#777E90") || "black",
                            fontSize: (isMoreActions && "12px") || "15px",
                            lineHeight: (isMoreActions && "14px") || "18px",
                            textAnchor: textAnchorValue,
                        },
                        rect: {
                            fill: "#f6f6f6",
                        }
                    },
                    anchor: { name: "right" },
                    position: {
                        distance: distanceValue,
                        offset: offsetValue
                    }
                });
            })

            // remember that it was a link representing action
            actionLink.attr({ typeOfLink: "action" });
        } else if (typeOfLink === "earn") {
            // if we double clicked earn link, update the action link
            action.forEach((a, i) => {
                let allocationValue = a.allocation || "50";
                if (actionLink) {
                    actionLink.label(i, {
                        attrs: {
                            text: {
                                text: `[\u00a0${allocationValue}%\u00a0${a.name}\u00a0]`,
                                action: a.name,
                                allocation: allocationValue,
                                fontFamily: 'Roboto, sans-serif',
                                fontStyle: "normal",
                                fontWeight: 600,
                                fontSize: "15px",
                                lineHeight: "18px",
                            },
                            rect: {
                                fill: "#f6f6f6"
                            }
                        },
                        position: {
                            distance: 0.6
                        }
                    });
                }
            })
        }

        // add the new earn links and cells
        // earn are only for stake, swap, harvest action
        if (action[0].name === "Stake" ||
            action[0].name === "Swap" ||
            action[0].name === "Borrow" ||
            action[0].name === "Harvest" ||
            (action[0].name === "Supply" && (action[1] && action[1].name === "Borrow other token"))) {
            linksAndCellsToAdd.forEach(la => {
                let newLink = la[0];
                let newCell = la[1]
                let earnValue = (newLink.label(0) && newLink.label(0).attrs.text.earn) || "None";

                if ((earnValue !== "None") ||
                    action[0].name === "Swap" ||
                    (action[0].name === "Supply" && (action[1] && action[1].name === "Borrow other token"))) {
                    let prevEarnIdsArray = actionLink.attributes.attrs.earnLinkIds || [];
                    actionLink.attr({
                        earnLinkIds: [...prevEarnIdsArray, newLink.id]
                    });
                    // earnCell = new joint.shapes.standard.Rectangle({
                    //     ...tradingFeeCell,
                    //     ports: tradingFeePortCellOptions,
                    //     typeOfCell: "earn_cell"
                    // });
                    if (earnValue === "Trading fee") {
                        let newEarnCell = new joint.shapes.standard.Rectangle({
                            ...tradingFeeCell,
                            ports: tradingFeePortCellOptions,
                            typeOfCell: "earn_cell"
                        });
                        newLink.target({ id: newEarnCell.id, port: newEarnCell.attributes.ports.items[0].id });
                        graph.addCell(newEarnCell);
                    } else {
                        graph.addCell(newCell);
                    }
                    newLink.addTo(graph);

                }
            });
            if (linksAndCellsToAdd.length > 0) {
                subLayout(linksAndCellsToAdd[0][0]);
            }
        }

        stackGraph(graph);
        setOpenModalWindow(false);
    }

    const updateProtocols = (forcedActiveProtocol) => {
        // forcedActiveProtocol is the object we want to set
        // not the one from the props
        let currentActiveProtocol = activeProtocol;
        if (forcedActiveProtocol) {
            currentActiveProtocol = forcedActiveProtocol
        }


        let alreadyExists = false;
        // let protocolIndex = protocols.findIndex((protocol) => {
        //     return protocol.id === activeProtocol.id;
        // });
        protocols.forEach((protocol, i) => {
            if (!alreadyExists &&
                protocol.id !== currentActiveProtocol.id &&
                (protocol.name === currentActiveProtocol.name ||
                    (currentActiveProtocol.url && (protocol.url === currentActiveProtocol.url)))) {
                alreadyExists = true;
                currentActiveProtocol = protocol;
                setActiveProtocol(protocol);
            }
        });

        // update every cell on the paper for the according protocol
        if (protocolCells) {
            protocolCells.forEach(pCell => {
                pCell.attributes = {
                    ...pCell.attributes,
                    protocolId: currentActiveProtocol.id,
                    protocolUrl: currentActiveProtocol.url,
                    backgroundColor: currentActiveProtocol.backgroundColor,
                    borderColor: currentActiveProtocol.borderColor
                };
                //lol
                let scaleText = (currentActiveProtocol.name.length > 5 && Math.pow(5 / currentActiveProtocol.name.length, 1 / 2)) || 1;
                pCell.attr('label/text', currentActiveProtocol.name);
                pCell.attr('text/text', currentActiveProtocol.name);
                pCell.attr('text/transform', `scale(${scaleText},${scaleText})`);
                pCell.attr('.rect-body/fill', currentActiveProtocol.backgroundColor);
                pCell.attr('.rect-body/stroke', currentActiveProtocol.borderColor);
                // update image
                if (currentActiveProtocol.image) {
                    pCell.attr('image/xlink:href', currentActiveProtocol.image);
                }
                // if added pool, need to change bottom port position to be lower
                // and need to set the pool attributes
                if (currentActiveProtocol.pool) {
                    if (pCell.attributes.ports.items[3]) {
                        let bottomPortId = pCell.attributes.ports.items[3].id;

                        pCell.portProp(bottomPortId, "attrs/portBody/refDy", 25)
                        pCell.attr('text/refY', .5);
                        pCell.attr('image/refY', .3);
                        pCell.attr('.pool-text/text', currentActiveProtocol.pool);
                        pCell.attr('.pool-body/fill', currentActiveProtocol.backgroundColor);
                        pCell.attr('.pool-body/stroke', currentActiveProtocol.borderColor);
                        pCell.attr('.pool-body/width', 45);
                        pCell.attr('.pool-body/width', 45);
                        pCell.attr('.pool-body/x', 27);
                        pCell.attr('.pool-body/y', 75);
                        pCell.attr('.pool-body/rx', 5.25);
                        pCell.attr('.pool-body/transform', 'rotate(45, 51, 97.5)');
                    }
                }
            })
        } else if (stateProtocols) {
            let protocolIndex = -1;
            protocolIndex = stateProtocols.findIndex(p => {
                return currentActiveProtocol.id === p.id;
            })
            if (protocolIndex >= 0) {
                let newStateProtocols = [...stateProtocols];
                newStateProtocols.splice(protocolIndex, 1, currentActiveProtocol);
                setStateProtocols(stateProtocols => [...newStateProtocols]);
            }
        }
    }

    const updateTokens = (forcedActiveToken) => {
        let currentActiveToken = activeToken;
        if (forcedActiveToken) {
            currentActiveToken = forcedActiveToken
        }
        let alreadyExists = false;
        tokens.forEach((token, i) => {
            if (!alreadyExists &&
                token.id !== currentActiveToken.id &&
                (token.name === currentActiveToken.name ||
                    (currentActiveToken.url && (token.url === currentActiveToken.url)))) {
                alreadyExists = true;
                currentActiveToken = token;
                setActiveToken(token);
            }
        });
        // update every cell on the paper for the according token (should we do it?)
        if (tokenCells) {
            tokenCells.forEach(tCell => {
                tCell.attributes = {
                    ...tCell.attributes,
                    tokenId: currentActiveToken && currentActiveToken.id,
                    tokenUrl: currentActiveToken.url,
                    backgroundColor: currentActiveToken.backgroundColor,
                    borderColor: currentActiveToken.borderColor,
                };
                //lol
                // let scaleText = (currentActiveProtocol.name.length > 5 && Math.pow(5 / currentActiveProtocol.name.length, 1 / 2)) || 1;
                tCell.attr('label/text', currentActiveToken.name);
                tCell.attr('text/text', currentActiveToken.name);
                // pCell.attr('text/transform', `scale(${scaleText},${scaleText})`);
                tCell.attr('body/fill', currentActiveToken.backgroundColor);
                tCell.attr('body/stroke', currentActiveToken.borderColor);
            })
        } else if (stateTokens) {
            let tokenIndex = -1;
            tokenIndex = stateTokens.findIndex(t => {
                return currentActiveToken.id === t.id;
            })
            if (tokenIndex >= 0) {
                let newStateTokens = [...stateTokens];
                newStateTokens.splice(tokenIndex, 1, currentActiveToken);
                setStateTokens(stateTokens => [...newStateTokens]);
            }
        }
    }

    const handleProtocolDone = () => {
        // allow creating new protocol only if entered a name
        if (activeProtocol.name) {
            // check if it is new protocol or already existing
            let protocolIndex = -1;
            let alreadyExists = false;
            // let protocolIndex = protocols.findIndex((protocol) => {
            //     return protocol.id === activeProtocol.id;
            // });
            console.log(protocols, activeProtocol)
            protocols.forEach((protocol, i) => {
                if (protocol.id === activeProtocol.id) {
                    protocolIndex = i;
                }
                if (protocol.id !== activeProtocol.id &&
                    (protocol.name === activeProtocol.name ||
                        (activeProtocol.url && (protocol.url === activeProtocol.url)))) {
                    alreadyExists = true;
                }
            });
            // set default colors if none were selected
            if (!activeProtocol.backgroundColor) {
                activeProtocol.backgroundColor = "#19384d";
            }
            if (!activeProtocol.borderColor) {
                activeProtocol.borderColor = "#19384d";
            }
            if (!alreadyExists) {
                // if it is a new protocol
                if (protocolIndex < 0) {
                    // give it a new id
                    // (it should alredy have a new id, but I suppose in the future the real new id would be created from backend)
                    activeProtocol.id = String(protocols.length);
                    // add it to the list of already existion protocols
                    dispatch(protocolActions.postProtocols(activeProtocol));
                    // close the window
                    setActiveProtocol(null);
                    setOpenModalWindow(false);

                } else {
                    // if the protocol already exists
                    // replace the protocol and replace
                    dispatch(protocolActions.putProtocols({ id: activeProtocol.id, content: activeProtocol }));
                    // update how all cells of the protocol look on the paper
                    updateProtocols();
                    // close the window
                    setActiveProtocol(null);
                    setProtocolCells([]);
                    setOpenModalWindow(false);
                }
            } else {
                console.log("ah")
            }
        }

    }


    const handleImageChange = (e) => {
        let file = e.target.files[0];
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            setActiveProtocol({ ...activeProtocol, image: reader.result });
            updateProtocols({ ...activeProtocol, image: reader.result });
        };
        reader.onerror = (error) => {
            console.log('Error: ', error);
        };
    }

    const handleTokenImageChange = (e) => {
        let file = e.target.files[0];
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            setActiveToken({ ...activeToken, image: reader.result });
            updateTokens({ ...activeToken, image: reader.result });
        };
        reader.onerror = (error) => {
            console.log('Error: ', error);
        };
    }

    const updateEarnLinks = (actionValue) => {
        if (actionValue === "Borrow other token" && earnLinks.length === 0) {
            addStakeEarn(activeLink);
        }
    }

    const handleLoopActionDone = () => {
        let leverageValue = (action[1] && action[1].leverage) || 0;
        if (leverageValue) {
            activeLoopAction.attr("loop-text/text", `${leverageValue}x`)
            activeLoopAction.attr("hold-loop-text/opacity", 1)
        }
        setActiveLoopAction(null);
        setOpenModalWindow(false);
    }

    const handleTokenDone = () => {
        if (activeToken.name) {
            let tokenIndex = -1;
            let alreadyExists = false;
            // let tokenIndex = tokens.findIndex((token) => {
            //     return token.id === activeToken.id;
            // });

            tokens.forEach((token, i) => {
                if (token.id === activeToken.id) {
                    tokenIndex = i;
                }
                if (token.id !== activeToken.id &&
                    (token.name === activeToken.name ||
                        (activeToken.url && (token.url === activeToken.url)))) {
                    alreadyExists = true;
                }
            });
            // if it is a new token
            if (!alreadyExists && activeToken.id && !isMerge) {
                if (tokenIndex < 0) {
                    activeToken.id = String(tokens.length);
                    dispatch(tokenActions.postTokens(activeToken));

                } else {
                    // if it is a token which already exists, update it
                    dispatch(tokenActions.putTokens({ id: activeToken.id, content: activeToken }));
                    updateTokens(activeToken);
                }
            }
            setActiveToken(null);
            setTokenCells([]);
            setOpenModalWindow(false);
            setIsMerge(false);
        }
    }

    useEffect(() => {
        // the idea is to define different kind of scenarios for modal window
        // for now it is to set if user modifies the action link or earn link
        // if user modifies the action link than it is the one that the parent sent in props
        // and earn link would be (not necessary) found with by finding outgoing links of target cell
        // and if it is earn link than it goes the opposite way
        let { activeProtocol } = props;
        // if it is the link which is being modified
        // may be change to checking for active link, but needs to be tested then
        if (!activeProtocol && !activeLoopAction && !activeToken) {
            // convertObjToStr converts Object like {0: "a", 1: "b", 2: "c"} to string "abc"
            // if it is the type of object, otherwise it just returns what you passed
            // it is like this, because the history stack stores graph converted to json
            // and while it converts to json, it changes some strings to this kind of object
            let typeOfLink = convertObjToStr(activeLink.attributes.attrs.typeOfLink);
            // the the target cell is earn/token cell and source cell is a protocol
            // then it is not action link, but earn link for sure
            if (activeLink) {
                let targetCell = activeLink.getTargetCell();
                let sourceCell = activeLink.getSourceCell();
                if (targetCell.attributes.typeOfCell === "earn_cell" && sourceCell.attributes.type === "custom.RectDiamond") {
                    typeOfLink = "earn"
                }
            }
            let actionLinkVal = null;
            let parentElements = [];
            let childElements = [];
            let tokenElements = [];
            let actionValue = [{ name: "Stake", allocation: "50" }];
            setTypeOfLink(typeOfLink);
            let infoCell;
            // if the link was of the type action, or it is a new link
            if (!typeOfLink || typeOfLink === "action") {
                actionLinkVal = activeLink;
                let targetCell = actionLinkVal.getTargetCell();
                let sourceCell = actionLinkVal.getSourceCell();
                // infocell is the one where incoming links are always action links and outgoing are earn links
                infoCell = targetCell;
                setInfoCell(infoCell);
                let targetCellType = convertObjToStr(targetCell.attributes.typeOfCell);
                let sourceCellType = convertObjToStr(sourceCell.attributes.typeOfCell);
                // the default action for link between tokens should be reinvest
                let defaultAction = ((
                    (targetCellType === "earn_cell") ||
                    (targetCellType === "base_token") ||
                    (targetCellType === "root")) && "Re-invest") || "Stake";

                let actionName = (actionLinkVal.label(0) && convertObjToStr(actionLinkVal.label(0).attrs.text.action)) || defaultAction;
                let allocationValue = (actionLinkVal.label(0) && convertObjToStr(actionLinkVal.label(0).attrs.text.allocation)) || "50";
                actionValue = [{ name: actionName, allocation: allocationValue }];
                if (actionLinkVal.label(1)) {
                    actionName = (actionLinkVal.label(1) && convertObjToStr(actionLinkVal.label(1).attrs.text.action)) || defaultAction;
                    allocationValue = (actionLinkVal.label(1) && convertObjToStr(actionLinkVal.label(1).attrs.text.allocation)) || "50";
                    actionValue.push({ name: actionName, allocation: allocationValue });
                }
                // here we set from which protocol, to which protocol this whole connection goes
                if (sourceCellType === "base_token" || sourceCellType === "earn_cell") {
                    tokenElements = [sourceCell];
                    parentElements = graph.getNeighbors(sourceCell, { inbound: true });
                    childElements = [targetCell]
                } else {
                    tokenElements = [targetCell];
                    parentElements = graph.getNeighbors(targetCell, { inbound: true });
                    childElements = graph.getNeighbors(targetCell, { outbound: true });
                }
                if (targetCellType === "base_token" || targetCellType === "earn_cell") {
                    parentElements = [sourceCell];
                }

            } else if (typeOfLink === "earn") {
                // the same goes for double clicking the earn link
                // but first we get the action link, and receive earn links from it 
                let targetCell = activeLink.getTargetCell();
                let sourceCell = activeLink.getSourceCell();
                infoCell = sourceCell;
                setInfoCell(infoCell);
                // action links we get by getting the incoming links
                let actionLinks = graph.getConnectedLinks(infoCell, { inbound: true });
                // let actionLinkIdVal = convertObjToStr(activeLink.attributes.attrs.actionLinkId);
                // it is not designed to be that there would be two action links, so we just get the first one
                // let actionLinkIdVal = actionLinks[0];
                actionLinkVal = actionLinks[0];
                if (actionLinkVal) {
                    let actionName = "Stake";
                    actionName = (actionLinkVal.label(0) && convertObjToStr(actionLinkVal.label(0).attrs.text.action)) || "Stake";
                    actionValue = [{ name: actionName, allocation: "50" }];
                }
                tokenElements = [targetCell];
                parentElements = graph.getNeighbors(targetCell, { inbound: true });
                childElements = graph.getNeighbors(targetCell, { outbound: true });
            }

            if (actionLinkVal) {
                // set info about connected protocols
                setTokenNamesInfo(tokenElements);
                setSourceCellsInfo(parentElements);
                setTargetCellsInfo(childElements);
                setActionLink(actionLinkVal);
                setAction(actionValue);
                // get the outgoing links from info cell, which are going to be earn links
                let earnLinksFromCell = graph.getConnectedLinks(infoCell, { outbound: true });
                // we want to filter out the links which are not actually earn links
                // not that it is a common case or something logical the user would do
                // but just in case
                // earnLinksFromCell? more like earnLinksFromHell, haha got 'em
                earnLinksFromCell = earnLinksFromCell.filter(theEarnLink => {
                    let targetCell = theEarnLink.getTargetCell();
                    // return convertObjToStr(theEarnLink.attributes.attrs.typeOfLink) === "earn";
                    return convertObjToStr(targetCell.attributes.typeOfCell) === "earn_cell";
                })
                let earnLinksArray = earnLinksFromCell;

                if (earnLinksArray) {
                    // it could be that earnLinksArray would be objects
                    // dont remember why though
                    // probably after I changed to getting earn links from the cell and links, it shouldn't happen 
                    if (!earnLinksArray.map) {
                        earnLinksArray = Object.values(earnLinksArray);
                    }
                    if (earnLinksArray) {
                        // we need to find target cells for each earn links
                        let earnLinksToSet = earnLinksArray.map(earnLinkId => {
                            let earnLinkById = graph.getCell(earnLinkId);
                            let earnCellById = null;
                            if (earnLinkById) {
                                let earnCellIdFromLink = convertObjToStr(earnLinkById.attributes.attrs.earnCellId);
                                if (earnCellIdFromLink) {
                                    earnCellById = graph.getCell(earnCellIdFromLink);
                                } else {
                                    let targetCell = earnLinkById.getTargetCell();
                                    earnCellById = targetCell;
                                }
                                return [earnLinkById, earnCellById];
                            }
                            return null;
                        });
                        // remove empty
                        earnLinksToSet = earnLinksToSet.filter((links) => links !== null);
                        setEarnLinks(earnLinksToSet);
                    }
                }

                // if the action is Stake, then we should automatically add possible earn cell
                if (actionValue[0].name === "Stake") {
                    addStakeEarn(activeLink);
                }
            }
            return () => {
                setActionLink(null);
                setEarnLinks([])
            }
        }
    }, [activeLink, updateCounter]);

    return (
        <div
            className="hold-modal"
        >
            {activeLoopAction &&
                (
                    <LoopActionBody
                        modalScrollRef={modalScrollRef}
                        setOpenModalWindow={setOpenModalWindow}
                        scrollInput={scrollInput}
                        setAction={setAction}
                        actionLink={actionLink}
                    />
                ) || (activeToken &&
                    <TokensBody
                        modalScrollRef={modalScrollRef}
                        setOpenModalWindow={setOpenModalWindow}
                        activeToken={activeToken}
                        tokens={tokens}
                        tokenCells={tokenCells}
                        setActiveToken={setActiveToken}
                        updateTokens={updateTokens}
                        isMerge={isMerge}
                        setIsMerge={setIsMerge}
                        parentUpdateCount={parentUpdateCount}
                        setParentUpdateCount={setParentUpdateCount}
                    />
                ) || (
                    !activeProtocol &&
                    (
                        <LinkBody
                            modalScrollRef={modalScrollRef}
                            setOpenModalWindow={setOpenModalWindow}
                            sourceCellsInfo={sourceCellsInfo}
                            targetCellsInfo={targetCellsInfo}
                            tokenNamesInfo={tokenNamesInfo}
                            setSourceCellsInfo={setSourceCellsInfo}
                            setTargetCellsInfo={setTargetCellsInfo}
                            graph={graph}
                            updateCounter={updateCounter}
                            setUpdateCounter={setUpdateCounter}
                            activeLink={activeLink}
                            scrollInput={scrollInput}
                            actionLink={actionLink}
                            setAction={setAction}
                            action={action}
                            updateEarnLinks={updateEarnLinks}
                            mapEarnOptions={mapEarnOptions}
                            earnLinks={earnLinks}
                        />
                    )) || (
                    <ProtocolsBody
                        modalScrollRef={modalScrollRef}
                        setOpenModalWindow={setOpenModalWindow}
                        activeProtocol={activeProtocol}
                        protocols={protocols}
                        protocolCells={protocolCells}
                        setActiveProtocol={setActiveProtocol}
                        updateProtocols={updateProtocols}
                        isDesign={isDesign}
                        parentUpdateCount={parentUpdateCount}
                        setParentUpdateCount={setParentUpdateCount}
                    />
                )}
            <div className="modal-actions">
                {(
                    action[0].name === "Stake" ||
                    action[0].name === "Swap" ||
                    action[0].name === "Borrow" ||
                    action[0].name === "Harvest"
                ) &&
                    ((!activeToken && !activeProtocol && !activeLoopAction) &&
                        (<button
                            className="action-button"
                            onClick={() => {
                                addStakeEarn(actionLink);
                            }}
                        >
                            <img src={iconPlus} alt="+" />
                        </button>) ||
                        ((activeProtocol && !activeLoopAction) && (
                            <label className="custom-file-upload">
                                <input
                                    type="file"
                                    onChange={handleImageChange}
                                />
                                <div
                                    className="action-button"
                                >
                                    <img src={iconPlus} alt="+" />
                                    <div>
                                        Upload protocol picture
                                    </div>
                                </div>
                            </label>
                        )) ||
                        ((activeToken && !activeLoopAction) && (
                            <label className="custom-file-upload">
                                <input
                                    type="file"
                                    onChange={handleTokenImageChange}
                                />
                                <div
                                    className="action-button"
                                >
                                    <img src={iconPlus} alt="+" />
                                    <div>
                                        Upload token picture
                                    </div>
                                </div>
                            </label>
                        )))
                }
                <button
                    className="finish-button"
                    onClick={
                        (activeLoopAction && handleLoopActionDone) ||
                        (activeProtocol && handleProtocolDone) ||
                        (activeToken && handleTokenDone) ||
                        handleLinkDone}
                >
                    Done
                </button>
            </div>
        </div>
    )
}