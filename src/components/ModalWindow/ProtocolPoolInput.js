import React, { useState, useRef, useCallback, useEffect } from 'react';
import "./styles.css";

export default function ProtocolPoolInput(props) {

    let { activeProtocol, setActiveProtocol, updateProtocols } = props;

    return (

        <div className="modal-option">
            <div className="modal-option-title">Set pool</div>
            <div
                className="hold-select-action"
            >
                <input
                    name="protocol-pool"
                    className='protocol-pool-input'
                    onChange={e => {
                        // props.setTokenName(e.target.value);
                        setActiveProtocol({ ...activeProtocol, pool: e.target.value });
                        updateProtocols({ ...activeProtocol, pool: e.target.value });
                    }}
                    placeholder={"Free style Pool A"}
                    defaultValue={activeProtocol.pool}
                />
            </div>
        </div>
    )
}