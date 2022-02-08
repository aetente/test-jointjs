import React, { useState, useRef, useCallback, useEffect } from 'react';
import "./styles.css";


const categories = [
    "Protocols",
    "Actions",
    "Tokens"
]

export default function SelectCellButtons(props) {

    let [category, setCategory] = useState("Protocols");

    const mapCategories = (c) => {
        return (
            <button
                className={`${(c === category && "selected-category") || "unselected-category"}`}
                key={c}
                onClick={() => {
                    setCategory(c)
                    props.setCategory(c)
                }}
            >
                {c}
            </button>
        )
    }

    return (
        <div className='hold-select-cell-buttons'>
            <div className="select-cell-buttons">
                {categories.map(mapCategories)}
            </div>
        </div>
    )
}