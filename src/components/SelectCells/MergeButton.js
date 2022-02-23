import React, { useState, useRef, useCallback, useEffect } from 'react';
import "./styles.css";

import { ReactComponent as IconMerge } from "../../assets/drawings/icon-merge.svg";

export default function MergeButton(props) {

    let {addRecentlyUsedAction, mergeAction} = props;

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
                mergeAction();
            }}
        >
            <IconMerge fill={(isHovered && "#000000") || "#777E91"} />
        </div>
    )
}