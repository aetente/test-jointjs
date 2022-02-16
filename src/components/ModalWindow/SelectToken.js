import React, { useState, useRef, useCallback, useEffect } from 'react';
import CustomSelect from '../CustomSelect/CustomSelect';
import "./styles.css";



export default function SelectToken(props) {

    let {action, tokensToSelect} = props;

    const mapTokenOptions = (token) => {
        return <option key={token} value={token}>{token}</option>
    }

    // let linkLabel = props.activeLink && props.activeLink.label(0);
    let linkLabel = props.activeLink && props.activeLink.label(0);
    let defaultSelectValue = linkLabel ? linkLabel.attrs.text.tokenName : tokensToSelect[0].value;

    useEffect(() => {
        props.setTokenName(defaultSelectValue);
    })

    return (
        <div className="modal-option">
            {(action[0].name === "Swap" && <>
                <div className="modal-option-title header-title">To</div>
                <div className="modal-option-title">Token</div>
            </>) || ( <div className="modal-option-title">In what Token</div>)}
            <div
                className="hold-select-action"
            >
                <CustomSelect
                    additionalClass="token-select"
                    name="actions"
                    key={defaultSelectValue}
                    className='select-actions'
                    onChange={e => {
                        props.setTokenName(e.value);
                    }}
                    defaultValue={defaultSelectValue}
                    options={tokensToSelect}
                />
            </div>
        </div>
    )
}