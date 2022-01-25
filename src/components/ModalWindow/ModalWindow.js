import React, { useState, useRef, useCallback, useEffect } from 'react';
import SelectAction from './SelectAction';
import "./styles.css";

import close from "./close.svg";


export default function ModalWindow(props) {

    const [action, setAction] = useState("stack");

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
                            props.setOpenModalWindow(false);
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
                        props.activeLink.label(0, {
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
                        props.setOpenModalWindow(false);
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