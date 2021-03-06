import React, { useState, useRef, useCallback, useEffect } from 'react';
import "./styles.css";

import { ReactComponent as IconLoopAction } from "../../assets/drawings/circle-notch-solid.svg";

export default function LoopActionButton(props) {

    let { addRecentlyUsedAction, actionName, createCircle } = props;

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
            <IconLoopAction stroke={(isHovered && "#000000") || "#777E91"} fill={(isHovered && "#000000") || "#777E91"} />
        </div>
    )
}