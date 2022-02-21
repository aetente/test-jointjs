import React, { useState, useRef, useCallback, useEffect } from 'react';
import "./styles.css";

export default function LoopActionButton(props) {

    let {addRecentlyUsedAction, actionName, createCircle} = props;

    let [isHovered, setIsHovered] = useState(false)

    return (
        <div
            className="select-action-button"
            onMouseEnter={() => {
                setIsHovered(true);
            }}
            onMouseLeave={() => {
                setIsHovered(false);
            }}
            onClick={() => {
                addRecentlyUsedAction(actionName);
                createCircle();
            }}
        >
        </div>
    )
}