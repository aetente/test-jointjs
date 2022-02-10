import React, { useState, useRef, useCallback, useEffect } from 'react';
import "./styles.css";

export default function ProtocolNameInput(props) {

    let { activeProtocol, setActiveProtocol, updateProtocols } = props;

    return (

        <div className="modal-option">
            <div className="modal-option-title">Name protocol</div>
            <div
                className="hold-select-action"
            >
                <input
                    name="protocol-name"
                    className='token-name-input'
                    onChange={e => {
                        // props.setTokenName(e.target.value);
                        setActiveProtocol({ ...activeProtocol, name: e.target.value });
                        updateProtocols({ ...activeProtocol, name: e.target.value });
                    }}
                    placeholder={"Protocol Name"}
                    defaultValue={activeProtocol.name}
                />
            </div>
        </div>
    )
}