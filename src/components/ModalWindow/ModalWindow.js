import React, { useState, useRef, useCallback, useEffect } from 'react';
import SelectAction from './SelectAction';
import AllocationInput from './AllocationInput';
import EarnInputsHolder from './EarnInputsHolder';
import ProtocolNameInput from './ProtocolNameInput';
import ProtocolUrlInput from './ProtocolUrlInput';
import ProtocolColorPicker from './ProtocolColorPicker';
import { convertObjToStr } from '../../utils/utils';
import "./styles.css";

import close from "./close.svg";

export default function ModalWindow(props) {

    let {
        joint,
        graph,
        portCellOptions,
        setOpenModalWindow,
        activeLink,
        cellData,
        layout,
        subLayout,
        stackGraph,
        activeProtocol,
        setActiveProtocol
    } = props;

    const [action, setAction] = useState(["Stake"]);
    const [earn, setEarn] = useState("None");
    const [allocation, setAllocation] = useState(50);
    const [tokenName, setTokenName] = useState("COIN");
    const [typeOfLink, setTypeOfLink] = useState("action");
    const [actionLink, setActionLink] = useState(null);
    const [earnLink, setEarnLink] = useState(null);
    const [linksAndCellsToAdd, setLinksAndCellsToAdd] = useState([]);

    const [earnLinks, setEarnLinks] = useState([]);

    const addStakeEarn = (activeLink) => {
        // here we add new cells representing the earn and according links
        let newEarnLink = new joint.shapes.standard.Link();

        // set how the link looks and behaves
        newEarnLink.router('manhattan', { excludeTypes: ['custom.Frame'] });
        newEarnLink.attr({
            typeOfLink: "earn",
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
        let sourceCell = activeLink.getTargetCell();
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
            })
            // save it to state to add them later to graph by iteration
            setLinksAndCellsToAdd(linksAndCellsToAdd => [...linksAndCellsToAdd, [newEarnLink, newEarnCell]])
            // set earns to state, to be able to edit it
            setEarnLinks(earnLinks => [...earnLinks, [newEarnLink, newEarnCell]]);

        }
    }

    const mapEarnOptions = (earnArray, action) => {
        // we can have multiple earns in the model window
        // so this function maps the earns
        if (action[0] === "Stake") {
            return earnArray.map((earnData, i) => {
                let earnLink = earnData[0];
                let earnCell = earnData[1];

                // method to edit what is the earn (rewards, etc) for the link
                let setEarn = (earn) => {
                    earnLink.label(0, {
                        attrs: {
                            text: {
                                text: `[\u00a0Earn\u00a0${earn}\u00a0]`,
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
                    })
                };

                // method to edit in what token to receive the earn,reward for the cell
                let setTokenName = (tokenName) => {

                    earnCell.attr({
                        label: {
                            text: tokenName
                        }
                    })
                    let earnLinkEarnValue = (earnLink.label(0) && earnLink.label(0).attrs.text.earn) || "None";
                    earnLink.label(0, {
                        attrs: {
                            text: {
                                text: `[\u00a0Earn\u00a0${earnLinkEarnValue}\u00a0]`,
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
                        key={`earn-${i}`}
                        arrayLength={earnArray.length}
                        setTokenName={setTokenName}
                        setEarn={setEarn}
                        activeLink={earnLink}
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
            actionLink.label(0, {
                attrs: {
                    text: {
                        text: `[\u00a0${allocation}%\u00a0${action[0]}\u00a0]`,
                        action: action[0],
                        allocation,
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
            // remember that it was a link representing action
            actionLink.attr({ typeOfLink: "action" });
        } else if (typeOfLink === "earn") {
            // if we double clicked earn link, update the action link
            actionLink.label(0, {
                attrs: {
                    text: {
                        text: `[\u00a0${allocation}%\u00a0${action[0]}\u00a0]`,
                        action: action[0],
                        allocation,
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

        // add the new earn links and cells
        // earn are only for stake action
        if (action[0] === "Stake") {
            linksAndCellsToAdd.forEach(la => {
                let newLink = la[0];
                let newCell = la[1]
                let earnValue = (newLink.label(0) && newLink.label(0).attrs.text.earn) || "None";
                if (earnValue !== "None") {
                    let prevEarnIdsArray = actionLink.attributes.attrs.earnLinkIds || [];
                    actionLink.attr({
                        earnLinkIds: [...prevEarnIdsArray, newLink.id]
                    });
                    newLink.addTo(graph);
                    graph.addCell(newCell);

                }
            });
            if (linksAndCellsToAdd.length > 0) {
                subLayout(linksAndCellsToAdd[0][0]);
            }
        }

        stackGraph(graph);
        setOpenModalWindow(false);
    }

    const handleProtocolDone = () => {

    }

    useEffect(() => {
        // the idea is to define different kind of scenarios for modal window
        // for now it is to set if user modifies the action link or earn link
        // if user modifies the action link than it is the one that the parent sent in props
        // and earn link would be (not necessary) found with the id which is stored inside action link
        // and if it is earn link than it goes the opposite way with the exception that
        // if user modifies earn link than there for sure would be action link 
        let { activeProtocol } = props;
        if (!activeProtocol) {
            let typeOfLink = convertObjToStr(activeLink.attributes.attrs.typeOfLink);
            setTypeOfLink(typeOfLink);
            if (!typeOfLink || typeOfLink === "action") {
                let targetCell = activeLink.getTargetCell();
                let sourceCell = activeLink.getSourceCell();
                let targetCellType = convertObjToStr(targetCell.attributes.typeOfCell);
                let sourceCellType = convertObjToStr(sourceCell.attributes.typeOfCell);
                let defaultAction = ((
                    (sourceCellType === "earn_cell" && targetCellType === "earn_cell") ||
                    (sourceCellType === "earn_cell" && targetCellType === "base_token") ||
                    (targetCellType === "earn_cell" && sourceCellType === "base_token")) && "Re-invest") || "Stake";
                let actionValue = [(activeLink.label(0) && convertObjToStr(activeLink.label(0).attrs.text.action)) || defaultAction];
                setActionLink(activeLink);
                setAction(actionValue)
                setAllocation((activeLink.label(0) && activeLink.label(0).attrs.text.allocation) || 50)

                let earnLinkIdVal = convertObjToStr(activeLink.attributes.attrs.earnLinkId);
                if (earnLinkIdVal) {
                    let earnLinkById = graph.getCell(earnLinkIdVal);
                    if (earnLinkById) {
                        setEarnLink(earnLinkById);
                        setEarn((earnLinkById.label(0) && earnLinkById.label(0).attrs.text.earn) || "None")
                        setTokenName((earnLinkById.label(0) && earnLinkById.label(0).attrs.text.tokenName) || "COIN")
                    }
                }

                if (activeLink.attributes.attrs.earnLinkIds) {
                    let earnLinksArray = activeLink.attributes.attrs.earnLinkIds;
                    if (!earnLinksArray.map) {
                        earnLinksArray = Object.values(earnLinksArray);
                    }
                    let earnLinksToSet = earnLinksArray.map(earnLinkId => {
                        let earnLinkById = graph.getCell(earnLinkId);
                        let earnCellById = graph.getCell(convertObjToStr(earnLinkById.attributes.attrs.earnCellId));
                        return [earnLinkById, earnCellById];
                    });
                    setEarnLinks(earnLinksToSet);
                }

                if (actionValue[0] === "Stake") {
                    addStakeEarn(activeLink);
                }
            } else if (typeOfLink === "earn") {

                setEarnLink(activeLink);
                setEarn((activeLink.label(0) && convertObjToStr(activeLink.label(0).attrs.text.earn)) || "None")
                setTokenName((activeLink.label(0) && convertObjToStr(activeLink.label(0).attrs.text.tokenName)) || "COIN")

                let actionLinkIdVal = convertObjToStr(activeLink.attributes.attrs.actionLinkId);
                if (actionLinkIdVal) {
                    let actionLinkById = graph.getCell(actionLinkIdVal);
                    let actionValue = [(actionLinkById.label(0) && convertObjToStr(actionLinkById.label(0).attrs.text.action)) || "Stake"]
                    setActionLink(actionLinkById);
                    setAction(actionValue)
                    setAllocation((actionLinkById.label(0) && actionLinkById.label(0).attrs.text.allocation) || 50)

                    if (actionLinkById.attributes.attrs.earnLinkIds) {
                        let earnLinksArray = actionLinkById.attributes.attrs.earnLinkIds;
                        if (!earnLinksArray.map) {
                            earnLinksArray = Object.values(earnLinksArray);
                        }
                        let earnLinksToSet = earnLinksArray.map(earnLinkId => {
                            let earnLinkById = graph.getCell(earnLinkId);
                            let earnCellById = graph.getCell(convertObjToStr(earnLinkById.attributes.attrs.earnCellId));
                            return [earnLinkById, earnCellById];
                        });
                        setEarnLinks(earnLinksToSet);
                    }

                }

            }
            return () => {
                setActionLink(null);
                setEarnLink(null);
                setEarnLinks([])
            }
        }
    }, [activeLink]);

    return (
        <div
            className="hold-modal"
        >
            {!activeProtocol &&
                (
                    <div className='modal-options'>
                        <div className="modal-title">
                            <div>Set an action</div>
                            <div
                                className='title-close-button'
                                onClick={() => {
                                    setOpenModalWindow(false);
                                }}
                            >
                                <img src={close} alt="close" />
                            </div>
                        </div>
                        <AllocationInput key={actionLink} setAllocation={setAllocation} activeLink={actionLink} />
                        <SelectAction actionIndex={0} setAction={setAction} activeLink={actionLink} />
                        {mapEarnOptions(earnLinks, action)}
                    </div>
                ) || (
                    <div className='modal-options'>
                        <div className="modal-title">
                            <div>{activeProtocol.name}</div>
                            <div
                                className='title-close-button'
                                onClick={() => {
                                    setOpenModalWindow(false);
                                }}
                            >
                                <img src={close} alt="close" />
                            </div>
                        </div>
                        <ProtocolNameInput
                            activeProtocol={activeProtocol}
                            setActiveProtocol={setActiveProtocol}
                        />
                        <ProtocolUrlInput
                            activeProtocol={activeProtocol}
                            setActiveProtocol={setActiveProtocol}
                        />
                        <ProtocolColorPicker
                            activeProtocol={activeProtocol}
                            setActiveProtocol={setActiveProtocol}
                        />
                    </div>
                )}
            <div className="modal-actions">
                {action[0] === "Stake" &&
                    <button
                        className="action-button"
                        onClick={() => {
                            if (!activeProtocol) {
                                addStakeEarn(actionLink);
                            }
                        }}
                    >+ {activeProtocol && "Upload protocol picture" || ""}</button>
                }
                <button
                    className="finish-button"
                    onClick={(activeProtocol && handleProtocolDone) || handleLinkDone}
                >Done</button>
            </div>
        </div>
    )
}