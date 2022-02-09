import React, { useState, useRef, useCallback, useEffect } from 'react';
import "./styles.css";

import { ReactComponent as IconDesignGrid } from "../../assets/drawings/icon-design-grid.svg";

export default function AutoLayoutButton(props) {

    let {addRecentlyUsedAction} = props;

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
                addRecentlyUsedAction(props.actionName);
                props.layout();
            }}
        >
            <IconDesignGrid fill={(isHovered && "#000000") || "#777E91"} />
        </div>
    )
}