import React, { useState, useRef, useCallback, useEffect } from 'react';
import "./styles.css";

export default function TokenInput(props) {


    let linkLabel = props.activeLink && props.activeLink.label(0);
    let defaultInputValue = linkLabel ? linkLabel.attrs.text.tokenName : "COIN";

    return (

        <div className="modal-option">
            <div className="modal-option-title">In What Token</div>
            <div
                className="hold-select-action"
            >
                <input
                    name="token-name"
                    key={defaultInputValue}
                    className='token-name-input'
                    onChange={e => {
                        props.setTokenName(e.target.value);
                    }}
                    defaultValue={defaultInputValue}
                />
            </div>
        </div>
    )
}