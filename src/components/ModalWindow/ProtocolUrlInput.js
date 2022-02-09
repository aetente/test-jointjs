import React, { useState, useRef, useCallback, useEffect } from 'react';
import "./styles.css";

export default function ProtocolUrlInput(props) {

    let { activeProtocol, setActiveProtocol } = props;

    return (

        <div className="modal-option">
            <div className="modal-option-title">URL</div>
            <div
                className="hold-select-action"
            >
                <input
                    name="protocol-url"
                    // key={defaultInputValue}
                    className='token-name-input'
                    onChange={e => {
                        // props.setTokenName(e.target.value);
                        setActiveProtocol({ ...activeProtocol, url: e.target.value });
                    }}
                    placeholder={"Enter URL"}
                // defaultValue={defaultInputValue}
                />
            </div>
        </div>
    )
}