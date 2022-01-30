import React, { useState, useRef, useCallback, useEffect } from 'react';
import "./styles.css";

import close from "./close.svg";

export default function BaseToken(props) {

    let { addBaseToken, setOpenModalWindow } = props;

    let [tokenName, setTokenName] = useState("");
    let [tokenURL, setTokenURL] = useState("");

    return (
        <div
            className="hold-modal base-token"
        >
            <div className='modal-options'>
                <div className="modal-title">
                    <div>Base Token</div>
                    <div
                        className='title-close-button'
                        onClick={() => {
                            setOpenModalWindow(false);
                        }}
                    >
                        <img src={close} alt="close" />
                    </div>
                </div>

                <div className="modal-option">
                    <div className="modal-option-title">Name</div>
                    <div
                        className="hold-select-action"
                    >
                        <input
                            name="token-name"
                            // key={defaultInputValue}
                            className='token-name-input base-token-input'
                            onChange={(e) => setTokenName(e.target.value)}
                            // defaultValue={defaultInputValue}
                            placeholder='Enter token name'
                        />
                    </div>
                </div>

                
                <div className="modal-option">
                    <div className="modal-option-title">URL</div>
                    <div
                        className="hold-select-action"
                    >
                        <input
                            name="token-name"
                            // key={defaultInputValue}
                            className='token-name-input base-token-input'
                            onChange={(e) => setTokenURL(e.target.value)}
                            // defaultValue={defaultInputValue}
                            placeholder='Enter token URL'
                        />
                    </div>
                </div>

                <div className="modal-actions">
                    <button
                        className='add-base-token'
                        onClick={() => {
                            if (tokenName) {
                                addBaseToken(tokenName, tokenURL);
                                setOpenModalWindow(false);
                            }
                        }}
                    >Add Base Token</button>
                </div>
            </div>
        </div>
    )
}