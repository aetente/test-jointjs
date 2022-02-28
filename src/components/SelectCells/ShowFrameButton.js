import React, { useState, useRef, useCallback, useEffect } from 'react';
import "./styles.css";
import { ReactComponent as IconVectorSquare } from "../../assets/drawings/vector-square-solid.svg";

export default function ShowFrameButton(props) {

    let { addRecentlyUsedAction } = props;

    let [isHovered, setIsHovered] = useState(false)

    const handleShowFrame = () => {
        props.drawFrame();
        addRecentlyUsedAction(props.actionName);
    }

    return (
        <div className="select-action-button"
            onMouseEnter={() => {
                setIsHovered(true);
            }}
            onMouseLeave={() => {
                setIsHovered(false);
            }}
            onClick={handleShowFrame}
        >
        <IconVectorSquare fill={(isHovered && "#000000") || "#777E91"} />
        </div>
    )
}