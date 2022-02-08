import React, { useState, useRef, useCallback, useEffect } from 'react';
import "./styles.css";

export default function HideSelect(props) {

    return (
        <div className='hold-hide-select'>
            <div
                className="hide-select"
                onClick={() => {
                    props.setIsSelectOpen(!props.isSelectOpen)
                }}
            >
                {"<"}
            </div>
        </div>
    )
}