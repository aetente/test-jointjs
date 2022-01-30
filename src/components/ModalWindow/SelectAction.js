import React, { useState, useRef, useCallback, useEffect } from 'react';
import "./styles.css";



export default function SelectAction(props) {

    let actionIndex = props.actionIndex;
    let linkLabel = props.activeLink && props.activeLink.label(actionIndex);
    let defaultSelectValue = linkLabel ? linkLabel.attrs.text.action : "Stake";

    return (
        <div className="modal-option">
            <div className="modal-option-title">Choose action</div>
            <div
                className="hold-select-action"
            >
                <select
                    name="actions"
                    key={defaultSelectValue}
                    className='select-actions'
                    onChange={e => {
                        props.setAction(actionValue => {
                            if (!actionValue[actionIndex]) {
                                actionValue.push(e.target.value);
                            } else {
                                actionValue.splice(actionIndex, 1, e.target.value);
                            }
                            return [...actionValue];
                        });
                        // props.setAction(actionValue => [...actionValue.splice(actionIndex, 1, e.target.value)]);
                    }}
                    defaultValue={defaultSelectValue}
                >
                    <option value="Stake">Stake</option>
                    <option value="Claim">Claim</option>
                    <option value="Supply">Supply</option>
                    <option value="Borrow">Borrow</option>
                    <option value="Harvest">Harvest</option>
                    <option value="Re-invest">Re-invest</option>
                </select>
            </div>
        </div>
    )
}