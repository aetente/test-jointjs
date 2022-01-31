import React from 'react';
import "./styles.css";

import undo from "./undo.svg";



export default function UndoButton(props) {

    let { reverseGraph } = props;

    return (
        <div className='hold-undo-button'>
            <button onClick={() => { reverseGraph() }}>
                <img src={undo} alt="undo" />
            </button>
        </div>
    )
}