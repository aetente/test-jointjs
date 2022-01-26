import React, { useState, useRef, useCallback, useEffect } from 'react';
import "./styles.css";



export default function SelectEarn(props) {

    let linkLabel = props.activeLink && props.activeLink.label(0);
    let defaultSelectValue = linkLabel ? linkLabel.attrs.text.earn : "None";

    return (
        <div className="modal-option">
            <div className="modal-option-title">Earn</div>
            <div
                className="hold-select-action"
            >
                <select
                    name="actions"
                    key={defaultSelectValue}
                    className='select-actions'
                    onChange={e => {
                        props.setEarn(e.target.value);
                    }}
                    defaultValue={defaultSelectValue}
                >
                    <option value="None">None</option>
                    <option value="Rewards">Rewards</option>
                    <option value="Trading fee">Trading fee</option>
                    <option value="Swap">Swap</option>
                </select>
            </div>
        </div>
    )
}