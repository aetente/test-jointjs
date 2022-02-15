import React, { useState, useRef, useCallback, useEffect } from 'react';
import CustomSelect from '../CustomSelect/CustomSelect';
import "./styles.css";



export default function SelectToken(props) {

    let {action, tokensToSelect} = props;

    const mapTokenOptions = (token) => {
        return <option key={token} value={token}>{token}</option>
    }

    // let linkLabel = props.activeLink && props.activeLink.label(0);
    let defaultSelectValue = tokensToSelect[0];

    useEffect(() => {
        props.setTokenName(defaultSelectValue.value);
    })

    return (
        <div className="modal-option">
            <div className="modal-option-title header-title">To</div>
            <div className="modal-option-title">Token</div>
            <div
                className="hold-select-action"
            >
                <CustomSelect
                    additionalClass="token-select"
                    name="actions"
                    key={defaultSelectValue}
                    className='select-actions'
                    onChange={e => {
                        console.log(e)
                        props.setTokenName(e.value);
                    }}
                    defaultValue={defaultSelectValue}
                    options={tokensToSelect}
                />
            </div>
        </div>
    )
}