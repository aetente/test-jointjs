import React, { useState, useRef, useCallback, useEffect } from 'react';
import "./styles.css";

export default function AutoLayoutButton(props) {

    return (
        <button className="select-action-button" onClick={() => {
            props.layout();
        }}>
            Auto layout
        </button>
    )
}