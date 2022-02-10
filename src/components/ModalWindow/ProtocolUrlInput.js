import React, { useState, useRef, useCallback, useEffect } from 'react';
import "./styles.css";

export default function ProtocolUrlInput(props) {

    let { activeProtocol, setActiveProtocol, updateProtocols } = props;

    return (

        <div className="modal-option">
            <div className="modal-option-title">URL</div>
            <div
                className="hold-select-action"
            >
                <input
                    name="protocol-url"
                    className='token-name-input'
                    onChange={e => {
                        setActiveProtocol({ ...activeProtocol, url: e.target.value });
                        updateProtocols({ ...activeProtocol, url: e.target.value })
                    }}
                    placeholder={"Enter URL"}
                    defaultValue={activeProtocol.url}
                />
            </div>
        </div>
    )
}