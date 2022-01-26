import React, { useState, useRef, useCallback, useEffect } from 'react';
import "./styles.css";



export default function SelectAction(props) {

    let linkLabel = props.activeLink && props.activeLink.label(0);
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
                        props.setAction(e.target.value);
                    }}
                    defaultValue={defaultSelectValue}
                >
                    <option value="Stake">Stake</option>
                    <option value="Claim">Claim</option>
                    <option value="Borrow">Borrow</option>
                    <option value="Harvest">Harvest</option>
                </select>
            </div>
        </div>
    )
}