import React, { useState, useRef, useCallback, useEffect } from 'react';
import SelectAction from './SelectAction';
import SelectEarn from './SelectEarn';
import AllocationInput from './AllocationInput';
import TokenInput from './TokenInput';
import "./styles.css";

import close from "./close.svg";

function mapEarnOptions(earnArray, graph) {
    return earnArray.map((earnData, i) => {
        let earnLink = earnData[0];
        let earnCell = earnData[1];

        let setEarn = (earn) => {
            earnLink.label(0, {
                attrs: {
                    text: {
                        text: `[ Earn ${earn} ]`,
                        earn,
                        tokenName: (earnLink.label(0) && earnLink.label(0).attrs.text.tokenName) || "COIN",
                        fontWeight: 500,
                        fontSize: "20px",
                        lineHeight: "18px"
                    },
                    rect: {
                        fill: "#f6f6f6"
                    }
                }
            })
        };

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
                        text: `[ Earn ${earnLinkEarnValue} ]`,
                        earn: earnLinkEarnValue,
                        tokenName: tokenName,
                        fontWeight: 500,
                        fontSize: "20px",
                        lineHeight: "18px"
                    },
                    rect: {
                        fill: "#f6f6f6"
                    }
                }
            })
        }
        return (
            <>
                <SelectEarn setEarn={setEarn} activeLink={earnLink} />
                <TokenInput setTokenName={setTokenName} activeLink={earnLink} />
            </>
        );
    }
    )
}

