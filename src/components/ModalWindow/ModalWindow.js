import React, { useState, useRef, useCallback, useEffect } from 'react';
import SelectAction from './SelectAction';
import AllocationInput from './AllocationInput';
import EarnInputsHolder from './EarnInputsHolder';
import "./styles.css";

import close from "./close.svg";

function convertObjToStr(a) {
    return (a && typeof a !== "string" && Object.keys(a).reduce((p, c) => p + a[c], "")) || a;
}

function addStakeEarn(joint, activeLink, tokenName, setLinksAndCellsToAdd, setEarnLinks, cellData, portCellOptions) {
    let newEarnLink = new joint.shapes.standard.Link();
    // let newEarnLink = new joint.dia.Link({
    //     attrs: {
    //         '.connection': {
    //             strokeDasharray: '8 4'
    //         }
    //     }
    // });

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
        // setCellsToAdd(cellsToAdd => [...cellsToAdd, newEarnCell])
        setEarnLinks(earnLinks => [...earnLinks, [newEarnLink, newEarnCell]]);

    }
}

function mapEarnOptions(earnArray, graph, action) {
    if (action[0] === "Stake") {
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
                    },
                    position: {
                        distance: 0.6
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

export default function ModalWindow(props) {

    let {
        joint,
        graph,
        portCellOptions,
        setOpenModalWindow,
        activeLink,
        cellData,
        layout,
        stackGraph
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

    useEffect(() => {
        // the idea is to define different kind of scenarios for modal window
        // for now it is to set if user modifies the action link or earn link
        // if user modifies the action link than it is the one that the parent sent in props
        // and earn link would be (not necessary) found with the id which is stored inside action link
        // and if it is earn link than it goes the opposite way with the exception that
        // if user modifies earn link than there for sure would be action link 
        let typeOfLink = convertObjToStr(activeLink.attributes.attrs.typeOfLink);
        setTypeOfLink(typeOfLink);
        if (!typeOfLink || typeOfLink === "action") {
            let actionValue = [(activeLink.label(0) && convertObjToStr(activeLink.label(0).attrs.text.action)) || "Stake"];
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
                addStakeEarn(joint, activeLink, tokenName, setLinksAndCellsToAdd, setEarnLinks, cellData, portCellOptions);
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
    }, [activeLink])

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
                <SelectAction actionIndex={0} setAction={setAction} activeLink={actionLink} />
                {/* <SelectEarn setEarn={setEarn} activeLink={earnLink} />
                <TokenInput setTokenName={setTokenName} activeLink={earnLink} /> */}
                {mapEarnOptions(earnLinks, graph, action)}
            </div>
            <div className="modal-actions">
                {action[0] === "Stake" &&
                    <button
                        className="action-button"
                        onClick={() => {
                            addStakeEarn(joint, actionLink, tokenName, setLinksAndCellsToAdd, setEarnLinks, cellData, portCellOptions);
                        }}
                    >+</button>
                }
                <button
                    className="finish-button"
                    onClick={() => {
                        if (!typeOfLink || typeOfLink === "action") {
                            actionLink.label(0, {
                                attrs: {
                                    text: {
                                        text: `[ ${allocation}% ${action[0]} ]`,
                                        action: action[0],
                                        allocation,
                                        fontWeight: 500,
                                        fontSize: "20px",
                                        lineHeight: "18px"
                                    },
                                    rect: {
                                        fill: "#f6f6f6"
                                    }
                                },
                                position: {
                                    distance: 0.6
                                }
                            });
                            actionLink.attr({ typeOfLink: "action" });
                            if (earn !== "None") {
                                if (!earnLink) {
                                    // create new earn link if there is none
                                    
                                    let link = new joint.shapes.standard.Link();
                                    // let link = new joint.dia.Link({
                                    //     attrs: {
                                    //         '.connection': {
                                    //             strokeDasharray: '8 4'
                                    //         }
                                    //     }
                                    // });

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
                                        },
                                        position: {
                                            distance: 0.6
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
                                stackGraph(graph);
                            }
                        } else if (typeOfLink === "earn") {
                            actionLink.label(0, {
                                attrs: {
                                    text: {
                                        text: `[ ${allocation}% ${action[0]} ]`,
                                        action: action[0],
                                        allocation,
                                        fontWeight: 500,
                                        fontSize: "20px",
                                        lineHeight: "18px"
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

                        if (action[0] === "Stake") {
                            linksAndCellsToAdd.forEach(la => {
                                let earnValue = (la[0].label(0) && la[0].label(0).attrs.text.earn) || "None";
                                if (earnValue !== "None") {
                                    let prevEarnIdsArray = actionLink.attributes.attrs.earnLinkIds || [];
                                    actionLink.attr({
                                        earnLinkIds: [...prevEarnIdsArray, la[0].id]
                                    });
                                    la[0].addTo(graph);
                                    graph.addCell(la[1]);
                                }
                            });
                        }

                        layout(graph)


                        stackGraph(graph);
                        setOpenModalWindow(false);
                    }}
                >Done</button>
            </div>
        </div>
    )
}