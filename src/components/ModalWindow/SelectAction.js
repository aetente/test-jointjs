import React, { useState, useRef, useCallback, useEffect } from 'react';
import "./styles.css";



export default function SelectAction(props) {
    return (
        <div
            className="hold-select-action"
        >
            <select
                name="actions"
                className='select-actions'
                onChange={e => {
                    props.setAction(e.target.value);
                }}
            >
                <option value="stack">Stack</option>
                <option value="claim">Claim</option>
                <option value="borrow">Borrow</option>
                <option value="harvest">Harvest</option>
            </select>
        </div>
    )
}