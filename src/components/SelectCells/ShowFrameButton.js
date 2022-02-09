import React, { useState, useRef, useCallback, useEffect } from 'react';
import "./styles.css";

export default function ShowFrameButton(props) {


    const handleShowFrame = () => {
        props.drawFrame();
    }

    return (
        <button className="select-action-button" onClick={handleShowFrame}>Show the frame</button>
    )
}