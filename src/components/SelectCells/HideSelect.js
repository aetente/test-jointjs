import React, { useState, useRef, useCallback, useEffect } from 'react';
import "./styles.css";


import iconArrow from "./icon-arrow.svg";

export default function HideSelect(props) {

    return (
        <div className='hold-hide-select'>
            <div
                className="hide-select"
                onClick={() => {
                    props.setIsSelectOpen(!props.isSelectOpen)
                }}
            >
                <img
                    className={`close-drag-and-drop ${!props.isSelectOpen && "rotate-180"}`}
                    src={iconArrow}
                    alt={(props.isSelectOpen && "<") || ">"}
                />
            </div>
        </div>
    )
}