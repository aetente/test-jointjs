import React, { useState, useRef, useCallback, useEffect } from 'react';
import "./styles.css";



export default function SelectCellButtons(props) {

    let [openModalWindow, setOpenModalWindow] = useState(false);

    return (
        <div className='hold-select-cell-buttons'>
            <div className="select-cell-buttons">
                <button onClick={() => {  }}>Protocols</button>
                <button onClick={() => {  }}>Actions</button>
                <button onClick={() => {  }}>Tokens</button>
            </div>
        </div>
    )
}