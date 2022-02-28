import React, { useState, useRef, useCallback, useEffect } from 'react';
import "./styles.css";

import { ReactComponent as IconBridge } from "../../assets/drawings/icon-bridge.svg";

export default function BridgeActionButton(props) {

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
            }}
        >
            <IconBridge fill={(isHovered && "#000000") || "#777E91"} />
        </div>
    )
}