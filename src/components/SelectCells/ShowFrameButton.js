import React, { useState, useRef, useCallback, useEffect } from 'react';
import "./styles.css";

export default function ShowFrameButton(props) {

    let {addRecentlyUsedAction} = props;

    const handleShowFrame = () => {
        props.drawFrame();
        addRecentlyUsedAction(props.actionName);
    }

    return (
        <div className="select-action-button" onClick={handleShowFrame}>
            
        </div>
    )
}