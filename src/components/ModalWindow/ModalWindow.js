import React, { useState, useRef, useCallback, useEffect } from 'react';
import SelectAction from './SelectAction';
import SelectEarn from './SelectEarn';
import "./styles.css";

import close from "./close.svg";


export default function ModalWindow(props) {

    let {
        joint,
        graph,
        portCellOptions,
        setOpenModalWindow,
        activeLink,
        cellData
    } = props;

    const [action, setAction] = useState("stack");
    const [earn, setEarn] = useState("None");

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
                <div className="modal-option">
                    <div className="modal-option-title">Allocation</div>
                </div>
                <div className="modal-option">
                    <div className="modal-option-title">Choose action</div>
                    <SelectAction setAction={setAction} />
                </div>
                <div className="modal-option">
                    <div className="modal-option-title">Earn</div>
                    <SelectEarn setEarn={setEarn} />
                </div>
                <div className="modal-option">
                    <div className="modal-option-title">In What Token</div>
                </div>
            </div>
            <div className="modal-actions">
                <button className="action-button">+</button>
                <button
                    className="finish-button"
                    onClick={() => {
                        activeLink.label(0, {
                            attrs: {
                                text: {
                                    text: `[ ${action} ]`,
                                    fontWeight: 500,
                                    fontSize: "20px",
                                    lineHeight: "18px"
                                },
                                rect: {
                                    fill: "#f6f6f6"
                                }
                            }
                        })
                        if (earn !== "None") {
                            console.log("AAAAAAAA")
                            let link = new joint.shapes.standard.Link();
                            
                            link.label(0, {
                                attrs: {
                                    text: {
                                        text: `[ Earn ${earn} ]`,
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
                                        text: "lorem ipsum"
                                    }
                                },
                                ports: props.portCellOptions
                            });

                            graph.addCell(cell);
                            let sourceCell = activeLink.getTargetCell()
                            let sourcePort = sourceCell.getPort(activeLink.attributes.target.port);
                            link.source({ id: sourceCell.id, port: sourceCell.attributes.ports.items[3].id });
                            link.target({ id: cell.id, port: cell.attributes.ports.items[2].id });
                            link.addTo(graph);
                            console.log(graph.getLinks())
                        }
                        setOpenModalWindow(false);
                    }}
                >Done</button>
            </div>
            {/* <div>
                <input
                    // key={`node-change-${props.nodeDataToChange.key}`}
                    ref={inputRef}
                    className="nodrag"
                    type="text"
                />
                <button
                    onClick={() => {
                        props.setOpenModalWindow(false);
                    }}
                >enter</button>
            </div> */}
        </div>
    )
}