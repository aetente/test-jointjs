import React, { useState, useRef, useCallback, useEffect } from 'react';
import "./styles.css";



export default function SelectEarn(props) {
    return (
        <div
            className="hold-select-action"
        >
            <select
                name="actions"
                className='select-actions'
                onChange={e => {
                    props.setEarn(e.target.value);
                }}
            >
                <option value="None">None</option>
                <option value="Rewards">Rewards</option>
                <option value="Trading fee">Trading fee</option>
                <option value="Swap">Swap</option>
            </select>
        </div>
    )
}