export default function ModalWindow(props) {

    let {
        joint,
        graph,
        portCellOptions,
        setOpenModalWindow,
        activeLink,
        cellData,
        layout,
        setGraph
    } = props;

    const [action, setAction] = useState("Stake");
    const [earn, setEarn] = useState("None");
    const [allocation, setAllocation] = useState(50);
    const [tokenName, setTokenName] = useState("COIN");
    const [typeOfLink, setTypeOfLink] = useState("action");
    const [actionLink, setActionLink] = useState(null);
    const [earnLink, setEarnLink] = useState(null);
    const [linksAndCellsToAdd, setLinksAndCellsToAdd] = useState([]);

    const [earnLinks, setEarnLinks] = useState([]);

    useEffect(() => {
        // the idea is to define different kind of scenarios for modal window
        // for now it is to set if user modifies the action link or earn link
        // if user modifies the action link than it is the one that the parent sent in props
        // and earn link would be (not necessary) found with the id which is stored inside action link
        // and if it is earn link than it goes the opposite way with the exception that
        // if user modifies earn link than there for sure would be action link 
        setTypeOfLink(activeLink.attributes.attrs.typeOfLink);
        if (!activeLink.attributes.attrs.typeOfLink || activeLink.attributes.attrs.typeOfLink === "action") {

            setActionLink(activeLink);
            setAction((activeLink.label(0) && activeLink.label(0).attrs.text.action) || "Stake")
            setAllocation((activeLink.label(0) && activeLink.label(0).attrs.text.allocation) || 50)

            if (activeLink.attributes.attrs.earnLinkId) {
                let earnLinkById = graph.getCell(activeLink.attributes.attrs.earnLinkId);
                setEarnLink(earnLinkById);
                setEarn((earnLinkById.label(0) && earnLinkById.label(0).attrs.text.earn) || "None")
                setTokenName((earnLinkById.label(0) && earnLinkById.label(0).attrs.text.tokenName) || "COIN")
            }

            if (activeLink.attributes.attrs.earnLinkIds) {
                let earnLinksToSet = activeLink.attributes.attrs.earnLinkIds.map(earnLinkId => {
                    let earnLinkById = graph.getCell(earnLinkId);
                    let earnCellById = graph.getCell(earnLinkById.attributes.attrs.earnCellId);
                    return [earnLinkById, earnCellById];
                });
                setEarnLinks(earnLinksToSet);
            }

        } else if (activeLink.attributes.attrs.typeOfLink === "earn") {

            setEarnLink(activeLink);
            setEarn((activeLink.label(0) && activeLink.label(0).attrs.text.earn) || "None")
            setTokenName((activeLink.label(0) && activeLink.label(0).attrs.text.tokenName) || "COIN")

            if (activeLink.attributes.attrs.actionLinkId) {
                let actionLinkById = graph.getCell(activeLink.attributes.attrs.actionLinkId);
                setActionLink(actionLinkById);
                setAction((actionLinkById.label(0) && actionLinkById.label(0).attrs.text.action) || "Stake")
                setAllocation((actionLinkById.label(0) && actionLinkById.label(0).attrs.text.allocation) || 50)

                if (actionLinkById.attributes.attrs.earnLinkIds) {
                    let earnLinksToSet = actionLinkById.attributes.attrs.earnLinkIds.map(earnLinkId => {
                        let earnLinkById = graph.getCell(earnLinkId);
                        let earnCellById = graph.getCell(earnLinkById.attributes.attrs.earnCellId);
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
    }, [])

    return (
        <div
            className="hold-modal"
        >
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
                <SelectAction setAction={setAction} activeLink={actionLink} />
                {/* <SelectEarn setEarn={setEarn} activeLink={earnLink} />
                <TokenInput setTokenName={setTokenName} activeLink={earnLink} /> */}
                {mapEarnOptions(earnLinks, graph)}
            </div>
            <div className="modal-actions">
                <button
                    className="action-button"
                    onClick={() => {
                        // create link instance
                        let newEarnLink = new joint.shapes.standard.Link();
                        // set how the link looks and behaves
                        newEarnLink.router('manhattan');
                        newEarnLink.attr({
                            typeOfLink: "earn",
                            line: {
                                strokeDasharray: '8 4',
                                targetMarker: {
                                    type: "none"
                                }
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
                            ports: portCellOptions
                        });
                        // connect the link with the cells
                        let sourceCell = activeLink.getTargetCell();
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
                        // setCellsToAdd(cellsToAdd => [...cellsToAdd, newEarnCell])
                        setEarnLinks(earnLinks => [...earnLinks, [newEarnLink, newEarnCell]]);
                    }}
                >+</button>
                <button
                    className="finish-button"
                    onClick={() => {
                        if (!typeOfLink || typeOfLink === "action") {
                            actionLink.label(0, {
                                attrs: {
                                    text: {
                                        text: `[ ${allocation}% ${action} ]`,
                                        action,
                                        allocation,
                                        fontWeight: 500,
                                        fontSize: "20px",
                                        lineHeight: "18px"
                                    },
                                    rect: {
                                        fill: "#f6f6f6"
                                    }
                                }
                            });
                            actionLink.attr({ typeOfLink: "action" });
                            if (earn !== "None") {
                                if (!earnLink) {
                                    // create new earn link if there is none
                                    let link = new joint.shapes.standard.Link();

                                    link.label(0, {
                                        attrs: {
                                            text: {
                                                text: `[ Earn ${earn} ]`,
                                                earn,
                                                tokenName,
                                                fontWeight: 500,
                                                fontSize: "20px",
                                                lineHeight: "18px"
                                            },
                                            rect: {
                                                fill: "#f6f6f6"
                                            }
                                        }
                                    })

                                    link.router('manhattan');
                                    link.attr({
                                        typeOfLink: "earn",
                                        line: {
                                            strokeDasharray: '8 4',
                                            targetMarker: {
                                                type: "none"
                                            }
                                        }
                                    });
                                    let cell = new joint.shapes.standard.Rectangle({
                                        ...cellData,
                                        attrs: {
                                            ...cellData.attrs,
                                            label: {
                                                text: tokenName
                                            }
                                        },
                                        ports: portCellOptions
                                    });

                                    graph.addCell(cell);
                                    let sourceCell = activeLink.getTargetCell();
                                    let sourcePort = sourceCell.attributes.ports.items[3].id;
                                    link.source({ id: sourceCell.id, port: sourcePort });
                                    link.target({ id: cell.id, port: cell.attributes.ports.items[2].id });
                                    link.addTo(graph);

                                    activeLink.attr({
                                        earnLinkId: link.id
                                    });
                                    link.attr({
                                        actionLinkId: activeLink.id,
                                        earnCellId: cell.id
                                    })

                                    layout(graph);
                                }
                                setGraph(graph);
                            }
                        } else if (typeOfLink === "earn") {

                            actionLink.label(0, {
                                attrs: {
                                    text: {
                                        text: `[ ${allocation}% ${action} ]`,
                                        action,
                                        allocation,
                                        fontWeight: 500,
                                        fontSize: "20px",
                                        lineHeight: "18px"
                                    },
                                    rect: {
                                        fill: "#f6f6f6"
                                    }
                                }
                            })
                        }

                        linksAndCellsToAdd.forEach(la => {
                            let earnValue = (la[0].label(0) && la[0].label(0).attrs.text.earn) || "None";
                            if (earnValue !== "None") {
                                let prevEarnIdsArray = activeLink.attributes.attrs.earnLinkIds || [];
                                activeLink.attr({
                                    earnLinkIds: [...prevEarnIdsArray, la[0].id]
                                });
                                la[0].addTo(graph);
                                graph.addCell(la[1]);
                            }
                        });

                        layout(graph)


                        setGraph(graph);
                        setOpenModalWindow(false);
                    }}
                >Done</button>
            </div>
        </div>
    )
}